import { useTranslation } from 'react-i18next';
import { FaGear, FaBuildingColumns, FaLifeRing } from 'react-icons/fa6';
import Button from '../components/ui/Button';
import Photo from '../components/ui/Photo';
import RatingBadge from '../components/ui/RatingBadge';
import SectionHeading from '../components/ui/SectionHeading';
import InquiryCards from '../components/sections/InquiryCards';
import CtaBand from '../components/sections/CtaBand';
import HeroSlider from '../components/sections/HeroSlider';
import useLocalizedPath from '../lib/useLocalizedPath';

export default function Home() {
  const { t } = useTranslation();
  const lp = useLocalizedPath();
  const features = [[FaGear, 'setup'], [FaBuildingColumns, 'secure'], [FaLifeRing, 'support']];
  return (
    <>
      <section className="relative text-white">
        {/* The slanted background is its own layer so the photo can overlap the diagonal edge */}
        <div aria-hidden className="absolute inset-0 bg-brand-dark"
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 86%)' }} />
        <div className="relative mx-auto grid max-w-6xl gap-4 px-6 pb-0 pt-10 lg:grid-cols-[1.2fr_1fr] lg:gap-8 lg:pb-12">
          <div className="self-center"><HeroSlider /></div>
          <div className="flex items-end justify-center lg:-mb-5 lg:self-end">
            <Photo name="hero" className="h-[22rem] w-auto min-w-64 object-contain object-bottom sm:h-[26rem] lg:h-[35rem]" />
          </div>
        </div>
      </section>

      <div className="relative z-10 mx-auto -mt-10 max-w-4xl px-6"><InquiryCards variant="icon" /></div>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 md:grid-cols-2">
        <div className="relative">
          <Photo name="whoWeAre" className="h-80 w-full rounded-tl-[6rem] rounded-br-lg" />
          <RatingBadge className="absolute -bottom-6 right-0" />
        </div>
        <div>
          <SectionHeading eyebrow={t('home.who.eyebrow')} title={t('home.who.title')} />
          <p className="mt-5 mb-8 text-sm">{t('home.who.text')}</p>
          <Button to={lp('/about')}>{t('shared.moreInfo')}</Button>
        </div>
      </section>

      <section className="bg-slate-50 py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 md:grid-cols-2">
          <div>
            <SectionHeading eyebrow={t('home.consult.eyebrow')} title={t('home.consult.title')} />
            <p className="mt-4 mb-6 text-sm">{t('home.consult.text')}</p>
            <ul className="mb-8 space-y-4">
              {features.map(([Icon, k]) => (
                <li key={k} className="flex items-center gap-4 text-lg font-semibold text-brand-dark">
                  <Icon className="text-3xl text-brand-accent" aria-hidden />{t(`home.consult.${k}`)}
                </li>
              ))}
            </ul>
            <Button to={lp('/contact')}>{t('shared.cta.button')}</Button>
          </div>
          <div className="relative">
            <Photo name="consultation" className="h-96 w-full rounded-lg shadow-xl" />
            <RatingBadge className="absolute -bottom-6 -right-2" />
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
