import ReCAPTCHA from 'react-google-recaptcha';
import { useTranslation } from 'react-i18next';
import Notice from './Notice';

// Google's public test key: always passes, dev only. Pair it with the test secret in .env.local.
const TEST_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';
const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || (import.meta.env.DEV ? TEST_KEY : '');

// Change `resetKey` to remount the widget (e.g. after a failed submit).
export default function Recaptcha({ onChange, error, resetKey = 0 }) {
  const { i18n } = useTranslation();
  if (!siteKey) return <Notice>reCAPTCHA is not configured: set VITE_RECAPTCHA_SITE_KEY.</Notice>;
  return (
    <div className="mb-5">
      <ReCAPTCHA key={`${resetKey}-${i18n.language}`} sitekey={siteKey} hl={i18n.language}
        onChange={(v) => onChange(v || '')} onExpired={() => onChange('')} />
      {error && <p role="alert" className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
