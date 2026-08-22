import React from 'react';
import { useData } from '../../contexts/DataContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { FaGithub, FaLinkedin, FaEnvelope, FaFileDownload } from 'react-icons/fa';


const API_BASE_URL = import.meta.env.VITE_API_URL;
const SERVER_URL = `${API_BASE_URL}`;

const getImageSrc = (image) => {
  if (!image) return '';

  if (
    image.startsWith('http://') ||
    image.startsWith('https://') ||
    image.startsWith('data:') ||
    image.startsWith('blob:')
  ) {
    return image;
  }

  return `${SERVER_URL}${image}`;
};


const Home = () => {
  const { data, loading } = useData();
  const { t } = useLanguage();

  if (loading || !data || !data.personal) {
    return (
      <section className="hero-section" id="home">
        <div className="hero-container" style={{ justifyContent: 'center' }}>
          <h1 style={{ color: '#fff' }}>{t('loading')}</h1>
        </div>
      </section>
    );
  }

  const { personal, heroStats } = data;

  return (
    <section className="hero-section" id="home">
      <div className="hero-container">
        {/* Left side */}
        <div className="hero-left">
          <p className="hero-eyebrow">{personal.title}</p>
          <h1 className="hero-name">{personal.name}</h1>
          <p className="hero-description">{personal.summary}</p>

          <div className="hero-actions">
            <a className="hero-action-btn" href="#contact">
              <FaEnvelope />
              <span>{t('contactMe')}</span>
            </a>
            <a
              className="hero-action-btn"
              href={personal.resumeUrl}
              target="_blank"
              rel="noreferrer"
            >
              <FaFileDownload />
              <span>{t('viewResume')}</span>
            </a>
            <a className="hero-action-btn" href={personal.github} target="_blank" rel="noreferrer">
              <FaGithub />
              <span>GitHub</span>
            </a>
            <a className="hero-action-btn" href={personal.linkedin} target="_blank" rel="noreferrer">
              <FaLinkedin />
              <span>LinkedIn</span>
            </a>
          </div>
        </div>

        {/* Right side */}
        <div className="hero-right">
          <div className="hero-avatar-wrapper">
            <div className="hero-avatar">
             <img
                src={getImageSrc(personal.avatar)}
                alt={personal.name}
                className="hero-avatar"
                draggable="false"
              />
            </div>
          </div>

          {heroStats && heroStats.length > 0 && (
            <div className="hero-stats">
              {heroStats.map((stat, index) => (
                <div key={index} className="hero-stat-item">
                  <span className="hero-stat-value">{stat.value}</span>
                  <span className="hero-stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Home;
