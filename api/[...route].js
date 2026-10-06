// Single Vercel function serving every /api/* route.
import bcrypt from 'bcryptjs';
import { z, ZodError } from 'zod';
import { sql } from './_lib/db.js';
import { HttpError, sessionCookie, siteUrl } from './_lib/http.js';
import { getSessionUser, newToken, publicUser, requireAdmin, requireUser, sha, signSession } from './_lib/auth.js';
import { sendInquiry, sendLink } from './_lib/mail.js';
import { verifyRecaptcha } from './_lib/recaptcha.js';
import { changePasswordSchema, currentInquirySchema, forgotSchema, newInquirySchema, loginSchema, profileSchema, registerSchema, resetSchema } from '../shared/schemas.js';

const findByIdentifier = async (id) => {
  const v = id.trim().toLowerCase();
  const [u] = await sql`select * from users where lower(email) = ${v} or lower(username) = ${v} limit 1`;
  return u;
};

async function issueAndSend(user, kind, hours) {
  const { raw, hash } = newToken();
  await sql`insert into tokens (user_id, type, token_hash, expires_at)
    values (${user.id}, ${kind}, ${hash}, now() + (${hours} * interval '1 hour'))`;
  const path = kind === 'verify' ? '/verify-email' : '/reset-password';
  const url = `${siteUrl()}${user.lang === 'ja' ? '/ja' : ''}${path}?token=${raw}`;
  try { await sendLink({ to: user.email, lang: user.lang, kind, url }); }
  catch (e) { console.error('mail failed', e.message); }
}

async function consumeToken(raw, type) {
  const [t] = await sql`select * from tokens where token_hash = ${sha(raw)} and type = ${type} and used_at is null and expires_at > now()`;
  if (!t) throw new HttpError(400, 'errors.invalidToken');
  await sql`update tokens set used_at = now() where id = ${t.id}`;
  return t.user_id;
}

// Saves first (the database is the source of truth), then notifies staff by email.
async function saveInquiry(req, kind, { recaptcha, terms, ...data }, userId, replyTo) {
  await verifyRecaptcha(recaptcha, req.headers['x-forwarded-for']?.split(',')[0]);
  await sql`insert into inquiries (user_id, kind, data) values (${userId}, ${kind}, ${JSON.stringify(data)}::jsonb)`;
  try { await sendInquiry({ kind, data, replyTo }); }
  catch (e) { console.error('inquiry mail failed', e.message); }
}

