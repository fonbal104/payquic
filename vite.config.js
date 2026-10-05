import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Public, indexable pages (each exists in English and under /ja)
const PAGES = ['', 'about', 'contact', 'new-client-inquiry', 'privacy-policy', 'terms'];

// Emits sitemap.xml and robots.txt using SITE_URL (set it in Vercel).
const seoFiles = (site) => ({
  name: 'seo-files',
  generateBundle() {
    if (!site) { console.warn('SITE_URL not set: skipping sitemap.xml and robots.txt'); return; }
    const url = (lang, p) => (lang || p ? `${site}${lang ? `/${lang}` : ''}${p ? `/${p}` : ''}` : `${site}/`);
    const entries = PAGES.flatMap((p) => ['', 'ja'].map((lang) =>
      `<url><loc>${url(lang, p)}</loc><xhtml:link rel="alternate" hreflang="en" href="${url('', p)}"/><xhtml:link rel="alternate" hreflang="ja" href="${url('ja', p)}"/></url>`));
    this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${entries.join('')}</urlset>` });
    this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${site}/sitemap.xml\n` });
  },
});

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const site = (process.env.SITE_URL || env.SITE_URL || '').replace(/\/$/, '');
  return { plugins: [react(), tailwindcss(), seoFiles(site)] };
});
