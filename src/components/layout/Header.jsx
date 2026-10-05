import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import brand from '../../config/brand';
import useLocalizedPath from '../../lib/useLocalizedPath';
import { useAuth } from '../../features/auth/AuthContext';

export default function Header() {
  const { t, i18n } = useTranslation();
  const lp = useLocalizedPath();
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  // Same page, other language: /about <-> /ja/about
  const stripped = pathname.replace(/^\/ja(?=\/|$)/, '') || '/';
  const otherLangPath = i18n.language === 'ja' ? stripped : `/ja${stripped === '/' ? '' : stripped}`;

  const link = ({ isActive }) => `font-semibold ${isActive ? 'text-brand-accent' : 'text-white'}`;
  const items = [['/', t('nav.home')], ['/about', t('nav.about')], ['/contact', t('nav.contact')], ...(user ? [['/profile', t('nav.profile')]] : []), ...(user?.role === 'admin' ? [['/admin/inquiries', t('pages.admin-inquiries')]] : [])];
  const pill = 'rounded-full bg-white/15 px-6 py-3 text-center font-semibold text-white';

  return (
    <header className="relative bg-brand-dark">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link to={lp('/')} aria-label={brand.name}><img src={brand.logo} alt={brand.name} className="h-10" /></Link>
        <button className="text-2xl text-white md:hidden" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Menu">☰</button>
        <nav className={`${open ? 'flex' : 'hidden'} absolute left-0 right-0 top-full z-10 flex-col gap-4 bg-brand-dark p-6 md:static md:flex md:flex-row md:items-center md:gap-8 md:p-0`}>
          {items.map(([to, label]) => (
            <NavLink key={to} to={lp(to)} end={to === '/'} className={link} onClick={() => setOpen(false)}>{label}</NavLink>
          ))}
          <Link to={otherLangPath} className="font-semibold text-white" onClick={() => setOpen(false)}>{t('nav.switchLang')}</Link>
          {user
            ? <button className={pill} onClick={() => { setOpen(false); logout(); }}>{t('nav.logout')}</button>
            : <Link to={lp('/login')} className={pill} onClick={() => setOpen(false)}>{t('nav.login')}</Link>}
        </nav>
      </div>
    </header>
  );
}
