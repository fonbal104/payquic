import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { FaCircleUser } from 'react-icons/fa6';
import TextField from '../components/ui/TextField';
import Submit from '../components/ui/Submit';
import Notice from '../components/ui/Notice';
import { forgotSchema, resetSchema } from '../../shared/schemas';
import { api, apiError } from '../lib/api';
import useLocalizedPath from '../lib/useLocalizedPath';

// No ?token= -> request a link. With ?token= -> choose a new password.
export default function ResetPassword() {
  const { t } = useTranslation();
  const lp = useLocalizedPath();
  const token = useSearchParams()[0].get('token');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(token ? resetSchema.omit({ token: true }) : forgotSchema),
  });
  const submit = async (values) => {
    setError('');
    try {
      await api(token ? '/auth/reset' : '/auth/forgot', { method: 'POST', body: token ? { ...values, token } : values });
      setMessage(t(token ? 'reset.done' : 'reset.sent'));
    } catch (e) { setError(apiError(t, e)); }
  };
  return (
    <section className="mx-auto max-w-2xl px-6 py-20">
      <FaCircleUser className="mx-auto text-5xl text-brand-dark" aria-hidden />
      <h1 className="mt-4 mb-6 text-center text-3xl font-bold text-brand-dark">{t(token ? 'reset.newTitle' : 'pages.reset-password')}</h1>
      {message ? (
        <><Notice type="ok">{message}</Notice>{token && <Link className="font-semibold text-brand-secondary underline" to={lp('/login')}>{t('login.submit')}</Link>}</>
      ) : (
        <form onSubmit={handleSubmit(submit)} noValidate>
          {!token && <p className="mb-5 text-sm">{t('reset.intro')}</p>}
          <Notice>{error}</Notice>
          {token
            ? <TextField label={t('reset.newPassword')} type="password" autoComplete="new-password" error={errors.password && t(errors.password.message)} {...register('password')} />
            : <TextField label={t('labels.identifier')} error={errors.identifier && t(errors.identifier.message)} {...register('identifier')} />}
          <Submit busy={isSubmitting}>{t(token ? 'reset.save' : 'reset.submit')}</Submit>
        </form>
      )}
    </section>
  );
}
