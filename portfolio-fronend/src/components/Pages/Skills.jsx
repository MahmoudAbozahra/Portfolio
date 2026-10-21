import React from 'react';
import { useData } from '../../contexts/DataContext';
import { useLanguage } from '../../contexts/LanguageContext';
import AnimatedSection from '../motion/AnimatedSection';
import TiltCard from '../motion/TiltCard';

const Skills = () => {
  const { data } = useData();
  const { t } = useLanguage();
  const { skills } = data;

  return (
    <section className="section section-alt" id="skills">
      <AnimatedSection className="section-head">
        <h2>{t('skillsTitle')}</h2>
      </AnimatedSection>

      <div className="skills-container">
        {/* Technical Skills */}
        <div className="skills-group">
          <h3>{skills.technical.title}</h3>
          <div className="skills-grid">
            {skills.technical.categories.map((category, index) => (
              <AnimatedSection key={index} delay={index * .05}>
              <TiltCard className="skill-category">
                <h4>{category.name}</h4>
                <div className="chip-wrap">
                  {category.items.map((item) => (
                    <span key={item} className="chip">{item}</span>
                  ))}
                </div>
              </TiltCard>
              </AnimatedSection>
            ))}
          </div>
        </div>

        {/* Soft Skills */}
        <AnimatedSection className="skills-group">
          <h3>{skills.soft.title}</h3>
          <div className="soft-skills-wrap">
            {skills.soft.items.map((item) => (
              <span key={item} className="chip soft-chip">{item}</span>
            ))}
          </div>
        </AnimatedSection>

      </div>
    </section>
  );
};

export default Skills;
