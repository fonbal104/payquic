import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import TopBar from './TopBar';
import Header from './Header';
import Footer from './Footer';
import useSeo from '../../lib/useSeo';

export default function Layout({ lang }) {
  const { i18n } = useTranslation();
  useSeo();
  useEffect(() => {
    i18n.changeLanguage(lang);
    document.documentElement.lang = lang;
  }, [lang, i18n]);

  return (
    <div className="flex min-h-screen flex-col">
      <TopBar />
      <Header />
      <main className="flex-1"><Outlet /></main>
      <Footer />
    </div>
  );
}
