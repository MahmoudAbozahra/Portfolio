import React from 'react';
import { useData } from '../../contexts/DataContext';

const About = () => {
  const { data, loading } = useData();

  if (loading || !data) {
    return (
      <section id="about" className="section">
        <div className="section-head">
          <p className="section-kicker">Profile</p>
          <h2>Loading...</h2>
        </div>
      </section>
    );
  }

  const { personal } = data;
  const keyStrengths = personal.keyStrengths || [];

  return (
    <section id="about" className="section">
      <div className="section-head">
        <h2>Profile</h2>
      </div>

      <div className="panel soft-panel about-card">
        <p>{personal.summary}</p>

        {keyStrengths.length > 0 && (
          <div className="about-strengths">
            <p className="about-strengths-title">
              <strong>Key strengths:</strong>
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