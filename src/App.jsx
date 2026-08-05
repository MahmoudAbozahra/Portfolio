import React from 'react';
import { DataProvider } from './contexts/DataContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Home from './components/Pages/Home';
import About from './components/Pages/About';
import Experience from './components/Pages/Experience';
import Projects from './components/Pages/Projects';
import Skills from './components/Pages/Skills';
import Education from './components/Pages/Education';
import Contact from './components/Pages/Contact';
import AdminPanel from './components/Admin/AdminPanel';
import AdminLogin from './components/Admin/AdminLogin';
import './App.css';

function App() {
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [showAdmin, setShowAdmin] = React.useState(false);

  // التحقق من حالة الـ admin من localStorage عند تحميل الصفحة
  React.useEffect(() => {
    const savedAuth = localStorage.getItem('adminAuth');
    if (savedAuth === 'true') {
      setIsAdmin(true);
    }
  }, []);

  // تحديث localStorage عند تغيير حالة admin
  React.useEffect(() => {
    localStorage.setItem('adminAuth', String(isAdmin));
  }, [isAdmin]);

  const handleAdminToggle = () => {
    setShowAdmin(prev => !prev);
  };

  return (
    <DataProvider>
      <div className="app">
        <Header setShowAdmin={handleAdminToggle} showAdmin={showAdmin} />
        <main className="main-content">
          {showAdmin ? (
            isAdmin ? (
              <AdminPanel />
            ) : (
              <AdminLogin setIsAdmin={setIsAdmin} setShowAdmin={setShowAdmin} />
            )
          ) : (
            <>
              <Home />
              <About />
              <Experience />
              <Projects />
              <Skills />
              <Education />
              <Contact />
            </>
          )}
        </main>
        <Footer />
      </div>
    </DataProvider>
  );
}

export default App;