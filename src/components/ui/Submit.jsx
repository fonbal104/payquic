export default function Submit({ busy, children, className = '' }) {
  return (
    <button type="submit" disabled={busy} className={`rounded-full bg-brand-cta px-8 py-3 text-sm font-semibold text-white disabled:opacity-60 ${className}`}>
      {children}
    </button>
  );
}
