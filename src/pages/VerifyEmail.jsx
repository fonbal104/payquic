import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PageHero from '../components/layout/PageHero';
import Notice from '../components/ui/Notice';
import { api, apiError } from '../lib/api';
import useLocalizedPath from '../lib/useLocalizedPath';

export default function VerifyEmail() {
  const { t } = useTranslation();
  const lp = useLocalizedPath();
  const token = useSearchParams()[0].get('token');
  const [state, setState] = useState({ status: 'working' });
  useEffect(() => {
    api('/auth/verify', { method: 'POST', body: { token } })
      .then(() => setState({ status: 'ok' }))
      .catch((e) => setState({ status: 'error', message: apiError(t, e) }));
  }, [token, t]);
  return (
    <>
      <PageHero title={t('pages.verify-email')} />
      <section className="mx-auto max-w-2xl px-6 py-16 text-center">
        {state.status === 'working' && <p>{t('verify.working')}</p>}
        {state.status === 'ok' && <><Notice type="ok">{t('verify.ok')}</Notice><Link className="font-semibold text-brand-secondary underline" to={lp('/login')}>{t('login.submit')}</Link></>}
        {state.status === 'error' && <Notice>{state.message}</Notice>}
      </section>
    </>
  );
}
