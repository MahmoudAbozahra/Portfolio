import React from 'react';
import { useData } from '../../contexts/DataContext';
import { useLanguage } from '../../contexts/LanguageContext';
import AnimatedSection from '../motion/AnimatedSection';

const Experience = () => {
  const { data } = useData();
  const { t } = useLanguage();

  return (
    <section className="section" id="experience">
      <AnimatedSection className="section-head">
        <h2>{t('experience')}</h2>
      </AnimatedSection>

      {data.experience.map((exp, index) => (
        <AnimatedSection as="article" className="panel timeline-card" delay={index * .08} key={index}>
          <div className="timeline-header">
            <div>
              <h3>{exp.title}</h3>
              <p>{exp.company}</p>
            </div>
            <span>{exp.period}</span>
          </div>
          <ul className="bullet-list" style={{ listStyle: 'disc', paddingLeft: '1.5rem' }}>
            {exp.details.map((item, i) => (
              <li key={i} style={{ listStyle: 'disc' }}>{item}</li>
            ))}
          </ul>
        </AnimatedSection>
      ))}
    </section>
  );
};

export default Experience;
