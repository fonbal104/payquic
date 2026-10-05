import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trans, useTranslation } from 'react-i18next';
import { FaArrowRight } from 'react-icons/fa6';
import TextField from '../components/ui/TextField';
import Submit from '../components/ui/Submit';
import Notice from '../components/ui/Notice';
import { changePasswordSchema, profileSchema } from '../../shared/schemas';
import { useAuth } from '../features/auth/AuthContext';
import { api, apiError } from '../lib/api';
import useLocalizedPath from '../lib/useLocalizedPath';

function EditProfile() {
  const { t } = useTranslation();
  const { user, setUser } = useAuth();
  const [msg, setMsg] = useState({});
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(profileSchema), defaultValues: user });
  const err = (k) => errors[k] && t(errors[k].message);
  const submit = async (body) => {
    try { setUser((await api('/account/profile', { method: 'PATCH', body })).user); setMsg({ ok: t('profile.saved') }); }
    catch (e) { setMsg({ error: apiError(t, e) }); }
  };
  return (
    <form onSubmit={handleSubmit(submit)} noValidate>
      <h2 className="mb-6 text-2xl font-bold text-brand-dark">{t('profile.edit')}</h2>
      <Notice>{msg.error}</Notice><Notice type="ok">{msg.ok}</Notice>
      <div className="grid gap-x-6 md:grid-cols-2">
        <TextField label={t('labels.firstName')} error={err('firstName')} {...register('firstName')} />
        <TextField label={t('labels.lastName')} error={err('lastName')} {...register('lastName')} />
      </div>
      <TextField label={t('labels.email')} value={user.email} readOnly disabled name="email" />
      <TextField label={t('labels.phone')} type="tel" error={err('phone')} {...register('phone')} />
      <TextField label={t('labels.address')} textarea error={err('address')} {...register('address')} />
      <Submit busy={isSubmitting}>{t('profile.save')}</Submit>
    </form>
  );
}

function ChangePassword() {
  const { t } = useTranslation();
  const [msg, setMsg] = useState({});
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(changePasswordSchema) });
  const err = (k) => errors[k] && t(errors[k].message);
  const submit = async (body) => {
    try { await api('/account/password', { method: 'POST', body }); reset(); setMsg({ ok: t('profile.passwordUpdated') }); }
    catch (e) { setMsg({ error: apiError(t, e) }); }
  };
  return (
    <form onSubmit={handleSubmit(submit)} noValidate>
      <h2 className="mb-6 text-2xl font-bold text-brand-dark">{t('profile.changePassword')}</h2>
      <Notice>{msg.error}</Notice><Notice type="ok">{msg.ok}</Notice>
      <TextField label={t('profile.currentPassword')} type="password" autoComplete="current-password" error={err('current')} {...register('current')} />
      <TextField label={t('reset.newPassword')} type="password" autoComplete="new-password" error={err('password')} {...register('password')} />
      <Submit busy={isSubmitting}>{t('profile.updatePassword')}</Submit>
    </form>
  );
}

export default function Profile() {
  const { t, i18n } = useTranslation();
  const lp = useLocalizedPath();
  const { user } = useAuth();
  const [items, setItems] = useState(null);
  useEffect(() => { api('/inquiries').then((r) => setItems(r.inquiries)).catch(() => setItems([])); }, []);
  const fmt = new Intl.DateTimeFormat(i18n.language, { dateStyle: 'medium' });
  const name = `${user.firstName} ${user.lastName}`.trim() || user.username;

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <p className="text-xs font-semibold uppercase tracking-widest text-brand-secondary">{t('profile.eyebrow')}</p>
      <h1 className="mt-4 text-5xl font-bold text-brand-dark">{t('profile.welcome', { name })}</h1>
      <p className="mt-4">{t('profile.signedIn', { email: user.email })}</p>

      <div className="mt-14 flex items-baseline justify-between">
        <h2 className="text-2xl font-bold text-brand-dark">{t('profile.inquiries')}</h2>
        <Link to={lp('/current-client-inquiry')} className="inline-flex items-center gap-2 font-semibold text-brand-dark">{t('profile.newRequest')} <FaArrowRight aria-hidden /></Link>
      </div>
      <div className="mt-4 border border-slate-300 bg-white">
        {items === null ? null : items.length === 0 ? (
          <p className="p-8 text-sm"><Trans i18nKey="profile.empty" components={{ a: <Link to={lp('/contact')} className="font-bold text-brand-dark underline" /> }} /></p>
        ) : (
          <ul className="divide-y divide-slate-200">
            {items.map((i) => (
              <li key={i.id} className="flex flex-wrap items-center justify-between gap-2 px-6 py-4 text-sm">
                <span className="font-semibold text-brand-dark">{t(`profile.kind.${i.kind}`)}</span>
                <span>{[i.data?.issuer, i.data?.amount && `${i.data.amount} ${i.data.currency ?? ''}`].filter(Boolean).join(' · ')}</span>
                <span className="text-slate-500">{fmt.format(new Date(i.created_at))} · {t(`profile.status.${i.status}`, i.status)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-16 grid gap-16 md:grid-cols-2"><EditProfile /><ChangePassword /></div>
    </div>
  );
}
