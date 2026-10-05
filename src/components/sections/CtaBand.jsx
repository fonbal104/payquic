import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';
import Photo from '../ui/Photo';
import useLocalizedPath from '../../lib/useLocalizedPath';

// The slanted teal band sits behind the content; the photos overhang its lower edge onto white.
export default function CtaBand() {
  const { t } = useTranslation();
  const lp = useLocalizedPath();
  return (
    <section className="relative pb-20 pt-20">
      <div aria-hidden className="absolute inset-x-0 top-0 bg-brand-accent"
        style={{ height: 'calc(100% - 17rem)', clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 69%)' }} />
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <h2 className="mx-auto max-w-lg text-4xl font-bold leading-tight text-brand-dark">{t('shared.cta.title')}</h2>
        <p className="mt-3 text-lg font-semibold text-brand-dark">{t('shared.cta.subtitle')}</p>
        <Button to={lp('/contact')} variant="secondary" className="mt-5">{t('shared.cta.button')}</Button>
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {['cta1', 'cta2', 'cta3'].map((n) => <Photo key={n} name={n} className="aspect-square w-full rounded-lg shadow-2xl" />)}
        </div>
      </div>
    </section>
  );
}
