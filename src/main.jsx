import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import '@fontsource-variable/inter';
import './i18n';
import './styles/index.css';
import { applyTheme } from './config/theme';
import { router } from './routes';
import { AuthProvider } from './features/auth/AuthContext';

applyTheme();
// Optional error monitoring: set VITE_SENTRY_DSN to enable.
if (import.meta.env.VITE_SENTRY_DSN) import('@sentry/react').then((S) => S.init({ dsn: import.meta.env.VITE_SENTRY_DSN }));
createRoot(document.getElementById('root')).render(
  <StrictMode><AuthProvider><RouterProvider router={router} /></AuthProvider></StrictMode>
);
