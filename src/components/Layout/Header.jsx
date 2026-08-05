import React from 'react';
import { FaCog, FaLinkedin, FaGithub } from 'react-icons/fa';

const Header = ({ setShowAdmin, showAdmin }) => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="site-header">
      <a href="#home" className="brand" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>
        Mahmoud
      </a>
      <nav className="nav-links">
        <a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>About</a>
        <a href="#experience" onClick={(e) => { e.preventDefault(); scrollToSection('experience'); }}>Experience</a>
        <a href="#projects" onClick={(e) => { e.preventDefault(); scrollToSection('projects'); }}>Projects</a>
        <a href="#skills" onClick={(e) => { e.preventDefault(); scrollToSection('skills'); }}>Skills</a>
        <a href="#education" onClick={(e) => { e.preventDefault(); scrollToSection('education'); }}>Education</a>
        <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>Contact</a>
        <button 
          className="admin-link" 
          onClick={() => setShowAdmin()}
          title={showAdmin ? 'Close Admin' : 'Open Admin Panel'}
        >
          <FaCog />
        </button>
      </nav>
    </header>
  );
};

export default Header;