import { useTranslation } from 'react-i18next';
import { FaHandHoldingDollar, FaPeopleGroup } from 'react-icons/fa6';
import Button from '../ui/Button';
import Photo from '../ui/Photo';
import useLocalizedPath from '../../lib/useLocalizedPath';

// variant "icon" = home page cards, "photo" = contact/about cards
export default function InquiryCards({ variant = 'photo' }) {
  const { t } = useTranslation();
  const lp = useLocalizedPath();
  const cards = [
    { k: 'current', to: '/current-client-inquiry', Icon: FaHandHoldingDollar, photo: 'currentClient', cta: t('shared.cards.current.cta') },
    { k: 'new', to: '/new-client-inquiry', Icon: FaPeopleGroup, photo: 'newClient', cta: variant === 'icon' ? t('shared.learnMore') : t('shared.cards.new.cta') },
  ];
  const photo = variant === 'photo';
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {cards.map(({ k, to, Icon, photo: img, cta }) => (
        <article key={k} className={`rounded-xl bg-white p-8 shadow-xl ${photo ? 'text-center' : ''}`}>
          {photo ? <Photo name={img} className="mb-6 h-56 w-full" /> : <Icon className="mb-6 text-5xl text-brand-accent" aria-hidden />}
          <h3 className={`text-xl font-bold text-brand-dark ${photo ? 'uppercase' : ''}`}>{t(`shared.cards.${k}.title`)}</h3>
          <p className="mt-2 mb-6 text-sm">{t(`shared.cards.${k}.text`)}</p>
          <Button to={lp(to)} variant={photo ? 'dark' : 'cta'}>{cta}</Button>
        </article>
      ))}
    </div>
  );
}
