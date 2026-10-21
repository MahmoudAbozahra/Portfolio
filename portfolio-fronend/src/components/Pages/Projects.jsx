import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { FaArrowRight, FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';
import { useData } from '../../contexts/DataContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { resolveMediaUrl } from '../../lib/apiClient';
import Reveal from '../motion/Reveal';
import TiltCard from '../motion/TiltCard';
import SafeImage from '../common/SafeImage';

const Projects = () => {
  const { data } = useData();
  const { t } = useLanguage();
  const reduceMotion = useReducedMotion();
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);
  const closeButtonRef = useRef(null);
  const dialogRef = useRef(null);
  const openerRef = useRef(null);
  const projects = data?.projects || [];
  const tags = useMemo(() => ['All', ...new Set(projects.flatMap((project) => project.tags || []))].slice(0, 8), [projects]);
  const visible = filter === 'All' ? projects : projects.filter((project) => project.tags?.includes(filter));
  const images = selected?.images || [];

  const openProject = (project, event) => {
    openerRef.current = event.currentTarget;
    setImageIndex(0);
    setSelected(project);
  };
  const close = () => {
    setSelected(null);
    requestAnimationFrame(() => openerRef.current?.focus());
  };

  useEffect(() => {
    if (!selected) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();
    const onKey = (event) => {
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowRight' && images.length) setImageIndex((value) => (value + 1) % images.length);
      if (event.key === 'ArrowLeft' && images.length) setImageIndex((value) => (value - 1 + images.length) % images.length);
      if (event.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll('button, a[href]');
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [selected, images.length]);

  return (
    <section className="section" id="projects">
      <Reveal className="section-head split-head">
        <div><p className="section-kicker">Selected work</p><h2>{t('projects')}</h2></div>
        <p>Production systems spanning ERP workflows, service operations, and industrial automation.</p>
      </Reveal>
      <div className="project-filters" aria-label="Filter projects">
        {tags.map((tag) => <button key={tag} className={filter === tag ? 'active' : ''} onClick={() => setFilter(tag)}>{tag}</button>)}
      </div>
      <div className="projects-grid">
        {visible.map((project, index) => (
          <Reveal className="project-card-shell" delay={index * 0.06} key={project._id || project.title}>
          <TiltCard as="article" className="project-card glass-card">
            <div className={`project-cover tone-${index % 3}`}>
              {project.images?.[0] ? <SafeImage src={resolveMediaUrl(project.images[0])} alt={`${project.title} preview`} fallbackLabel="Project image unavailable" /> : <div className="system-map" aria-label="Conceptual system architecture"><span>Interface</span><i /><span>Services</span><i /><span>Data</span><small>Conceptual architecture</small></div>}
            </div>
            <p className="card-label">{project.type}</p>
            <h3>{project.title}</h3>
            <p>{project.summary}</p>
            <div className="tag-row">{project.tags?.slice(0, 5).map((tag) => <span key={tag}>{tag}</span>)}</div>
            <button className="project-open" onClick={(event) => openProject(project, event)}>Explore case study <FaArrowRight /></button>
          </TiltCard>
          </Reveal>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div className="project-dialog-backdrop" initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => event.target === event.currentTarget && close()}>
            <motion.div ref={dialogRef} className="project-dialog" role="dialog" aria-modal="true" aria-labelledby="project-dialog-title" initial={reduceMotion ? false : { opacity: 0, y: 26, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18, scale: .98 }} transition={{ duration: .28 }}>
              <button ref={closeButtonRef} className="dialog-close" onClick={close} aria-label={t('closeModal')}><FaTimes /></button>
              <div className="dialog-media">
                {images.length ? <SafeImage src={resolveMediaUrl(images[imageIndex])} alt={`${selected.title}, image ${imageIndex + 1}`} fallbackLabel="Project image unavailable" /> : <div className="system-map large"><span>Experience</span><i /><span>Domain services</span><i /><span>Infrastructure</span><small>Conceptual architecture · not a customer screenshot</small></div>}
                {images.length > 1 && <><button className="dialog-nav prev" onClick={() => setImageIndex((value) => (value - 1 + images.length) % images.length)} aria-label={t('previousImage')}><FaChevronLeft /></button><button className="dialog-nav next" onClick={() => setImageIndex((value) => (value + 1) % images.length)} aria-label={t('nextImage')}><FaChevronRight /></button></>}
              </div>
              <div className="dialog-copy"><p className="card-label">{selected.type}</p><h2 id="project-dialog-title">{selected.title}</h2><p>{selected.summary}</p><ul>{selected.details?.map((detail) => <li key={detail}>{detail}</li>)}</ul><div className="tag-row">{selected.tags?.map((tag) => <span key={tag}>{tag}</span>)}</div></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;
