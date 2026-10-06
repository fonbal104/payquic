// Validation shared by the browser forms and the API. Messages are i18n keys.
import { z } from 'zod';

const required = z.string().trim().min(1, 'errors.required');
const email = z.string().trim().toLowerCase().email('errors.email');
const password = z.string().min(10, 'errors.passwordShort').max(128, 'errors.passwordShort');
const recaptcha = z.string().min(1, 'errors.recaptcha');

export const registerSchema = z.object({
  username: z.string().trim().min(3, 'errors.usernameShort').max(40).regex(/^[A-Za-z0-9._-]+$/, 'errors.usernameChars'),
  firstName: required, lastName: required, email, phone: required, address: required, password,
  lang: z.enum(['en', 'ja']).default('en'),
  recaptcha,
});
export const loginSchema = z.object({ identifier: required, password: z.string().min(1, 'errors.required'), recaptcha });
export const forgotSchema = z.object({ identifier: required, recaptcha });
export const resetSchema = z.object({ token: z.string().min(1), password, recaptcha });
export const profileSchema = z.object({ firstName: required, lastName: required, phone: required, address: required });
export const changePasswordSchema = z.object({ current: z.string().min(1, 'errors.required'), password });

export const newInquirySchema = z.object({
  firstName: required, lastName: required, email, phone: required, businessType: required,
  comments: z.string().trim().max(2000).default(''),
  terms: z.literal(true, { message: 'errors.terms' }),
  recaptcha,
});
export const currentInquirySchema = z.object({
  firstName: required, lastName: required,
  issuer: z.string().trim().min(1, 'errors.required').max(60),
  amount: z.string().trim().regex(/^\d{1,10}(\.\d{1,2})?$/, 'errors.amount'),
  currency: required,
  transactionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'errors.date'),
  last4: z.string().trim().regex(/^\d{4}$/, 'errors.last4'),
  recaptcha,
});
