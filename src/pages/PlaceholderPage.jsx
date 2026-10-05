import { useTranslation } from 'react-i18next';
import PageHero from '../components/layout/PageHero';

// Stand-in until each page is built (phases 2-4).
export default function PlaceholderPage({ pageKey }) {
  const { t } = useTranslation();
  return (
    <>
      <PageHero title={t(`pages.${pageKey}`)} />
      <p className="mx-auto max-w-6xl px-6 py-16 text-slate-500">{t('placeholder')}</p>
    </>
  );
}
