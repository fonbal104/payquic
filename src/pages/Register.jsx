import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import PageHero from '../components/layout/PageHero';
import TextField from '../components/ui/TextField';
import Recaptcha from '../components/ui/Recaptcha';
import Submit from '../components/ui/Submit';
import Notice from '../components/ui/Notice';
import { registerSchema } from '../../shared/schemas';
import { api, apiError } from '../lib/api';

const schema = registerSchema.extend({ repeatPassword: registerSchema.shape.password }).refine((d) => d.password === d.repeatPassword, { path: ['repeatPassword'], message: 'errors.passwordMatch' });

export default function Register() {
  const { t, i18n } = useTranslation();
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [captchaKey, setCaptchaKey] = useState(0);
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema), defaultValues: { lang: i18n.language } });
  const err = (k) => errors[k] && t(errors[k].message);

  const submit = async ({ repeatPassword, ...body }) => {
    setError('');
    try { await api('/auth/register', { method: 'POST', body: { ...body, lang: i18n.language } }); setDone(true); }
    catch (e) { setError(apiError(t, e)); setValue('recaptcha', ''); setCaptchaKey((k) => k + 1); }
  };
  const f = (name, label, props = {}) => <TextField label={t(`labels.${label || name}`)} error={err(name)} {...props} {...register(name)} />;

  return (
    <>
      <PageHero title={t('pages.register')} subtitle={t('register.subtitle')} />
      <section className="mx-auto max-w-2xl px-6 py-16">
        <h2 className="mb-8 text-center text-3xl font-bold text-brand-dark">{t('register.title')}</h2>
        {done ? <Notice type="ok">{t('register.done')}</Notice> : (
          <form onSubmit={handleSubmit(submit)} noValidate>
            <Notice>{error}</Notice>
            <h3 className="mb-4 text-xl font-bold text-brand-dark">{t('register.name')}</h3>
            {f('username', null, { autoComplete: 'username' })}{f('firstName')}{f('lastName')}
            <h3 className="mb-4 mt-8 text-xl font-bold text-brand-dark">{t('register.contact')}</h3>
            {f('email', null, { type: 'email', autoComplete: 'email' })}{f('phone', null, { type: 'tel' })}
            <h3 className="mb-4 mt-8 text-xl font-bold text-brand-dark">{t('register.about')}</h3>
            {f('address', null, { textarea: true })}
            {f('password', null, { type: 'password', autoComplete: 'new-password' })}
            {f('repeatPassword', null, { type: 'password', autoComplete: 'new-password' })}
            <Recaptcha resetKey={captchaKey} error={err('recaptcha')} onChange={(v) => setValue('recaptcha', v, { shouldValidate: true })} />
            <Submit busy={isSubmitting}>{t('register.submit')}</Submit>
          </form>
        )}
      </section>
    </>
  );
}
