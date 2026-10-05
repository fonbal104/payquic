import crypto from 'node:crypto';
import { SignJWT, jwtVerify } from 'jose';
import { sql } from './db.js';
import { getCookie, HttpError } from './http.js';

const key = () => new TextEncoder().encode(process.env.JWT_SECRET);
export const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
export const newToken = () => { const raw = crypto.randomBytes(32).toString('hex'); return { raw, hash: sha(raw) }; };

export const signSession = (user) =>
  new SignJWT({ role: user.role }).setProtectedHeader({ alg: 'HS256' }).setSubject(user.id).setIssuedAt().setExpirationTime('7d').sign(key());

export const publicUser = (u) => ({
  id: u.id, username: u.username, email: u.email, firstName: u.first_name, lastName: u.last_name,
  phone: u.phone, address: u.address, role: u.role,
});

export async function getSessionUser(req) {
  const token = getCookie(req, 'session');
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key());
    const [u] = await sql`select * from users where id = ${payload.sub}`;
    return u ?? null;
  } catch { return null; }
}

export async function requireUser(req) {
  const u = await getSessionUser(req);
  if (!u) throw new HttpError(401, 'errors.unauthorized');
  return u;
}

export async function requireAdmin(req) {
  const u = await requireUser(req);
  if (u.role !== 'admin') throw new HttpError(403, 'errors.unauthorized');
  return u;
}
