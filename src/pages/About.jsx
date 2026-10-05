import { Trans, useTranslation } from 'react-i18next';
import PageHero from '../components/layout/PageHero';
import Photo from '../components/ui/Photo';
import RatingBadge from '../components/ui/RatingBadge';
import SectionHeading from '../components/ui/SectionHeading';
import InquiryCards from '../components/sections/InquiryCards';
import CtaBand from '../components/sections/CtaBand';

export default function About() {
  const { t } = useTranslation();
  return (
    <>
      <PageHero align="left" title={t('about.hero.title')} subtitle={t('about.hero.subtitle')} />

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-2">
        <div className="relative">
          <Photo name="aboutBuilding" className="h-80 w-full rounded-lg shadow-xl" />
          <RatingBadge className="absolute -bottom-6 right-4" />
        </div>
        <div>
          <SectionHeading eyebrow={t('about.who.eyebrow')} title={t('about.who.title')} />
          <p className="mt-5 text-sm"><Trans i18nKey="about.who.p1" components={{ b: <strong /> }} /></p>
          <p className="mt-4 text-sm">{t('about.who.p2')}</p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <SectionHeading align="center" eyebrow={t('about.services.eyebrow')} title={t('about.services.title')} />
        <div className="mt-10"><InquiryCards variant="photo" /></div>
      </section>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-2">
        <Photo name="mission" className="h-72 w-full rounded-lg shadow-xl" />
        <div>
          <SectionHeading eyebrow={t('about.mission.eyebrow')} title={t('about.mission.title')} />
          <p className="mt-4 text-sm">{t('about.mission.text')}</p>
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 md:grid-cols-2">
          <div>
            <SectionHeading eyebrow={t('about.values.eyebrow')} title={t('about.values.title')} />
            <p className="mt-4 text-sm">{t('about.values.text')}</p>
          </div>
          <Photo name="values" className="h-80 w-full rounded-lg shadow-xl" />
        </div>
      </section>

      <CtaBand />
    </>
  );
}
