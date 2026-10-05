import ReactMarkdown from 'react-markdown';
import { useTranslation } from 'react-i18next';
import PageHero from '../components/layout/PageHero';
import brand from '../config/brand';

// Legal text lives in src/content/legal/<slug>.<lang>.md (falls back to English).
const docs = import.meta.glob('../content/legal/*.md', { eager: true, query: '?raw', import: 'default' });
// Brand values can be a string or { en, ja }
const pick = (v, lang) => (v && typeof v === 'object' ? v[lang] ?? v.en : v);
const vars = (lang) => ({ companyName: brand.name, legalName: brand.legalName, email: brand.email, domain: brand.domain, governingLaw: pick(brand.governingLaw, lang), country: pick(brand.country, lang) });
const fill = (s, lang) => { const v = vars(lang); return s.replace(/^<!--.*?-->\s*/s, '').replace(/\{\{(\w+)\}\}/g, (_, k) => v[k] ?? ''); };

const components = {
  h2: (p) => <h2 className="mt-10 mb-3 text-lg font-bold text-brand-dark" {...p} />,
  h3: (p) => <h3 className="mt-6 mb-2 font-bold text-brand-dark" {...p} />,
  p: (p) => <p className="mb-3 text-sm leading-relaxed" {...p} />,
  ul: (p) => <ul className="mb-3 list-disc space-y-1.5 pl-6 text-sm leading-relaxed" {...p} />,
  a: (p) => <a className="text-brand-accent underline" {...p} />,
};

export default function Legal({ slug, titleKey }) {
  const { t, i18n } = useTranslation();
  const translated = docs[`../content/legal/${slug}.${i18n.language}.md`];
  const raw = translated ?? docs[`../content/legal/${slug}.en.md`];
  return (
    <>
      <PageHero title={t(titleKey)} />
      <article className="mx-auto max-w-4xl px-6 py-16">
        {!translated && i18n.language !== 'en' && <p className="mb-8 rounded-md bg-slate-100 px-4 py-3 text-sm">{t('legal.englishOnly')}</p>}
        <ReactMarkdown components={components}>{fill(raw, i18n.language)}</ReactMarkdown>
      </article>
    </>
  );
}
