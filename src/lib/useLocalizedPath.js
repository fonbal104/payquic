import { useTranslation } from 'react-i18next';

// Prefixes internal links with /ja when the Japanese version is active.
export default function useLocalizedPath() {
  const { i18n } = useTranslation();
  return (path) => (i18n.language === 'ja' ? `/ja${path === '/' ? '' : path}` : path);
}
