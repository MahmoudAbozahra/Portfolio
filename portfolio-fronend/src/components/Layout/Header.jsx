import React from 'react';
import { FaCog } from 'react-icons/fa';
import { useLanguage } from '../../contexts/LanguageContext';

const Header = ({ setShowAdmin, showAdmin }) => {
  const { t, toggleLanguage } = useLanguage();

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleBrandClick = (e) => {
    e.preventDefault();
    // إغلاق الـ Admin إذا كان مفتوحاً
    if (showAdmin) {
      setShowAdmin(false);
    }
    // التمرير إلى الهوم
    scrollToSection('home');
  };

  return (
    <header className="site-header">
      <a href="#home" className="brand" onClick={handleBrandClick}>
        Mahmoud
      </a>
      <nav className="nav-links">
        <a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>{t('navProfile')}</a>
        <a href="#experience" onClick={(e) => { e.preventDefault(); scrollToSection('experience'); }}>{t('navExperience')}</a>
        <a href="#projects" onClick={(e) => { e.preventDefault(); scrollToSection('projects'); }}>{t('navProjects')}</a>
        <a href="#skills" onClick={(e) => { e.preventDefault(); scrollToSection('skills'); }}>{t('navSkills')}</a>
        <a href="#education" onClick={(e) => { e.preventDefault(); scrollToSection('education'); }}>{t('navEducation')}</a>
        <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>{t('navContact')}</a>
        <button
          type="button"
          className="language-toggle"
          onClick={toggleLanguage}
          title={t('languageName')}
        >
          {t('switchLanguage')}
        </button>
        <button
          type="button"
          className="admin-link"
          onClick={() => setShowAdmin(prev => !prev)}
          title={showAdmin ? t('closeAdmin') : t('openAdmin')}
        >
          <FaCog />
        </button>
      </nav>
    </header>
  );
};

export default Header;
