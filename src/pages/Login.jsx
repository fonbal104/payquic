import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { FaCircleUser } from 'react-icons/fa6';
import TextField from '../components/ui/TextField';
import Submit from '../components/ui/Submit';
import Notice from '../components/ui/Notice';
import Photo from '../components/ui/Photo';
import { loginSchema } from '../../shared/schemas';
import { useAuth } from '../features/auth/AuthContext';
import { api, apiError } from '../lib/api';
import useLocalizedPath from '../lib/useLocalizedPath';

export default function Login() {
  const { t } = useTranslation();
  const lp = useLocalizedPath();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [unverified, setUnverified] = useState(false);
  const { register, handleSubmit, getValues, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(loginSchema) });

  // On success the guest guard sends the user to ?redirect= or the profile page.
  const submit = async (values) => {
    setError(''); setInfo('');
    try { await login(values); }
    catch (e) { setError(apiError(t, e)); setUnverified(e.message === 'errors.notVerified'); }
  };
  const resend = async () => {
    await api('/auth/resend-verification', { method: 'POST', body: { identifier: getValues('identifier') } }).catch(() => {});
    setInfo(t('login.resent'));
  };

  return (
    <section className="mx-auto my-16 grid max-w-4xl overflow-hidden rounded-lg shadow-xl md:grid-cols-2">
      <form onSubmit={handleSubmit(submit)} noValidate className="bg-brand-dark p-10 text-white">
        <FaCircleUser className="mx-auto text-5xl" aria-hidden />
        <h1 className="mt-4 mb-8 text-center text-3xl font-bold">{t('login.title')}</h1>
        <Notice>{error}</Notice><Notice type="ok">{info}</Notice>
        {unverified && <button type="button" onClick={resend} className="mb-5 text-sm text-brand-accent underline">{t('login.resend')}</button>}
        <div className="[&_label]:text-white/70">
          <TextField label={t('labels.identifier')} autoComplete="username" error={errors.identifier && t(errors.identifier.message)} {...register('identifier')} />
          <TextField label={t('labels.password')} type="password" autoComplete="current-password" error={errors.password && t(errors.password.message)} {...register('password')} />
        </div>
        <Submit busy={isSubmitting}>{t('login.submit')}</Submit>
        <p className="mt-6 text-sm text-brand-accent">
          <Link to={lp('/register')}>{t('login.register')}</Link> <span className="mx-2 text-white/40">|</span> <Link to={lp('/reset-password')}>{t('login.forgot')}</Link>
        </p>
      </form>
      <Photo name="login" className="hidden h-full min-h-72 md:block" />
    </section>
  );
}
