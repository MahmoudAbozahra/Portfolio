import React from 'react';
import { DataProvider, useData } from './contexts/DataContext';
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

function AppContent() {
  const { loading, data, isAuthenticated } = useData();
  const [showAdmin, setShowAdmin] = React.useState(false);

  if (loading || !data) {
    return (
      <div className="app">
        <Header setShowAdmin={() => {}} showAdmin={false} />
        <main className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
            <h2>Loading Portfolio...</h2>
            <p style={{ color: '#767676' }}>Please wait while we fetch your data</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="app">
      <Header setShowAdmin={setShowAdmin} showAdmin={showAdmin} />
      <main className="main-content">
        {showAdmin ? (
          isAuthenticated ? (
            <AdminPanel setShowAdmin={setShowAdmin} />
          ) : (
            <AdminLogin setIsAdmin={() => {}} setShowAdmin={setShowAdmin} />
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
  );
}

function App() {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
}

export default App;