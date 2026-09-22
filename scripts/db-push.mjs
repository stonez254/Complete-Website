import { readFile } from 'node:fs/promises';
import { neon } from '@neondatabase/serverless';

const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL is not configured');

const sql = neon(url);
const schema = await readFile(new URL('../db/schema.sql', import.meta.url), 'utf8');

for (const statement of schema.split(';').map(s => s.trim()).filter(Boolean)) {
  await sql.unsafe(statement);
}

console.log('Database schema applied successfully.');
