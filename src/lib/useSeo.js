import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import brand from '../config/brand';

const NOINDEX = new Set(['login', 'register', 'reset-password', 'verify-email', 'profile', 'current-client-inquiry', 'admin-inquiries']);

const setMeta = (attr, name, content) => {
  let el = document.head.querySelector(`meta[${attr}="${name}"]`);
  if (!el) { el = document.createElement('meta'); el.setAttribute(attr, name); document.head.appendChild(el); }
  el.setAttribute('content', content);
};

// Per-page title, description, canonical, hreflang and social tags.
export default function useSeo() {
  const { pathname } = useLocation();
  const { t, i18n } = useTranslation();
  useEffect(() => {
    const stripped = pathname.replace(/^\/ja(?=\/|$)/, '').replace(/\/$/, '');
    const key = stripped.slice(1).replace('/', '-') || 'home';
    const base = `https://${brand.domain}`;
    const hasSeo = i18n.exists(`seo.${key}.title`);
    const own = hasSeo ? t(`seo.${key}.title`) : i18n.exists(`pages.${key}`) ? t(`pages.${key}`) : '';
    const title = key === 'home' ? `${brand.name} – ${own}` : own ? `${own} | ${brand.name}` : brand.name;
    const description = hasSeo ? t(`seo.${key}.description`) : '';
    const url = `${base}${i18n.language === 'ja' ? '/ja' : ''}${stripped}` || `${base}/`;

    document.title = title;
    setMeta('name', 'robots', NOINDEX.has(key) ? 'noindex, nofollow' : 'index, follow');
    if (description) setMeta('name', 'description', description);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:locale', i18n.language === 'ja' ? 'ja_JP' : 'en_US');
    setMeta('property', 'og:site_name', brand.name);

    document.head.querySelectorAll('link[data-seo]').forEach((l) => l.remove());
    [['canonical', null, url], ['alternate', 'en', `${base}${stripped}` || `${base}/`], ['alternate', 'ja', `${base}/ja${stripped}`], ['alternate', 'x-default', `${base}${stripped}` || `${base}/`]]
      .forEach(([rel, hreflang, href]) => {
        const l = document.createElement('link');
        l.rel = rel; l.href = href; l.dataset.seo = '1';
        if (hreflang) l.hreflang = hreflang;
        document.head.appendChild(l);
      });
  }, [pathname, i18n.language, t, i18n]);
}
