import React from 'react';
import { useData } from '../../contexts/DataContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { FaGraduationCap, FaCertificate, FaLanguage } from 'react-icons/fa';

const Education = () => {
  const { data } = useData();
  const { t } = useLanguage();
  const { education } = data;

  return (
    <section className="section" id="education">
      <div className="section-head">
        <p className="section-kicker">{t('educationKicker')}</p>
        <h2>{t('educationTitle')}</h2>
      </div>

      <div className="education-wrapper">
        <div className="panel education-card">
          <div className="education-icon">
            <FaGraduationCap />
          </div>
          <div className="education-content">
            <h3>{education.degree}</h3>
            <p className="education-year">{education.year}</p>
            <p className="education-detail">{education.grade}</p>
            <p className="education-detail" style={{ color: 'inherit' }}>{education.project}</p> {/* إزالة اللون الأزرق */}
          </div>
        </div>

        <div className="panel education-card">
          <div className="education-icon">
            <FaCertificate />
          </div>
          <div className="education-content">
            <h3>{t('training')}</h3>
            <p className="education-detail">{education.training}</p>
          </div>
        </div>

        <div className="panel education-card languages-card">
          <div className="education-icon" style={{ color: '#1a1a1a' }}>
            <FaLanguage /> {/* تغيير الأيقونة */}
          </div>
          <div className="education-content">
            <h3>{t('languages')}</h3>
            <div className="languages-list">
              {data.skills.languages.items.map((lang, idx) => (
                <div className="language-item" key={idx}>
                  <span className="lang-name">{lang.name}</span>
                  <span className="lang-level">{lang.level}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;
