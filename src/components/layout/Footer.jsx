import { Link } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import brand from '../../config/brand';
import useLocalizedPath from '../../lib/useLocalizedPath';

const Col = ({ title, children }) => (
  <div>
    <h3 className="mb-4 border-l-4 border-brand-accent pl-3 text-xl font-bold">{title}</h3>
    <ul className="space-y-2 pl-4 text-sm">{children}</ul>
  </div>
);

export default function Footer() {
  const { t } = useTranslation();
  const lp = useLocalizedPath();
  const item = (to, label) => <li key={to}><Link to={lp(to)}>{label}</Link></li>;
  return (
    <footer className="bg-brand-dark text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <img src={brand.logo} alt={brand.name} className="mb-4 h-10" />
          <p className="max-w-md text-sm leading-relaxed"><Trans i18nKey="footer.about" components={{ b: <strong /> }} /></p>
        </div>
        <Col title={t('footer.support')}>
          {item('/new-client-inquiry', t('footer.newClient'))}
          {item('/current-client-inquiry', t('footer.currentClient'))}
          {item('/contact', t('footer.contact'))}
        </Col>
        <Col title={t('footer.legal')}>
          {item('/privacy-policy', t('footer.privacy'))}
          {item('/terms', t('footer.terms'))}
        </Col>
      </div>
      <p className="px-6 pb-8 pt-4 text-center text-sm">{t('footer.copyright', { year: new Date().getFullYear() })}</p>
    </footer>
  );
}
