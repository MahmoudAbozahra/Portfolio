import React from 'react';
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { DataProvider, useData } from './contexts/DataContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Home from './components/Pages/Home';
import About from './components/Pages/About';
import Experience from './components/Pages/Experience';
import Projects from './components/Pages/Projects';
import Skills from './components/Pages/Skills';
import Education from './components/Pages/Education';
import Contact from './components/Pages/Contact';
import AuroraBackground from './components/motion/AuroraBackground';

const AdminPanel = React.lazy(() => import('./components/Admin/AdminPanel'));
const AdminLogin = React.lazy(() => import('./components/Admin/AdminLogin'));

const PublicPortfolio = () => <><Home /><About /><Experience /><Projects /><Skills /><Education /><Contact /></>;
const NotFound = () => <section className="section" aria-labelledby="not-found-title"><p className="section-kicker">404</p><h1 id="not-found-title">Page not found</h1><p>This page does not exist. Return to the portfolio homepage.</p><a className="button primary" href="/">Back to portfolio</a></section>;

function AppContent() {
  const { loading, data, error, usingFallback, isAuthenticated, authLoading, fetchData } = useData();
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const routePath = location.pathname.replace(/\/+$/, '') || '/';
  const hostname = window.location.hostname;
  const inAdmin = routePath === '/admin';
  const isNotFound = routePath !== '/' && !inAdmin;

  React.useEffect(() => {
    const robots = document.querySelector('meta[name="robots"]');
    const canonical = document.querySelector('link[rel="canonical"]');
    const isPreview = hostname.endsWith('.vercel.app') && hostname !== 'mahmoudabozahra.vercel.app';
    const hideFromSearch = inAdmin || isNotFound || isPreview;
    if (robots) robots.content = hideFromSearch ? 'noindex,nofollow' : 'index,follow,max-image-preview:large';
    if (hideFromSearch) {
      canonical?.removeAttribute('href');
    } else if (canonical) {
      canonical.href = 'https://mahmoudabozahra.vercel.app/';
    }
    document.title = inAdmin ? 'Admin | Mahmoud Abozahra' : isNotFound ? 'Page not found | Mahmoud Abozahra' : 'Mahmoud Mostafa Abozahra | Python Backend Developer';
  }, [hostname, inAdmin, isNotFound]);

  if (loading || !data) {
    return (
      <div className="app loading-screen">
        <AuroraBackground />
        <div className="loading-mark" aria-hidden="true">MA</div>
        <h1>{t('loadingPortfolio')}</h1>
        <p>{error || t('loadingPortfolioHint')}</p>
      </div>
    );
  }

  return (
    <div className={`app ${inAdmin ? 'admin-mode' : ''}`}>
      {!inAdmin && <AuroraBackground />}
      {!inAdmin && <Header showAdmin={false} setShowAdmin={(show) => navigate(show ? '/admin' : '/')} />}
      {error && <div className="connection-notice" role="status">Unable to refresh data. Showing the latest available view.</div>}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<PublicPortfolio />} />
          <Route path="/admin" element={<React.Suspense fallback={<div className="section">{t('loading')}</div>}>{authLoading ? <div className="section">{t('loading')}</div> : isAuthenticated ? usingFallback ? <section className="section" role="alert"><h1>Admin data unavailable</h1><p>Reconnect to the portfolio API before editing CMS content.</p><button className="button primary" type="button" onClick={() => fetchData().catch((retryError) => console.error('Portfolio retry failed', retryError))}>Retry connection</button></section> : <AdminPanel setShowAdmin={() => navigate('/')} /> : <AdminLogin setIsAdmin={() => {}} setShowAdmin={(show) => !show && navigate('/')} />}</React.Suspense>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!inAdmin && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider><DataProvider><AppContent /></DataProvider></LanguageProvider>
      <Analytics />
    </BrowserRouter>
  );
}
