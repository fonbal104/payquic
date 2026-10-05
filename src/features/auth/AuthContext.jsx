import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../../lib/api';

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api('/auth/me').then((r) => setUser(r.user)).catch(() => setUser(null)).finally(() => setLoading(false));
  }, []);

  const login = async (body) => { const r = await api('/auth/login', { method: 'POST', body }); setUser(r.user); return r.user; };
  const logout = async () => { await api('/auth/logout', { method: 'POST' }); setUser(null); };
  return <Ctx.Provider value={{ user, setUser, loading, login, logout }}>{children}</Ctx.Provider>;
}