let dummyHash;
const routes = {
  'POST /auth/register': async (req) => {
    const d = registerSchema.parse(req.body);
    await verifyRecaptcha(d.recaptcha, req.headers['x-forwarded-for']?.split(',')[0]);
    const [dup] = await sql`select 1 from users where lower(email) = ${d.email} or lower(username) = ${d.username.toLowerCase()}`;
    if (dup) throw new HttpError(409, 'errors.accountExists');
    const hash = await bcrypt.hash(d.password, 12);
    const [u] = await sql`insert into users (username, email, password_hash, first_name, last_name, phone, address, lang)
      values (${d.username}, ${d.email}, ${hash}, ${d.firstName}, ${d.lastName}, ${d.phone}, ${d.address}, ${d.lang}) returning *`;
    await issueAndSend(u, 'verify', 24);
    return [201, { ok: true }];
  },
  'POST /auth/resend-verification': async (req) => {
    const { identifier } = forgotSchema.omit({ recaptcha: true }).parse(req.body);
    const u = await findByIdentifier(identifier);
    if (u && !u.email_verified) await issueAndSend(u, 'verify', 24);
    return { ok: true };
  },
  'POST /auth/verify': async (req) => {
    const userId = await consumeToken(String(req.body?.token ?? ''), 'verify');
    await sql`update users set email_verified = true where id = ${userId}`;
    return { ok: true };
  },
  'POST /auth/login': async (req, res) => {
    const d = loginSchema.parse(req.body);
    await verifyRecaptcha(d.recaptcha, req.headers['x-forwarded-for']?.split(',')[0]);
    const { identifier, password } = d;
    const u = await findByIdentifier(identifier);
    if (u?.locked_until && new Date(u.locked_until) > new Date()) throw new HttpError(429, 'errors.locked');
    dummyHash ??= bcrypt.hashSync('dummy-password', 12);
    const ok = await bcrypt.compare(password, u?.password_hash ?? dummyHash);
    if (!u || !ok) {
      if (u) {
        const n = u.failed_logins + 1;
        if (n >= 5) await sql`update users set failed_logins = 0, locked_until = now() + interval '15 minutes' where id = ${u.id}`;
        else await sql`update users set failed_logins = ${n} where id = ${u.id}`;
      }
      throw new HttpError(401, 'errors.invalidCredentials');
    }
    if (!u.email_verified) throw new HttpError(403, 'errors.notVerified');
    await sql`update users set failed_logins = 0, locked_until = null where id = ${u.id}`;
    res.setHeader('Set-Cookie', sessionCookie(await signSession(u), 7 * 86400));
    return { user: publicUser(u) };
  },
  'POST /auth/logout': async (req, res) => {
    res.setHeader('Set-Cookie', sessionCookie('', 0));
    return { ok: true };
  },
  'GET /auth/me': async (req) => {
    const u = await getSessionUser(req);
    return { user: u ? publicUser(u) : null };
  },
  'POST /auth/forgot': async (req) => {
    const d = forgotSchema.parse(req.body);
    await verifyRecaptcha(d.recaptcha, req.headers['x-forwarded-for']?.split(',')[0]);
    const { identifier } = d;
    const u = await findByIdentifier(identifier);
    if (u) await issueAndSend(u, 'reset', 1);
    return { ok: true }; // same answer whether or not the account exists
  },
  'POST /auth/reset': async (req) => {
    const d = resetSchema.parse(req.body);
    await verifyRecaptcha(d.recaptcha, req.headers['x-forwarded-for']?.split(',')[0]);
    const { token, password } = d;
    const userId = await consumeToken(token, 'reset');
    const hash = await bcrypt.hash(password, 12);
    // Using the emailed link also proves the inbox, so the email counts as verified.
    await sql`update users set password_hash = ${hash}, email_verified = true, failed_logins = 0, locked_until = null where id = ${userId}`;
    return { ok: true };
  },
  'PATCH /account/profile': async (req) => {
    const u = await requireUser(req);
    const d = profileSchema.parse(req.body);
    const [n] = await sql`update users set first_name = ${d.firstName}, last_name = ${d.lastName}, phone = ${d.phone}, address = ${d.address}
      where id = ${u.id} returning *`;
    return { user: publicUser(n) };
  },
  'POST /account/password': async (req) => {
    const u = await requireUser(req);
    const d = changePasswordSchema.parse(req.body);
    if (!(await bcrypt.compare(d.current, u.password_hash))) throw new HttpError(400, 'errors.wrongPassword');
    await sql`update users set password_hash = ${await bcrypt.hash(d.password, 12)} where id = ${u.id}`;
    return { ok: true };
  },
  'POST /inquiries/new': async (req) => {
    const d = newInquirySchema.parse(req.body);
    // Public inquiries do not require a database. Verify the CAPTCHA, then send the inquiry by email.
    const { recaptcha, terms, ...data } = d;
    await verifyRecaptcha(recaptcha, req.headers['x-forwarded-for']?.split(',')[0]);
    await sendInquiry({ kind: 'new', data, replyTo: d.email });
    return [201, { ok: true }];
  },
  'POST /inquiries/current': async (req) => {
    const u = await requireUser(req);
    const d = currentInquirySchema.parse(req.body);
    await saveInquiry(req, 'current', { ...d, email: u.email, phone: u.phone }, u.id, u.email);
    return [201, { ok: true }];
  },
  'GET /admin/inquiries': async (req) => {
    await requireAdmin(req);
    const rows = await sql`select i.id, i.kind, i.status, i.data, i.created_at, u.email as user_email
      from inquiries i left join users u on u.id = i.user_id order by i.created_at desc limit 200`;
    return { inquiries: rows };
  },
  'PATCH /admin/inquiries/:id': async (req) => {
    await requireAdmin(req);
    const { status } = z.object({ status: z.enum(['new', 'in_progress', 'done']) }).parse(req.body);
    await sql`update inquiries set status = ${status} where id = ${req.params.id}`;
    return { ok: true };
  },
  'GET /inquiries': async (req) => {
    const u = await requireUser(req);
    const rows = await sql`select id, kind, status, data, created_at from inquiries where user_id = ${u.id} order by created_at desc limit 50`;
    return { inquiries: rows };
  },
};

export default async function handler(req, res) {
  try {
    const requestUrl = new URL(req.url, 'http://x');
    const rewrittenRoute = requestUrl.searchParams.get('route');
    const path = (rewrittenRoute ? `/${rewrittenRoute}` : requestUrl.pathname.replace(/^\/api/, '')).replace(/\/$/, '');
    const idMatch = path.match(/^\/admin\/inquiries\/([0-9a-f-]{36})$/);
    req.params = { id: idMatch?.[1] };
    const route = routes[idMatch ? `${req.method} /admin/inquiries/:id` : `${req.method} ${path}`];
    if (!route) throw new HttpError(404, 'errors.generic');
    // Blocks cross-site form posts; browsers can't send JSON cross-origin without a preflight.
    if (req.method !== 'GET' && !String(req.headers['content-type']).includes('application/json')) throw new HttpError(415, 'errors.generic');
    const out = await route(req, res);
    const [status, body] = Array.isArray(out) ? out : [200, out];
    res.status(status).json(body);
  } catch (e) {
    if (e instanceof HttpError) return res.status(e.status).json({ error: e.message });
    if (e instanceof ZodError) return res.status(400).json({ error: 'errors.generic', fields: Object.fromEntries(e.issues.map((i) => [i.path.join('.'), i.message])) });
    console.error(e);
    res.status(500).json({ error: 'errors.generic' });
  }
}
