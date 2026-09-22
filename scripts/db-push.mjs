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

let applied = 0;
for (const statement of statements) {
  try {
    await sql.unsafe(statement);
    applied += 1;
  } catch (error) {
    console.error(`Database schema statement ${applied + 1} failed.`);
    console.error(error?.message || error);
    throw error;
  }
}

console.log(`Database schema applied successfully (${applied} statements).`);
