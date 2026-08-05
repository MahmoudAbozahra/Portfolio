import React from 'react';
import { useData } from '../../contexts/DataContext';

const Experience = () => {
  const { data } = useData();

  return (
    <section className="section section-alt" id="experience">
      <div className="section-head">
        <p className="section-kicker">Experience</p>
        <h2>Production work that matches the CV</h2>
      </div>
      
      {data.experience.map((exp, index) => (
        <article className="panel timeline-card" key={index}>
          <div className="timeline-header">
            <div>
              <h3>{exp.title}</h3>
              <p>{exp.company}</p>
            </div>
            <span>{exp.period}</span>
          </div>
          <ul className="bullet-list">
            {exp.details.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </article>
      ))}
    </section>
  );
};

export default Experience;