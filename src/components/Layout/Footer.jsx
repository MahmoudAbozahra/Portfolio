import React from 'react';
import { FaGithub, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="site-footer">
      <p>© {year} Mahmoud Abozahra. All rights reserved.</p>
      <div className="footer-links">
        <a href="mailto:mahmoudabozahra1998@gmail.com">
          <FaEnvelope /> Email
        </a>
        <a href="https://github.com/MahmoudAbozahra" target="_blank" rel="noreferrer">
          <FaGithub /> GitHub
        </a>
      </div>
    </footer>
  );
};

export default Footer;