// npm run seed:admin -- info@pay-quic.com admin   -> creates a verified admin and prints a set-password link
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { neon } from '@neondatabase/serverless';

const [email, username = 'admin'] = process.argv.slice(2);
if (!email) throw new Error('Usage: npm run seed:admin -- <email> [username]');
const sql = neon(process.env.DATABASE_URL);
const hash = await bcrypt.hash(crypto.randomBytes(24).toString('hex'), 12);
const [user] = await sql`insert into users (username, email, password_hash, role, email_verified)
  values (${username}, ${email.toLowerCase()}, ${hash}, 'admin', true)
  on conflict (lower(email)) do update set role = 'admin', email_verified = true returning id`;
const raw = crypto.randomBytes(32).toString('hex');
await sql`insert into tokens (user_id, type, token_hash, expires_at)
  values (${user.id}, 'reset', ${crypto.createHash('sha256').update(raw).digest('hex')}, now() + interval '24 hours')`;
console.log(`Set the admin password here (valid 24h):\n${process.env.SITE_URL || 'http://localhost:3000'}/reset-password?token=${raw}`);
