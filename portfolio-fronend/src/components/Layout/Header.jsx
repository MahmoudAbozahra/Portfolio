import React, { useEffect, useState } from 'react';
import { LayoutGroup, motion } from 'motion/react';
import { FaBars, FaCog, FaTimes } from 'react-icons/fa';
import { useLanguage } from '../../contexts/LanguageContext';
import ScrollProgress from '../motion/ScrollProgress';

const sections = [['about', 'navProfile'], ['experience', 'navExperience'], ['projects', 'navProjects'], ['skills', 'navSkills'], ['education', 'navEducation'], ['contact', 'navContact']];

const Header = ({ setShowAdmin, showAdmin }) => {
  const { t, toggleLanguage } = useLanguage();
  const [active, setActive] = useState('home');
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let frame;
    const update = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        const next = window.scrollY > 82;
        setScrolled((current) => current === next ? current : next);
        frame = null;
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => { window.removeEventListener('scroll', update); if (frame) window.cancelAnimationFrame(frame); };
  }, []);

  const scrollTo = (id, updateHistory = true) => {
    setOpen(false);
    const node = document.getElementById(id);
    if (!node) return;
    if (updateHistory && window.location.hash !== `#${id}`) window.history.pushState(null, '', `#${id}`);
    node.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  };

  useEffect(() => {
    if (showAdmin) return undefined;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id);
    }, { rootMargin: '-22% 0px -62%', threshold: [.05, .25, .55] });
    ['home', ...sections.map(([id]) => id)].forEach((id) => { const node = document.getElementById(id); if (node) observer.observe(node); });
    const restoreHash = () => { const id = window.location.hash.slice(1); if (id) window.setTimeout(() => scrollTo(id, false), 0); };
    restoreHash();
    window.addEventListener('popstate', restoreHash);
    return () => { observer.disconnect(); window.removeEventListener('popstate', restoreHash); };
  }, [showAdmin]);

  return (
    <motion.header className={`site-header ${scrolled ? 'is-scrolled' : 'is-top'} ${showAdmin ? 'is-admin' : ''}`}>
      <button className="brand" onClick={() => showAdmin ? setShowAdmin(false) : scrollTo('home')} aria-label="Mahmoud Abozahra, home"><motion.span layout>MA</motion.span><motion.strong layout>Mahmoud Abozahra</motion.strong></button>
      {!showAdmin && <button className="menu-toggle" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="primary-navigation" aria-label="Toggle navigation">{open ? <FaTimes /> : <FaBars />}</button>}
      <LayoutGroup id="primary-nav"><nav id="primary-navigation" className={`nav-links ${open || showAdmin ? 'is-open' : ''}`} aria-label="Primary navigation">
        {!showAdmin && sections.map(([id, key]) => <a key={id} href={`#${id}`} className={active === id ? 'active' : ''} aria-current={active === id ? 'location' : undefined} onClick={(event) => { event.preventDefault(); scrollTo(id); }}>{active === id && <motion.span className="nav-active-indicator" layoutId="nav-active" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}<span>{t(key)}</span></a>)}
        {!showAdmin && <button type="button" className="language-toggle" onClick={toggleLanguage} title={t('languageName')}>{t('switchLanguage')}</button>}
        <button type="button" className="admin-link" onClick={() => setShowAdmin(!showAdmin)} title={showAdmin ? t('closeAdmin') : t('openAdmin')}><FaCog /><span>{showAdmin ? t('closeAdmin') : 'Admin'}</span></button>
      </nav></LayoutGroup>
      {!showAdmin && <ScrollProgress />}
    </motion.header>
  );
};

export default Header;
