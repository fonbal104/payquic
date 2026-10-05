export default function Notice({ type = 'error', children }) {
  if (!children) return null;
  const tone = type === 'error' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-800';
  return <p role={type === 'error' ? 'alert' : 'status'} className={`mb-5 rounded-md px-4 py-3 text-sm ${tone}`}>{children}</p>;
}
