import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trans, useTranslation } from 'react-i18next';
import PageHero from '../components/layout/PageHero';
import TextField from '../components/ui/TextField';
import Recaptcha from '../components/ui/Recaptcha';
import Submit from '../components/ui/Submit';
import Notice from '../components/ui/Notice';
import brand from '../config/brand';
import { newInquirySchema } from '../../shared/schemas';
import { useAuth } from '../features/auth/AuthContext';
import { api, apiError } from '../lib/api';
import useLocalizedPath from '../lib/useLocalizedPath';

export default function NewClientInquiry() {
  const { t } = useTranslation();
  const lp = useLocalizedPath();
  const { user } = useAuth(); // logged-in users get their details prefilled
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [captchaKey, setCaptchaKey] = useState(0);
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(newInquirySchema),
    defaultValues: { firstName: user?.firstName ?? '', lastName: user?.lastName ?? '', email: user?.email ?? '', phone: user?.phone ?? '', businessType: '', comments: '', terms: false },
  });
  const err = (k) => errors[k] && t(errors[k].message);

  const submit = async (body) => {
    setError('');
    try { await api('/inquiries/new', { method: 'POST', body }); setDone(true); }
    catch (e) { setError(apiError(t, e)); setValue('recaptcha', ''); setCaptchaKey((k) => k + 1); }
  };

  return (
    <>
      <PageHero title={t('pages.new-client-inquiry')} />
      <section className="mx-auto max-w-3xl px-6 py-16">
        {done ? <Notice type="ok">{t('inquiry.doneNew')}</Notice> : (
          <form onSubmit={handleSubmit(submit)} noValidate>
            <Notice>{error}</Notice>
            <div className="grid gap-x-6 md:grid-cols-2">
              <TextField label={t('labels.firstName')} error={err('firstName')} {...register('firstName')} />
              <TextField label={t('labels.lastName')} error={err('lastName')} {...register('lastName')} />
              <TextField label={t('labels.email')} type="email" error={err('email')} {...register('email')} />
              <TextField label={t('labels.phone')} type="tel" error={err('phone')} {...register('phone')} />
            </div>
            <TextField select label={t('inquiry.labels.businessType')} error={err('businessType')} {...register('businessType')}>
              <option value="">{t('inquiry.select')}</option>
              {brand.businessTypes.map((k) => <option key={k} value={k}>{t(`inquiry.businessTypes.${k}`)}</option>)}
            </TextField>
            <TextField textarea label={t('inquiry.labels.comments')} error={err('comments')} {...register('comments')} />
            <label className="mb-1 flex items-start gap-3 text-sm">
              <input type="checkbox" className="mt-1" {...register('terms')} />
              <span><Trans i18nKey="inquiry.terms" components={{ a: <Link to={lp('/terms')} className="text-brand-accent underline" /> }} /></span>
            </label>
            {errors.terms && <p role="alert" className="mb-2 text-sm text-red-600">{err('terms')}</p>}
            <p className="mb-6 text-xs text-slate-500">
              <Trans i18nKey="inquiry.notice" components={{ p: <Link to={lp('/privacy-policy')} className="underline" />, t: <Link to={lp('/terms')} className="underline" /> }} />
            </p>
            <Recaptcha resetKey={captchaKey} error={err('recaptcha')} onChange={(v) => setValue('recaptcha', v, { shouldValidate: true })} />
            <Submit busy={isSubmitting}>{t('inquiry.submit')}</Submit>
          </form>
        )}
      </section>
    </>
  );
}
