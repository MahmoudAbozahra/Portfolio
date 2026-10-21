import React from 'react';
import { motion } from 'motion/react';
import { useData } from '../../contexts/DataContext';
import { useLanguage } from '../../contexts/LanguageContext';
import AnimatedSection from '../motion/AnimatedSection';
import StaggerContainer, { staggerItem } from '../motion/StaggerContainer';

const About = () => {
  const { data } = useData();
  const { t } = useLanguage();
  const strengths = data.personal?.keyStrengths || [];
  const stats = data.heroStats || [];
  return (
    <section id="about" className="section about-section">
      <AnimatedSection className="section-head"><p className="section-kicker">Working profile</p><h2>{t('profile')}</h2></AnimatedSection>
      <div className={`about-editorial${stats.length ? '' : ' without-stats'}`}>
        <StaggerContainer className="strength-list" as="ul">{strengths.map((strength, index) => <motion.li variants={staggerItem} key={strength}><span>{String(index + 1).padStart(2, '0')}</span><strong>{strength}</strong></motion.li>)}</StaggerContainer>
        {stats.length > 0 && <AnimatedSection className="impact-panel glass-card" variant="soft"><p className="section-kicker">At a glance</p><div className="impact-grid">{stats.map((stat) => <div key={`${stat.value}-${stat.label}`}><strong>{stat.value}</strong><span>{stat.label}</span></div>)}</div></AnimatedSection>}
      </div>
    </section>
  );
};

export default About;
