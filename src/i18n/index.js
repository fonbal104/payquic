import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import brand from '../config/brand';

// Every JSON in locales/<lng>/ is merged into one bundle for that language.
const files = import.meta.glob('./locales/*/*.json', { eager: true, import: 'default' });
const bundle = (lng, over = {}) => ({
  ...Object.entries(files).filter(([p]) => p.startsWith(`./locales/${lng}/`)).reduce((a, [, v]) => ({ ...a, ...v }), {}),
  ...over,
});

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: bundle('en', brand.copy?.en) },
    ja: { translation: bundle('ja', brand.copy?.ja) },
  },
  lng: window.location.pathname.startsWith('/ja') ? 'ja' : 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false, defaultVariables: { companyName: brand.name } },
});

export default i18n;
