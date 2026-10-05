import { Resend } from 'resend';

const copy = {
  en: {
    verify: { s: 'Verify your email', b: 'Confirm your email address to activate your account.', c: 'Verify email' },
    reset: { s: 'Reset your password', b: 'Use the link below to choose a new password. It expires in 1 hour. If you did not ask for this, you can ignore this email.', c: 'Reset password' },
  },
  ja: {
    verify: { s: 'メールアドレスの確認', b: 'アカウントを有効にするには、メールアドレスを確認してください。', c: 'メールアドレスを確認する' },
    reset: { s: 'パスワードの再設定', b: '下のリンクから新しいパスワードを設定してください。リンクの有効期限は1時間です。心当たりがない場合は、このメールを破棄してください。', c: 'パスワードを再設定する' },
  },
};

export async function sendLink({ to, lang, kind, url }) {
  const c = (copy[lang] ?? copy.en)[kind];
  const name = process.env.SITE_NAME ? ` – ${process.env.SITE_NAME}` : '';
  const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
    from: process.env.MAIL_FROM, to, subject: `${c.s}${name}`,
    html: `<p>${c.b}</p><p><a href="${url}">${c.c}</a></p><p>${url}</p>`,
  });
  if (error) throw new Error(error.message);
}

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export async function sendInquiry({ kind, data, replyTo }) {
  const rows = Object.entries(data).map(([k, v]) => `<tr><td><b>${esc(k)}</b></td><td>${esc(v)}</td></tr>`).join('');
  const label = kind === 'new' ? 'New client inquiry' : 'Current client inquiry';
  const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
    from: process.env.MAIL_FROM, to: process.env.INQUIRY_TO_EMAIL, replyTo,
    subject: `${process.env.SITE_NAME ? `${process.env.SITE_NAME} – ` : ''}${label}`,
    html: `<table cellpadding="6">${rows}</table>`,
  });
  if (error) throw new Error(error.message);
}
