import React from 'react';
import { useData } from '../../contexts/DataContext';

import Home from '../Pages/Home';
import About from '../Pages/About';
import Experience from '../Pages/Experience';
import Projects from '../Pages/Projects';
import Skills from '../Pages/Skills';
import Education from '../Pages/Education';
import Contact from '../Pages/Contact';

const AdminHomePreview = ({ setActiveTab }) => {
  const { data, loading } = useData();

  const actions = [
    ['personal', '✏️', 'Personal Info'],
    ['experience', '💼', 'Experience'],
    ['projects', '🚀', 'Projects'],
    ['skills', '🧩', 'Skills'],
    ['education', '🎓', 'Education'],
    ['heroStats', '📊', 'Hero Stats'],
    ['contact', '📬', 'Contact']
  ];

  if (loading || !data) {
    return <div className="admin-preview-loading">Loading preview...</div>;
  }

  return (
    <div className="admin-home-preview">
      <div className="admin-preview-toolbar-wrap">
        <div className="admin-preview-toolbar">
          <div className="admin-preview-toolbar-heading">
            <span className="admin-preview-toolbar-kicker">Admin Preview</span>
            <strong>Edit portfolio sections</strong>
          </div>

          <div className="admin-preview-actions">
            {actions.map(([key, icon, label]) => (
              <button
                key={key}
                type="button"
                className="admin-preview-action"
                onClick={() => setActiveTab(key)}
              >
                <span>{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="admin-preview-page">
        <Home />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <Contact />
      </div>
    </div>
  );
};

export default AdminHomePreview;
