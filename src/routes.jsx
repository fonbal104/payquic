import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/layout/Layout';
import PlaceholderPage from './pages/PlaceholderPage';
import Guard from './features/auth/Guard';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Legal from './pages/Legal';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import Profile from './pages/Profile';
import AdminInquiries from './pages/AdminInquiries';
import RouteError from './pages/RouteError';
import NewClientInquiry from './pages/NewClientInquiry';
import CurrentClientInquiry from './pages/CurrentClientInquiry';

const built = {
  home: <Home />, about: <About />, contact: <Contact />,
  'privacy-policy': <Legal slug="privacy" titleKey="pages.privacy-policy" />,
  terms: <Legal slug="terms" titleKey="pages.terms" />,
  login: <Login />, register: <Register />, 'reset-password': <ResetPassword />, 'verify-email': <VerifyEmail />, profile: <Profile />, 'admin-inquiries': <AdminInquiries />,
  'new-client-inquiry': <NewClientInquiry />, 'current-client-inquiry': <CurrentClientInquiry />,
};

// auth: 'public' | 'guest' (logged-out only) | 'user' (logged-in only, else redirect to /login)
const pages = [
  { path: '', key: 'home', auth: 'public' },
  { path: 'about', key: 'about', auth: 'public' },
  { path: 'contact', key: 'contact', auth: 'public' },
  { path: 'new-client-inquiry', key: 'new-client-inquiry', auth: 'public' },
  { path: 'current-client-inquiry', key: 'current-client-inquiry', auth: 'user' },
  { path: 'profile', key: 'profile', auth: 'user' },
  { path: 'admin/inquiries', key: 'admin-inquiries', auth: 'admin' },
  { path: 'login', key: 'login', auth: 'guest' },
  { path: 'register', key: 'register', auth: 'guest' },
  { path: 'reset-password', key: 'reset-password', auth: 'public' },
  { path: 'verify-email', key: 'verify-email', auth: 'public' },
  { path: 'privacy-policy', key: 'privacy-policy', auth: 'public' },
  { path: 'terms', key: 'terms', auth: 'public' },
];

const branch = (lang) => ({
  path: lang === 'ja' ? '/ja' : '/',
  element: <Layout lang={lang} />,
  errorElement: <RouteError />,
  children: pages.map((p) => {
    const page = built[p.key] ?? <PlaceholderPage pageKey={p.key} />;
    const element = p.auth === 'public' ? page : <Guard mode={p.auth}>{page}</Guard>;
    return p.path === '' ? { index: true, element } : { path: p.path, element };
  }),
});

export const router = createBrowserRouter([branch('en'), branch('ja')]);
