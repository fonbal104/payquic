// npm run migrate  (reads DATABASE_URL from .env.local)
import { readFileSync } from 'node:fs';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);
const statements = readFileSync(new URL('../db/schema.sql', import.meta.url), 'utf8').split(';').map((s) => s.trim()).filter(Boolean);
for (const s of statements) await sql.query(s);
console.log(`Applied ${statements.length} statements.`);
