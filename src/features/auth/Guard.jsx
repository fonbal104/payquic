import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import useLocalizedPath from '../../lib/useLocalizedPath';
import { safeRedirect } from '../../lib/api';

// mode "user": logged-in only (else /login?redirect=...). "admin": admins only. "guest": logged-out only.
// The API enforces access too; this only shapes what the browser shows.
export default function Guard({ mode, children }) {
  const { user, loading } = useAuth();
  const lp = useLocalizedPath();
  const { pathname, search } = useLocation();
  if (loading) return <div className="py-32 text-center text-slate-400">…</div>;
  if (mode !== 'guest' && !user) return <Navigate to={`${lp('/login')}?redirect=${encodeURIComponent(pathname + search)}`} replace />;
  if (mode === 'admin' && user.role !== 'admin') return <Navigate to={lp('/')} replace />;
  if (mode === 'guest' && user) return <Navigate to={safeRedirect(new URLSearchParams(search).get('redirect')) || lp('/profile')} replace />;
  return children;
}
