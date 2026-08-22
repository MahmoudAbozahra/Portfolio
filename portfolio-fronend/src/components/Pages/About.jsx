import React from 'react';
import { useData } from '../../contexts/DataContext';
import { useLanguage } from '../../contexts/LanguageContext';

const About = () => {
  const { data, loading } = useData();
  const { t } = useLanguage();

  if (loading || !data) {
    return (
      <section id="about" className="section">
        <div className="section-head">
          <p className="section-kicker">{t('profile')}</p>
          <h2>{t('loading')}</h2>
        </div>
      </section>
    );
  }

  const { personal } = data;
  const keyStrengths = personal.keyStrengths || [];

  return (
    <section id="about" className="section">
      <div className="section-head">
        <h2>{t('profile')}</h2>
      </div>

      <div className="panel soft-panel about-card">
        <p>{personal.summary}</p>

        {keyStrengths.length > 0 && (
          <div className="about-strengths">
            <p className="about-strengths-title">
              <strong>{t('keyStrengths')}</strong>
            </p>

            <ul className="about-strengths-list">
              {keyStrengths.map((strength, index) => (
                <li key={index}>{strength}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};

export default About;
