module.exports = {
  personal: {
    name: 'Mahmoud Mostafa Abozahra',
    title: 'Python Backend Developer | Django & REST APIs',
    headline: 'Building reliable enterprise applications, ERP platforms, and industrial automation systems with Python and Django.',
    email: 'mahmoudabozahra1998@gmail.com',
    phone: '01223517700',
    location: 'Cairo, Egypt',
    github: 'https://github.com/MahmoudAbozahra',
    linkedin: 'https://www.linkedin.com/in/mahmoud-abozahra-dev',
    resumeUrl: 'https://drive.google.com/file/d/1aiTskz_drSLgHTnpz-_On9wk9zMu66hn/view?usp=drive_link',
    avatar: '',
    availability: 'Open to Python Backend Developer and Django Developer roles focused on reliable APIs, enterprise systems, and integrations.',
    summary: 'Python Backend Developer experienced in building production Django/DRF systems for ERP, maintenance, and industrial operations. Skilled in complex business workflows, hardware-software integration, multi-tenant applications, Oracle database synchronization, Django ORM performance optimization, and automated backend testing with pytest.',
    keyStrengths: [
      'Django & REST API engineering',
      'Enterprise workflows & service layers',
      'Oracle & PostgreSQL data integration',
      'pytest-driven backend quality',
      'Industrial hardware integration'
    ]
  },
  experience: [
    {
      title: 'Full-Stack Developer',
      company: 'Millennium for Investment & Information Technology',
      period: 'April 2025 – Present',
      details: [
        'Developed and maintained Django/DRF services and REST APIs for enterprise workflows, including authentication and role-based access control.',
        'Integrated Oracle views with local databases and worked with PostgreSQL-backed systems.',
        'Implemented asynchronous backend processing with Celery and Redis.',
        'Built pytest and pytest-django coverage for service-layer logic, accounting integrity, ORM behavior, validation, integrations, regressions, and query efficiency.',
        'Configured GitHub Actions CI to run automated backend tests across two projects.',
        'Supported Docker deployments, production troubleshooting, and ORM performance improvements.'
      ]
    }
  ],
  projects: [
    {
      title: 'Agricultural ERP Platform',
      type: 'Professional project',
      summary: 'A production agricultural ERP platform supporting complex operational and business workflows.',
      details: [
        'Contribution — Built Django REST APIs and reusable service-layer components.',
        'Contribution — Integrated React and TypeScript functionality with backend services.',
        'Engineering approach — Improved server-state and data-fetching patterns with TanStack Query.'
      ],
      tags: ['Django', 'DRF', 'React', 'TypeScript', 'TanStack Query'],
      images: []
    },
    {
      title: 'Maintenance & Service Management Platform',
      type: 'Professional project',
      summary: 'A production system for maintenance contracts, invoicing, preventive visits, inventory, and technician workflows.',
      details: [
        'Contribution — Developed business workflows shared between Django views and Flutter-facing APIs.',
        'Engineering approach — Centralized reusable domain logic in a shared service layer.',
        'Engineering approach — Optimized multi-year contract creation with Django ORM and bulk operations.',
        'Outcome — Reduced contract creation time from 10–13 seconds to 1.25 seconds, approximately 88–90% faster.'
      ],
      tags: ['Django MVT', 'DRF', 'Flutter', 'Django ORM', 'Bulk Operations'],
      images: []
    },
    {
      title: 'Supply Chain & Automated Vehicle Weighing',
      type: 'Professional project',
      summary: 'An industrial operations platform connecting backend software with physical automation equipment.',
      details: [
        'Contribution — Independently implemented integrations with RFID readers, PLCs, infrared sensors, barrier gates, traffic lights, and cameras across backend and frontend workflows.',
        'Contribution — Designed and implemented automated vehicle weighing workflows.',
        'Engineering approach — Modeled multi-tenant company, sub-company, and site structures.',
        'Engineering approach — Built offline-first synchronization with periodic connectivity checks and automatic uploads after reconnection.'
      ],
      tags: ['Django', 'React', 'Oracle', 'RFID', 'PLC', 'Multi-Tenancy'],
      images: []
    }
  ],
  skills: {
    technical: {
      title: 'Technical Skills',
      categories: [
        { name: 'Backend', items: ['Python', 'Django', 'Django REST Framework', 'REST APIs', 'Django ORM', 'Celery', 'Redis', 'JWT', 'RBAC'] },
        { name: 'Databases', items: ['PostgreSQL', 'Oracle Database', 'MySQL', 'SQLite', 'SQL', 'Query Optimization', 'Bulk Operations'] },
        { name: 'Testing & DevOps', items: ['pytest', 'pytest-django', 'Backend Testing', 'Integration Testing', 'Regression Testing', 'GitHub Actions CI', 'Docker', 'Git', 'Linux', 'Postman'] },
        { name: 'Architecture & Integration', items: ['Service Layer', 'OOP', 'SOLID', 'Multi-Tenancy', 'PLC', 'RFID', 'Sensor Integrations', 'Data Synchronization'] },
        { name: 'Frontend', items: ['React', 'JavaScript', 'HTML', 'CSS', 'Bootstrap', 'TypeScript (Basic)'] }
      ]
    },
    soft: {
      title: 'Professional Skills',
      items: ['Problem Solving', 'Analytical Thinking', 'Teamwork', 'Communication', 'Time Management']
    },
    languages: {
      title: 'Languages',
      items: [
        { name: 'Arabic', level: 'Native' },
        { name: 'English', level: 'Intermediate' }
      ]
    }
  },
  education: {
    degree: 'B.Eng. in Electronics & Electrical Communication',
    institution: 'Tanta University',
    year: '2018–2023',
    grade: 'Grade: Good',
    project: 'Graduation Project: Smart Agricultural System — Excellent',
    training: 'National Telecommunication Institute (NTI) — IoT Training, August 2022'
  },
  heroStats: []
};
