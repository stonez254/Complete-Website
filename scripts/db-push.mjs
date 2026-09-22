import { readFile, readdir } from 'node:fs/promises';
import { neon } from '@neondatabase/serverless';

const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL is not configured');

const sql = neon(url);
const root = new URL('../', import.meta.url);
const schema = await readFile(new URL('../db/schema.sql', import.meta.url), 'utf8');

const schemaStatements = schema
  .split(';')
  .map(statement => statement.trim())
  .filter(Boolean);

// Migration tracking must exist before migrations run. Each migration is a
// complete, immutable step identified by its filename.
await sql`CREATE TABLE IF NOT EXISTS schema_migrations (
  version TEXT PRIMARY KEY,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
)`;

const migrationDir = new URL('../db/migrations/', import.meta.url);
let migrationFiles = [];
try {
  migrationFiles = (await readdir(migrationDir, { withFileTypes: true }))
    .filter(entry => entry.isFile() && /^\\d+_.+\\.sql$/i.test(entry.name))
    .map(entry => entry.name)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
} catch (error) {
  if (error?.code !== 'ENOENT') throw error;
}

const appliedRows = await sql`SELECT version FROM schema_migrations ORDER BY version`;
const applied = new Set(appliedRows.map(row => String(row.version)));

for (const file of migrationFiles) {
  if (applied.has(file)) continue;

  const migration = await readFile(new URL(file, migrationDir), 'utf8');
  const statements = migration
    .split(';')
    .map(statement => statement.trim())
    .filter(Boolean);

  console.log(`Applying database migration ${file}...`);
  for (const statement of statements) {
    try {
      await sql.unsafe(statement);
    } catch (error) {
      console.error(`Database migration ${file} failed.`);
      console.error(error?.message || error);
      throw error;
    }
  }

  await sql`INSERT INTO schema_migrations (version) VALUES (${file})`;
  console.log(`Applied database migration ${file}.`);
}

let appliedSchemaStatements = 0;
for (const statement of schemaStatements) {
  try {
    await sql.unsafe(statement);
    appliedSchemaStatements += 1;
  } catch (error) {
    console.error(`Database schema statement ${appliedSchemaStatements + 1} failed.`);
    console.error(error?.message || error);
    throw error;
  }
}

console.log(`Database schema applied successfully (${appliedSchemaStatements} statements; migrations tracked: ${migrationFiles.length}).`);
