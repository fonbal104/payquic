export class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}
export const getCookie = (req, name) =>
  (req.headers.cookie || '').split(';').map((c) => c.trim()).find((c) => c.startsWith(`${name}=`))?.slice(name.length + 1);
export const sessionCookie = (value, maxAge) =>
  `session=${value}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${maxAge}`;
export const siteUrl = () => process.env.SITE_URL || `https://${process.env.VERCEL_URL}`;
