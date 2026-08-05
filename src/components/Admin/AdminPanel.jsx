import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import ExperienceManager from './ExperienceManager';
import ProjectsManager from './ProjectsManager';
import SkillsManager from './SkillsManager';

const AdminPanel = () => {
  const { isAuthenticated, logout, resetData } = useData();
  const [activeTab, setActiveTab] = useState('experience');

  if (!isAuthenticated) {
    return (
      <div className="section">
        <div className="panel" style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center', padding: '3rem' }}>
          <h2>🔒 Access Denied</h2>
          <p style={{ color: '#767676', margin: '1rem 0' }}>Please login to access the admin panel.</p>
          <button 
            className="btn btn-primary" 
            onClick={() => window.location.reload()}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="section">
      <div className="admin-panel">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '2rem', 
          flexWrap: 'wrap', 
          gap: '1rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid rgba(0,0,0,0.06)'
        }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '700' }}>⚙️ Admin Panel</h1>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button 
              onClick={resetData} 
              style={{ 
                padding: '0.6rem 1.5rem',
                background: '#6c757d',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.85rem',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => { e.target.style.background = '#5a6268'; e.target.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.target.style.background = '#6c757d'; e.target.style.transform = 'translateY(0)'; }}
            >
              🔄 Reset Data
            </button>
            <button 
              onClick={logout} 
              style={{ 
                padding: '0.6rem 1.5rem',
                background: '#dc3545',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.85rem',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => { e.target.style.background = '#c82333'; e.target.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.target.style.background = '#dc3545'; e.target.style.transform = 'translateY(0)'; }}
            >
              🚪 Logout
            </button>
          </div>
        </div>

        <div className="admin-actions" style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <button 
            className={activeTab === 'experience' ? 'active' : ''}
            onClick={() => setActiveTab('experience')}
            style={{
              padding: '0.7rem 2rem',
              border: 'none',
              borderRadius: '10px',
              background: activeTab === 'experience' ? '#1a1a1a' : 'rgba(0,0,0,0.05)',
              color: activeTab === 'experience' ? '#ffffff' : '#333',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.9rem',
              transition: 'all 0.3s ease',
              boxShadow: activeTab === 'experience' ? '0 4px 15px rgba(0,0,0,0.15)' : 'none'
            }}
          >
            📝 Experience
          </button>
          <button 
            className={activeTab === 'projects' ? 'active' : ''}
            onClick={() => setActiveTab('projects')}
            style={{
              padding: '0.7rem 2rem',
              border: 'none',
              borderRadius: '10px',
              background: activeTab === 'projects' ? '#1a1a1a' : 'rgba(0,0,0,0.05)',
              color: activeTab === 'projects' ? '#ffffff' : '#333',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.9rem',
              transition: 'all 0.3s ease',
              boxShadow: activeTab === 'projects' ? '0 4px 15px rgba(0,0,0,0.15)' : 'none'
            }}
          >
            🚀 Projects
          </button>
          <button 
            className={activeTab === 'skills' ? 'active' : ''}
            onClick={() => setActiveTab('skills')}
            style={{
              padding: '0.7rem 2rem',
              border: 'none',
              borderRadius: '10px',
              background: activeTab === 'skills' ? '#1a1a1a' : 'rgba(0,0,0,0.05)',
              color: activeTab === 'skills' ? '#ffffff' : '#333',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.9rem',
              transition: 'all 0.3s ease',
              boxShadow: activeTab === 'skills' ? '0 4px 15px rgba(0,0,0,0.15)' : 'none'
            }}
          >
            💪 Skills
          </button>
        </div>

        {activeTab === 'experience' && <ExperienceManager />}
        {activeTab === 'projects' && <ProjectsManager />}
        {activeTab === 'skills' && <SkillsManager />}
      </div>
    </section>
  );
};

export default AdminPanel;