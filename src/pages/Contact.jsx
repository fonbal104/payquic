import { useTranslation } from 'react-i18next';
import PageHero from '../components/layout/PageHero';
import SectionHeading from '../components/ui/SectionHeading';
import InquiryCards from '../components/sections/InquiryCards';

export default function Contact() {
  const { t } = useTranslation();
  return (
    <>
      <PageHero align="left" title={t('contact.hero.title')} subtitle={t('contact.hero.subtitle')} />
      <section className="mx-auto max-w-5xl px-6 py-16">
        <SectionHeading align="center" eyebrow={t('contact.eyebrow')} title={t('contact.title')} />
        <div className="mt-10"><InquiryCards variant="photo" /></div>
      </section>
    </>
  );
}
