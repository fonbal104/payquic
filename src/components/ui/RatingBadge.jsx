import { useTranslation } from 'react-i18next';
import brand from '../../config/brand';

export default function RatingBadge({ className = '' }) {
  const { t } = useTranslation();
  if (!brand.rating) return null;
  return (
    <div className={`flex items-center gap-3 rounded-lg bg-white px-5 py-3 shadow-xl ${className}`}>
      <span className="text-4xl font-semibold text-brand-accent">{brand.rating.score}</span>
      <div className="text-xs">
        <div>{t('shared.rating.reviews', { count: brand.rating.reviews })} <span className="text-amber-400" aria-hidden>★★★★★</span></div>
        <div className="text-sm font-bold text-brand-dark">{t('shared.rating.source')}</div>
      </div>
    </div>
  );
}
