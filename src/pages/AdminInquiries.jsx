import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PageHero from '../components/layout/PageHero';
import Notice from '../components/ui/Notice';
import { api } from '../lib/api';

// Staff inbox (English only). Admin role is enforced by the API as well as the route guard.
const STATUSES = { new: 'New', in_progress: 'In progress', done: 'Done' };

export default function AdminInquiries() {
  const { t } = useTranslation();
  const [rows, setRows] = useState(null);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');

  useEffect(() => { api('/admin/inquiries').then((r) => setRows(r.inquiries)).catch(() => setError('Could not load inquiries.')); }, []);
  const setStatus = async (id, status) => {
    try { await api(`/admin/inquiries/${id}`, { method: 'PATCH', body: { status } }); setRows((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r))); }
    catch { setError('Could not update the status.'); }
  };
  const shown = (rows ?? []).filter((r) => filter === 'all' || r.status === filter);

  return (
    <>
      <PageHero title={t('pages.admin-inquiries')} />
      <section className="mx-auto max-w-6xl px-6 py-12">
        <Notice>{error}</Notice>
        <div className="mb-6 flex flex-wrap gap-2">
          {['all', ...Object.keys(STATUSES)].map((s) => (
            <button key={s} onClick={() => setFilter(s)} aria-pressed={filter === s}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${filter === s ? 'bg-brand-dark text-white' : 'bg-slate-100 text-brand-dark'}`}>
              {s === 'all' ? 'All' : STATUSES[s]}
            </button>
          ))}
        </div>
        {rows && shown.length === 0 && <p className="text-sm text-slate-500">No inquiries.</p>}
        <ul className="divide-y divide-slate-200 border border-slate-200">
          {shown.map((r) => (
            <li key={r.id} className="p-4 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="font-semibold text-brand-dark">{r.kind === 'new' ? 'New client' : 'Current client'}</span>
                  <span className="ml-3 text-slate-500">{new Date(r.created_at).toLocaleString()}</span>
                  <div>{[r.data.firstName, r.data.lastName].filter(Boolean).join(' ')} · {r.data.email ?? r.user_email}</div>
                </div>
                <select value={r.status} onChange={(e) => setStatus(r.id, e.target.value)} aria-label="Status" className="rounded-md bg-slate-100 px-3 py-2">
                  {Object.entries(STATUSES).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
              <details className="mt-2">
                <summary className="cursor-pointer text-brand-secondary">Details</summary>
                <dl className="mt-2 grid grid-cols-[max-content_1fr] gap-x-6 gap-y-1">
                  {Object.entries(r.data).map(([k, v]) => <div key={k} className="contents"><dt className="font-semibold">{k}</dt><dd className="break-words">{String(v)}</dd></div>)}
                </dl>
              </details>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
