export async function api(path, { method = 'GET', body } = {}) {
  const res = await fetch(`/api${path}`, {
    method,
    headers: method === 'GET' ? {} : { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : method === 'GET' ? undefined : '{}',
    credentials: 'same-origin',
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.error || 'errors.generic'), { status: res.status });
  return data;
}
// Server and client validation both send i18n keys; anything else becomes the generic message.
export const apiError = (t, e) => t(e?.message?.startsWith('errors.') ? e.message : 'errors.generic');
export const safeRedirect = (value) => (value && value.startsWith('/') && !value.startsWith('//') ? value : null);
