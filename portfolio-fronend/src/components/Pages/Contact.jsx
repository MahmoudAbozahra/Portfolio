import React from 'react';
import { FaArrowRight, FaFileArrowDown, FaGithub, FaLinkedin } from 'react-icons/fa6';
import { useData } from '../../contexts/DataContext';
import { useLanguage } from '../../contexts/LanguageContext';
import AnimatedSection from '../motion/AnimatedSection';
import TiltCard from '../motion/TiltCard';

const Contact = () => {
  const { data } = useData();
  const { t } = useLanguage();
  const { personal } = data;
  return (
    <section className="section contact-section" id="contact">
      <AnimatedSection className="section-head contact-heading"><p className="section-kicker">{t('contact')}</p><h2>{t('contactHeadline')}</h2><p>{t('contactSupport')}</p></AnimatedSection>
      <AnimatedSection variant="soft"><TiltCard className="contact-panel glass-card">
        <div className="contact-primary"><span className="availability-dot" /><p>{personal.availability}</p><a className="button primary" href={`mailto:${personal.email}`}>{t('sendEmail')} <FaArrowRight /></a></div>
        <div className="contact-details"><div><small>{t('email')}</small><a href={`mailto:${personal.email}`}>{personal.email}</a></div><div><small>{t('phone')}</small><a href={`tel:${personal.phone}`}>{personal.phone}</a></div><div><small>{t('location')}</small><span>{personal.location}</span></div><div className="contact-inline-actions">{personal.resumeUrl && <a href={personal.resumeUrl} target="_blank" rel="noreferrer" aria-label="Open Mahmoud Abozahra's resume"><FaFileArrowDown /> {t('viewResume')}</a>}<a href={personal.github} target="_blank" rel="noreferrer" aria-label="Mahmoud Abozahra on GitHub"><FaGithub /> GitHub</a><a href={personal.linkedin} target="_blank" rel="noreferrer" aria-label="Mahmoud Abozahra on LinkedIn"><FaLinkedin /> LinkedIn</a></div></div>
      </TiltCard></AnimatedSection>
    </section>
  );
};

export default Contact;
