import { readFile } from 'node:fs/promises';
import { neon } from '@neondatabase/serverless';

const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL is not configured');

const sql = neon(url);
const schema = await readFile(new URL('../db/schema.sql', import.meta.url), 'utf8');

const statements = schema
  .split(';')
  .map(statement => statement.trim())
  .filter(Boolean);

for (const statement of statements) {
  await sql.unsafe(statement);
}

console.log(`Database schema applied successfully (${statements.length} statements).`);
