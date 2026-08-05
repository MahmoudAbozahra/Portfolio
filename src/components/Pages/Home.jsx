import React from 'react';
import { useData } from '../../contexts/DataContext';
import { FaGithub, FaLinkedin, FaEnvelope, FaFileDownload } from 'react-icons/fa';

const Home = () => {
  const { data } = useData();
  
  if (!data || !data.personal || !data.heroStats) {
    return (
      <section className="hero section" id="home">
        <div className="hero-copy">
          <h1>Loading...</h1>
        </div>
      </section>
    );
  }

  const { personal, heroStats } = data;

  return (
    <section className="hero section" id="home">
      <div className="hero-copy">
        <p className="eyebrow">{personal.title || 'Backend Developer'}</p>
        <h1>{personal.name || 'Mahmoud Mostafa Abozahra'}</h1>
        <p className="lead">{personal.summary || ''}</p>

        {/* 4 Action Cards */}
        <div className="action-cards">
          <a className="action-card" href="#contact">
            <div className="action-card-icon">
              <FaEnvelope />
            </div>
            <span className="action-card-label">Contact Me</span>
          </a>
          
          <a 
            className="action-card" 
            href="https://drive.google.com/file/d/1E2jOEN02lUYvOxO6p-Y2LwQFN5xlFgpA/view?usp=sharing"
            target="_blank"
            rel="noreferrer"
          >
            <div className="action-card-icon">
              <FaFileDownload />
            </div>
            <span className="action-card-label">View Resume</span>
          </a>
          
          <a className="action-card" href={personal.github || '#'} target="_blank" rel="noreferrer">
            <div className="action-card-icon">
              <FaGithub />
            </div>
            <span className="action-card-label">GitHub</span>
          </a>
          
          <a className="action-card" href={personal.linkedin || '#'} target="_blank" rel="noreferrer">
            <div className="action-card-icon">
              <FaLinkedin />
            </div>
            <span className="action-card-label">LinkedIn</span>
          </a>
        </div>

      </div>

      <aside className="hero-panel" aria-label="Profile highlights">
        <div className="avatar-card">
          <div className="avatar">MA</div>
          <div>
            <h2>Backend Developer</h2>
            <p>ERP, Industrial Automation, and Integration</p>
          </div>
        </div>

        <div className="stats-grid">
          {heroStats.map((stat, index) => (
            <article className="stat-card" key={index}>
              <strong>{stat.value || ''}</strong>
              <span>{stat.label || ''}</span>
            </article>
          ))}
        </div>
      </aside>
    </section>
  );
};

export default Home;