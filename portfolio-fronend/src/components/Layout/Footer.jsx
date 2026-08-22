import React from 'react';
import { FaGithub, FaEnvelope } from 'react-icons/fa';
import { useLanguage } from '../../contexts/LanguageContext';

const Footer = () => {
  const year = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="site-footer">
      <p>© {year} Mahmoud Abozahra. {t('allRightsReserved')}</p>
      <div className="footer-links">
        <a href="mailto:mahmoudabozahra1998@gmail.com">
          <FaEnvelope /> {t('email')}
        </a>
        <a href="https://github.com/MahmoudAbozahra" target="_blank" rel="noreferrer">
          <FaGithub /> GitHub
        </a>
      </div>
    </footer>
  );
};

export default Footer;
