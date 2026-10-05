import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import brand from '../../config/brand';
import useLocalizedPath from '../../lib/useLocalizedPath';
import { useAuth } from '../../features/auth/AuthContext';

function USFlag() {
  return (
    <svg viewBox="0 0 24 16" className="h-4 w-6 shrink-0" aria-hidden="true">
      <rect width="24" height="16" rx="1" fill="#fff" />
      <path fill="#B22234" d="M0 0h24v1.23H0zm0 2.46h24v1.23H0zm0 2.46h24v1.23H0zm0 2.46h24v1.23H0zm0 2.46h24v1.23H0zm0 2.46h24v1.23H0zm0 2.46h24V16H0z" />
      <rect width="10.5" height="8.62" rx=".5" fill="#3C3B6E" />
      <g fill="#fff">
        <circle cx="1.5" cy="1.2" r=".35" /><circle cx="3.5" cy="1.2" r=".35" /><circle cx="5.5" cy="1.2" r=".35" /><circle cx="7.5" cy="1.2" r=".35" /><circle cx="9.5" cy="1.2" r=".35" />
        <circle cx="2.5" cy="2.45" r=".35" /><circle cx="4.5" cy="2.45" r=".35" /><circle cx="6.5" cy="2.45" r=".35" /><circle cx="8.5" cy="2.45" r=".35" />
        <circle cx="1.5" cy="3.7" r=".35" /><circle cx="3.5" cy="3.7" r=".35" /><circle cx="5.5" cy="3.7" r=".35" /><circle cx="7.5" cy="3.7" r=".35" /><circle cx="9.5" cy="3.7" r=".35" />
        <circle cx="2.5" cy="4.95" r=".35" /><circle cx="4.5" cy="4.95" r=".35" /><circle cx="6.5" cy="4.95" r=".35" /><circle cx="8.5" cy="4.95" r=".35" />
        <circle cx="1.5" cy="6.2" r=".35" /><circle cx="3.5" cy="6.2" r=".35" /><circle cx="5.5" cy="6.2" r=".35" /><circle cx="7.5" cy="6.2" r=".35" /><circle cx="9.5" cy="6.2" r=".35" />
      </g>
    </svg>
  );
}

function JapanFlag() {
  return (
    <svg viewBox="0 0 24 16" className="h-4 w-6 shrink-0" aria-hidden="true">
      <rect width="24" height="16" rx="1" fill="#fff" />
      <circle cx="12" cy="8" r="4.5" fill="#BC002D" />
    </svg>
  );
}

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
  const isJapanese = i18n.language === 'ja';

  return (
    <header className="relative bg-brand-dark">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link to={lp('/')} aria-label={brand.name}><img src={brand.logo} alt={brand.name} className="h-10" /></Link>
        <button className="text-2xl text-white md:hidden" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Menu">☰</button>
        <nav className={`${open ? 'flex' : 'hidden'} absolute left-0 right-0 top-full z-10 flex-col gap-4 bg-brand-dark p-6 md:static md:flex md:flex-row md:items-center md:gap-8 md:p-0`}>
          {items.map(([to, label]) => (
            <NavLink key={to} to={lp(to)} end={to === '/'} className={link} onClick={() => setOpen(false)}>{label}</NavLink>
          ))}
          <Link
            to={otherLangPath}
            className="inline-flex items-center gap-2 font-semibold text-white"
            onClick={() => setOpen(false)}
            aria-label={isJapanese ? 'Switch to English' : 'Switch to Japanese'}
          >
            {isJapanese ? <JapanFlag /> : <USFlag />}
            <span>{t('nav.switchLang')}</span>
          </Link>
          {user
            ? <button className={pill} onClick={() => { setOpen(false); logout(); }}>{t('nav.logout')}</button>
            : <Link to={lp('/login')} className={pill} onClick={() => setOpen(false)}>{t('nav.login')}</Link>}
        </nav>
      </div>
    </header>
  );
}
