import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';

import PersonalInfoManager from './PersonalInfoManager';
import ExperienceManager from './ExperienceManager';
import ProjectsManager from './ProjectsManager';
import SkillsManager from './SkillsManager';
import EducationManager from './EducationManager';
import HeroStatsManager from './HeroStatsManager';
import ContactManager from './ContactManager';
import AdminHomePreview from './AdminHomePreview';

const tabs = [
  { key: 'preview', label: 'Preview', icon: '👁️' },
  { key: 'personal', label: 'Personal', icon: '👤' },
  { key: 'experience', label: 'Experience', icon: '💼' },
  { key: 'projects', label: 'Projects', icon: '🚀' },
  { key: 'skills', label: 'Skills', icon: '🧩' },
  { key: 'education', label: 'Education', icon: '🎓' },
  { key: 'heroStats', label: 'Hero Stats', icon: '📊' },
  { key: 'contact', label: 'Contact', icon: '📬' }
];

const AdminPanel = ({ setShowAdmin }) => {
  const { isAuthenticated, logout, resetData } = useData();
  const [activeTab, setActiveTab] = useState('personal');
  const [resetting, setResetting] = useState(false);

  if (!isAuthenticated) {
    return (
      <section className="section admin-section">
        <div className="panel admin-access-denied">
          <h2>🔒 Access Denied</h2>
          <p>Please login to access the admin panel.</p>
          <button className="btn btn-primary" onClick={() => setShowAdmin(true)}>
            Go to Login
          </button>
        </div>
      </section>
    );
  }

  const handleReset = async () => {
    if (!window.confirm('Reset all portfolio data to defaultData.js?')) return;

    setResetting(true);
    try {
      await resetData();
      setActiveTab('preview');
    } catch (error) {
      alert('Reset failed: ' + (error.response?.data?.error || error.message));
    } finally {
      setResetting(false);
    }
  };

  return (
    <section className="section admin-section">
      <div className="admin-panel">
        <header className="admin-header">
          <div>
            <p className="admin-eyebrow">Portfolio Administration</p>
            <h1>⚙️ Admin Panel</h1>
          </div>

          <div className="admin-header-actions">
            <button className="admin-top-btn admin-reset-btn" onClick={handleReset} disabled={resetting}>
              {resetting ? '⏳ Resetting...' : '🔄 Reset Data'}
            </button>
            <button className="admin-top-btn admin-logout-btn" onClick={() => { logout(); setShowAdmin(false); }}>
              🚪 Logout
            </button>
            <button className="admin-top-btn admin-site-btn" onClick={() => setShowAdmin(false)}>
              🏠 View Site
            </button>
          </div>
        </header>

        <nav className="admin-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`admin-tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="admin-tab-content">
          {activeTab === 'personal' && <PersonalInfoManager />}
          {activeTab === 'preview' && <AdminHomePreview setActiveTab={setActiveTab} />}
          {activeTab === 'experience' && <ExperienceManager />}
          {activeTab === 'projects' && <ProjectsManager />}
          {activeTab === 'skills' && <SkillsManager />}
          {activeTab === 'education' && <EducationManager />}
          {activeTab === 'heroStats' && <HeroStatsManager />}
          {activeTab === 'contact' && <ContactManager />}
        </div>
      </div>
    </section>
  );
};

export default AdminPanel;
