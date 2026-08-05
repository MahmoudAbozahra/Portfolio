import React from 'react';
import { useData } from '../../contexts/DataContext';
import { FaGraduationCap, FaCertificate } from 'react-icons/fa';

const Education = () => {
  const { data } = useData();
  const { education } = data;

  return (
    <section className="section" id="education">
      <div className="section-head">
        <p className="section-kicker">Education</p>
        <h2>Academic background and training</h2>
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
            <p className="education-detail highlight">{education.project}</p>
          </div>
        </div>

        <div className="panel education-card">
          <div className="education-icon">
            <FaCertificate />
          </div>
          <div className="education-content">
            <h3>Training</h3>
            <p className="education-detail">{education.training}</p>
          </div>
        </div>

        <div className="panel education-card languages-card">
          <div className="education-icon">
            <FaGraduationCap />
          </div>
          <div className="education-content">
            <h3>Languages</h3>
            <div className="languages-list">
              <div className="language-item">
                <span className="lang-name">Arabic</span>
                <span className="lang-level">Native</span>
              </div>
              <div className="language-item">
                <span className="lang-name">English</span>
                <span className="lang-level">Intermediate (Professional Working Proficiency)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;