import React from 'react';
import { useData } from '../../contexts/DataContext';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

const Contact = () => {
  const { data } = useData();
  const { personal } = data;

  return (
    <section className="section contact-section section-alt" id="contact">
      <div className="section-head center">
        <p className="section-kicker">Contact</p>
        <h2>Open to backend and Django-based product roles</h2>
      </div>

      <div className="contact-wrapper">
        {/* معلومات الاتصال (بدون أيقونات منفصلة للإيميل) */}
        <div className="contact-cards-grid">
          <a href={`mailto:${personal.email}`} className="contact-card-link">
            <div className="contact-mini-card">
              <span className="contact-mini-label">Email</span>
              <span className="contact-mini-value">{personal.email}</span>
            </div>
          </a>
          <a href={`tel:${personal.phone}`} className="contact-card-link">
            <div className="contact-mini-card">
              <span className="contact-mini-label">Phone</span>
              <span className="contact-mini-value">{personal.phone}</span>
            </div>
          </a>
          <div className="contact-card-link">
            <div className="contact-mini-card">
              <span className="contact-mini-label">Location</span>
              <span className="contact-mini-value">{personal.location}</span>
            </div>
          </div>
        </div>

        {/* رسالة التوفر */}
        <div className="panel contact-message-card">
          <p>{personal.availability}</p>
        </div>

        {/* أزرار التواصل الاجتماعي (GitHub و LinkedIn فقط) */}
        <div className="panel contact-social-card">
          <div className="contact-actions">
            <a href={personal.github} target="_blank" rel="noreferrer" className="contact-btn github">
              <FaGithub /> GitHub
            </a>
            <a href={personal.linkedin} target="_blank" rel="noreferrer" className="contact-btn linkedin">
              <FaLinkedin /> LinkedIn
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;