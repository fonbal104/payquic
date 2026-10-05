import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import PageHero from '../components/layout/PageHero';
import TextField from '../components/ui/TextField';
import Recaptcha from '../components/ui/Recaptcha';
import Submit from '../components/ui/Submit';
import Notice from '../components/ui/Notice';
import brand from '../config/brand';
import { currentInquirySchema } from '../../shared/schemas';
import { useAuth } from '../features/auth/AuthContext';
import { api, apiError } from '../lib/api';

// Route is logged-in only (see Guard); the API enforces it as well.
export default function CurrentClientInquiry() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [captchaKey, setCaptchaKey] = useState(0);
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(currentInquirySchema),
    defaultValues: { firstName: user.firstName, lastName: user.lastName, issuer: '', amount: '', currency: '', transactionDate: '', last4: '' },
  });
  const err = (k) => errors[k] && t(errors[k].message);

  const submit = async (body) => {
    setError('');
    try { await api('/inquiries/current', { method: 'POST', body }); setDone(true); }
    catch (e) { setError(apiError(t, e)); setValue('recaptcha', ''); setCaptchaKey((k) => k + 1); }
  };

  return (
    <>
      <PageHero title={t('pages.current-client-inquiry')} />
      <section className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-center font-semibold text-brand-cta">{t('inquiry.current.eyebrow')}</p>
        <h2 className="mb-10 text-center text-3xl font-bold text-brand-dark">{t('inquiry.current.title')}</h2>
        {brand.merchantDescriptor && (
          <p className="mb-6 text-sm"><strong className="text-brand-dark">{t('inquiry.current.merchant')}</strong><br />{brand.merchantDescriptor}</p>
        )}
        <p className="mb-8 text-sm">{t('inquiry.current.intro')}<br />{t('inquiry.current.warning')}</p>
        {done ? <Notice type="ok">{t('inquiry.doneCurrent')}</Notice> : (
          <form onSubmit={handleSubmit(submit)} noValidate>
            <Notice>{error}</Notice>
            <div className="grid gap-x-6 md:grid-cols-2">
              <TextField label={t('labels.firstName')} error={err('firstName')} {...register('firstName')} />
              <TextField label={t('labels.lastName')} error={err('lastName')} {...register('lastName')} />
            </div>
            <TextField label={t('inquiry.labels.issuer')} placeholder={t('inquiry.placeholders.issuer')} error={err('issuer')} {...register('issuer')} />
            <div className="grid gap-x-6 md:grid-cols-2">
              <TextField label={t('inquiry.labels.amount')} inputMode="decimal" error={err('amount')} {...register('amount')} />
              <TextField select label={t('inquiry.labels.currency')} error={err('currency')} {...register('currency')}>
                <option value="">{t('inquiry.select')}</option>
                {brand.currencies.map((c) => <option key={c} value={c}>{c}</option>)}
              </TextField>
              <TextField label={t('inquiry.labels.transactionDate')} type="date" error={err('transactionDate')} {...register('transactionDate')} />
              <TextField label={t('inquiry.labels.last4')} placeholder={t('inquiry.placeholders.last4')} inputMode="numeric" maxLength={4} autoComplete="off" error={err('last4')} {...register('last4')} />
            </div>
            <Recaptcha resetKey={captchaKey} error={err('recaptcha')} onChange={(v) => setValue('recaptcha', v, { shouldValidate: true })} />
            <Submit busy={isSubmitting}>{t('inquiry.lookup')}</Submit>
          </form>
        )}
      </section>
    </>
  );
}
