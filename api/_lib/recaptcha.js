import { HttpError } from './http.js';

// reCAPTCHA v2 server-side check
export async function verifyRecaptcha(token, ip) {
  const body = new URLSearchParams({ secret: process.env.RECAPTCHA_SECRET, response: token });
  if (ip) body.set('remoteip', ip);
  const res = await fetch('https://www.google.com/recaptcha/api/siteverify', { method: 'POST', body });
  const data = await res.json();
  if (!data.success) throw new HttpError(400, 'errors.recaptchaFailed');
}
