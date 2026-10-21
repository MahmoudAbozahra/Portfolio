import React, { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import { FaArrowRight } from 'react-icons/fa';
import { useData } from '../../contexts/DataContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { resolveMediaUrl } from '../../lib/apiClient';
import AnimatedSection from '../motion/AnimatedSection';
import RevealText from '../motion/RevealText';

const PortraitOrbit = ({ avatar, name, initials }) => {
  const reduceMotion = useReducedMotion();
  const stageRef = useRef(null);
  const pathId = useId().replace(/:/g, '');
  const pointerX = useMotionValue(.5);
  const pointerY = useMotionValue(.5);
  const x = useSpring(useTransform(pointerX, [0, 1], [-8, 8]), { stiffness: 110, damping: 24 });
  const y = useSpring(useTransform(pointerY, [0, 1], [-7, 7]), { stiffness: 110, damping: 24 });

  const move = (event) => {
    if (reduceMotion || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    pointerX.set((event.clientX - rect.left) / rect.width);
    pointerY.set((event.clientY - rect.top) / rect.height);
  };

  return (
    <motion.div ref={stageRef} className="portrait-orbit" onPointerMove={move} onPointerLeave={() => { pointerX.set(.5); pointerY.set(.5); }} style={reduceMotion ? undefined : { x, y }}>
      <div className="portrait-glow" aria-hidden="true" />
      <motion.svg className="orbit-type" viewBox="0 0 420 420" aria-hidden="true" animate={reduceMotion ? undefined : { rotate: 360 }} transition={{ duration: 42, repeat: Infinity, ease: 'linear' }}>
        <defs><path id={pathId} d="M 210,210 m -174,0 a 174,174 0 1,1 348,0 a 174,174 0 1,1 -348,0" /></defs>
        <text><textPath href={`#${pathId}`}>PYTHON • DJANGO • REACT • BACKEND ENGINEERING • AUTOMATION • </textPath></text>
      </motion.svg>
      <div className="orbit-line outer" aria-hidden="true" />
      <div className="orbit-line inner" aria-hidden="true" />
      <div className="portrait-frame orbit-portrait">{avatar ? <img src={resolveMediaUrl(avatar)} alt={name} /> : <span>{initials}</span>}</div>
    </motion.div>
  );
};

const Home = () => {
  const { data } = useData();
  const { t } = useLanguage();
  const reduceMotion = useReducedMotion();
  const [role, setRole] = useState(0);
  const { personal } = data;
  const roles = [personal.title, ...(personal.summary?.includes('Full Stack Developer') ? ['Full Stack Developer'] : [])]
    .filter((value, index, list) => value && list.indexOf(value) === index);

  useEffect(() => {
    if (reduceMotion || roles.length < 2) return undefined;
    let changes = 0;
    const interval = window.setInterval(() => {
      changes += 1;
      setRole((value) => Math.min(value + 1, roles.length - 1));
      if (changes >= roles.length - 1) window.clearInterval(interval);
    }, 4200);
    return () => window.clearInterval(interval);
  }, [reduceMotion, roles.length]);

  const initials = personal.name?.split(' ').map((part) => part[0]).slice(0, 2).join('');
  const heroIntro = String(personal.summary || '').split(/(?<=[.!?])\s+/)[0] || personal.availability;

  return (
    <section className="hero-section" id="home">
      <div className="hero-container refined-hero">
        <AnimatedSection className="hero-copy">
          <p className="hero-eyebrow"><span /> {personal.location || 'Cairo, Egypt'}</p>
          <RevealText text={personal.name} />
          <div className="role-line" aria-live="polite"><AnimatePresence mode="wait" initial={false}><motion.span key={roles[role]} initial={reduceMotion ? false : { opacity: 0, y: 16, filter: 'blur(7px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={reduceMotion ? undefined : { opacity: 0, y: -14, filter: 'blur(7px)' }} transition={{ duration: .48 }}>{roles[role]}</motion.span></AnimatePresence></div>
          <p className="hero-description">{heroIntro}</p>
          <div className="hero-actions"><a className="button primary" href="#projects">View selected work <FaArrowRight /></a><a className="button secondary" href="#contact">{t('contactMe')}</a></div>
        </AnimatedSection>
        <AnimatedSection className="hero-focus" variant="soft" delay={.12}><PortraitOrbit avatar={personal.avatar} name={personal.name} initials={initials} /></AnimatedSection>
      </div>
    </section>
  );
};

export default Home;
