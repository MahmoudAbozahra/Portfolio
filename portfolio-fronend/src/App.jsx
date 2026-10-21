import React from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
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

function AppContent() {
  const { loading, data, error, isAuthenticated, authLoading } = useData();
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const inAdmin = location.pathname.startsWith('/admin');

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
          <Route path="/admin" element={<React.Suspense fallback={<div className="section">{t('loading')}</div>}>{authLoading ? <div className="section">{t('loading')}</div> : isAuthenticated ? <AdminPanel setShowAdmin={() => navigate('/')} /> : <AdminLogin setIsAdmin={() => {}} setShowAdmin={(show) => !show && navigate('/')} />}</React.Suspense>} />
          <Route path="*" element={<Navigate to="/" replace />} />
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
    </BrowserRouter>
  );
}
