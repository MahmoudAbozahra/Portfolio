import React from 'react';

const About = () => {
  return (
    <section className="section section-alt" id="about">
      <div className="section-head">
        <p className="section-kicker">Profile</p>
        <h2>Focused on business logic, stability, and clean integration</h2>
      </div>
      <div className="panel soft-panel">
        <p>
          I build backend systems with a practical mindset: clear business rules, secure access control, reliable integrations,
          and predictable behavior in real operations. My recent work includes ERP modules, weighing systems, RBAC, API
          integration, asynchronous tasks with Celery and Redis, and production support.
        </p>
        <br />
        <p>
          <strong>Key strengths:</strong> Django REST Framework, PostgreSQL/Oracle integration, Celery for async tasks,
          role-based access control, and production debugging.
        </p>
      </div>
    </section>
  );
};

export default About;