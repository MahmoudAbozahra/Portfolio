import React from 'react';
import { FaArrowUp, FaGithub, FaLinkedin } from 'react-icons/fa';
import { useData } from '../../contexts/DataContext';
import { useLanguage } from '../../contexts/LanguageContext';

const Footer = () => {
  const { data } = useData();
  const { t } = useLanguage();
  const personal = data?.personal || {};
  return (
    <footer className="site-footer">
      <div><strong>{personal.name}</strong><p>© {new Date().getFullYear()} · {t('allRightsReserved')}</p></div>
      <div className="footer-links">
        <a href={personal.github} target="_blank" rel="noreferrer"><FaGithub /> GitHub</a>
        <a href={personal.linkedin} target="_blank" rel="noreferrer"><FaLinkedin /> LinkedIn</a>
        <a href="#home" aria-label="Back to top"><FaArrowUp /></a>
      </div>
    </footer>
  );
};

export default Footer;
