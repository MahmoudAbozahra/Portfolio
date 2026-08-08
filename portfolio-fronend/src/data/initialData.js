export const initialData = {
  // معلومات شخصية
  personal: {
    name: 'Mahmoud Mostafa Abozahra',
    title: 'Backend Developer',
    email: 'mahmoudabozahra1998@gmail.com',
    phone: '01223517700',
    location: 'Cairo, Egypt',
    github: 'https://github.com/MahmoudAbozahra',
    linkedin: 'https://www.linkedin.com/in/mahmoud-abozahra-dev',
    availability: 'Available for backend work, ERP systems, integration-heavy systems, and production support roles.',
    summary: 'Backend Developer with 1+ year of experience developing production-grade ERP and industrial automation systems using Python, Django, and Django REST Framework. Skilled in building scalable REST APIs, designing maintainable backend architectures, integrating Oracle and PostgreSQL databases, implementing asynchronous processing with Celery and Redis, and developing business-critical enterprise solutions with clean, efficient code.'
  },
  
  // الخبرات
  experience: [
    {
      title: 'Full-Stack Developer',
      company: 'Millennium for Investment & Information Technology',
      period: 'Apr 2025 – Present',
      details: [
        'Developed and maintained production-grade backend systems using Django and Django REST Framework.',
        'Designed and implemented scalable REST APIs and business-critical workflows for ERP and industrial management systems.',
        'Built a fully automated vehicle weighing solution by integrating RFID, PLC, infrared sensors, barrier gates, traffic lights, dual-camera systems, and real-time backend services.',
        'Designed secure authentication and Role-Based Access Control (RBAC).',
        'Integrated Oracle and PostgreSQL databases with synchronization across multiple environments.',
        'Developed asynchronous background services using Celery and Redis.',
        'Refactored legacy modules and optimized database performance through efficient ORM queries and bulk operations.',
        'Collaborated with cross-functional teams, containerized applications using Docker, and supported production deployments and troubleshooting.'
      ]
    }
  ],

  // المشاريع - مع مصفوفة صور
  projects: [
    {
      id: 1,
      title: 'Agricultural ERP Platform',
      type: 'Work Project',
      summary: 'Developed a production-grade ERP platform for agricultural operations.',
      details: [
        'Designed and developed scalable REST APIs using Django REST Framework.',
        'Implemented a modular Service Layer architecture to improve maintainability and code reuse.',
        'Integrated React frontend with backend services and optimized data fetching using TanStack Query.',
        'Collaborated on feature development, API integration, testing, and production deployments within a large-scale enterprise ERP application.'
      ],
      tags: ['DRF', 'React', 'TypeScript', 'ERP', 'Service Layer'],
      images: [] // مصفوفة الصور
    },
    {
      id: 2,
      title: 'Maintenance & Service Management Platform',
      type: 'Work Project',
      summary: 'Built an enterprise management system for weighing companies and maintenance operations.',
      details: [
        'Designed a reusable Service Layer shared between Django MVT views and Flutter mobile APIs.',
        'Developed modules for maintenance contracts, preventive maintenance visits, inventory, technicians, and customer management.',
        'Refactored approximately 70% of the codebase, improving maintainability and overall application performance.',
        'Optimized database operations using bulk_create and efficient ORM queries, significantly reducing maintenance contract creation time.'
      ],
      tags: ['Django MVT', 'DRF', 'Flutter', 'Service Layer', 'Performance'],
      images: []
    },
    {
      id: 3,
      title: 'Supply Chain & Vehicle Weighing Management System',
      type: 'Work Project',
      summary: 'Developed an enterprise industrial automation platform for vehicle weighing and logistics.',
      details: [
        'Built a fully automated weighing workflow integrating RFID, PLCs, infrared sensors, automatic barrier gates, traffic lights, and dual-camera systems with zero manual intervention.',
        'Implemented real-time communication between industrial hardware and backend services for vehicle identification, gate control, and ticket generation.',
        'Developed logistics, inventory, shipment, supplier, and vehicle management modules with Oracle database synchronization.',
        'Implemented secure authentication, RBAC, and business workflows for enterprise-scale operations.'
      ],
      tags: ['Django', 'React', 'Oracle', 'Industrial Automation', 'RFID', 'PLC'],
      images: []
    }
  ],

  // المهارات
  skills: {
    technical: {
      title: 'Technical Skills',
      categories: [
        {
          name: 'Backend',
          items: ['Python', 'Django', 'Django REST Framework (DRF)', 'RESTful APIs', 'Celery', 'JWT Authentication', 'RBAC', 'Service Layer Architecture']
        },
        {
          name: 'Databases',
          items: ['PostgreSQL', 'Oracle Database', 'MySQL', 'SQLite', 'SQL']
        },
        {
          name: 'Industrial & Integration',
          items: ['Industrial Automation', 'Hardware Integration', 'PLC Integration', 'RFID Integration', 'Real-Time Systems']
        },
        {
          name: 'Caching & Messaging',
          items: ['Redis']
        },
        {
          name: 'Frontend',
          items: ['React', 'JavaScript', 'TypeScript (Basic)', 'HTML', 'CSS', 'Bootstrap']
        },
        {
          name: 'DevOps & Tools',
          items: ['Docker', 'Git', 'GitHub', 'Linux', 'Postman']
        },
        {
          name: 'Software Engineering',
          items: ['OOP', 'SOLID Principles', 'Django MVT', 'Unit Testing', 'TDD', 'Performance Optimization']
        }
      ]
    },
    soft: {
      title: 'Soft Skills',
      items: ['Problem Solving', 'Analytical Thinking', 'Teamwork', 'Communication', 'Time Management']
    },
    languages: {
      title: 'Languages',
      items: [
        { name: 'Arabic', level: 'Native' },
        { name: 'English', level: 'Intermediate (Professional Working Proficiency)' }
      ]
    }
  },

  // التعليم
  education: {
    degree: 'B.Eng. in Electronics & Electrical Communication',
    year: '2018–2023',
    grade: 'Overall Grade: Good',
    project: 'Graduation Project: Smart Agricultural System (Excellent)',
    training: 'IoT Training – National Telecommunication Institute (NTI), Aug 2022'
  },

  // إحصائيات الهوم
  heroStats: [
    { value: '1+', label: 'Year of backend experience' },
    { value: '10+', label: 'Production projects' },
    { value: 'Django', label: 'DRF & Service Layer' },
    { value: 'ERP', label: 'Industrial & Weighing Systems' }
  ]
};