import React from 'react';
import { FaAddressCard, FaBriefcase, FaFolderOpen, FaSliders } from 'react-icons/fa6';
import { useData } from '../../contexts/DataContext';
import { resolveMediaUrl } from '../../lib/apiClient';

const AdminHomePreview = ({ setActiveTab }) => {
  const { data, user } = useData();
  const projects = data?.projects || [];
  const experience = data?.experience || [];
  const skillGroups = data?.skills?.technical?.categories || [];
  const quickActions = [
    ['personal', FaAddressCard, 'Update profile', 'Name, biography, portrait and professional links'],
    ['projects', FaFolderOpen, 'Manage projects', 'Case studies, galleries and project details'],
    ['experience', FaBriefcase, 'Edit experience', 'Roles, companies and achievement-focused bullets'],
    ['skills', FaSliders, 'Organize skills', 'Technical categories and supporting capabilities']
  ];
  return (
    <section className="admin-workspace admin-overview">
      <div className="admin-content-heading"><div><p className="admin-eyebrow">Content operations</p><h2>Welcome back, {user?.username}</h2></div><p>Review the published portfolio and move directly to the section that needs attention.</p></div>
      <div className="admin-summary-grid">
        <div><strong>{projects.length}</strong><span>Projects</span></div>
        <div><strong>{experience.length}</strong><span>Experience entries</span></div>
        <div><strong>{skillGroups.length}</strong><span>Skill groups</span></div>
        <div><strong>{data?.heroStats?.length || 0}</strong><span>Supporting stats</span></div>
      </div>
      <div className="admin-overview-grid">
        <div className="admin-quick-actions"><div className="admin-collection-heading"><h3>Quick actions</h3><span>Portfolio sections</span></div>{quickActions.map(([key, Icon, title, text]) => <button key={key} onClick={() => setActiveTab(key)}><Icon /><span><strong>{title}</strong><small>{text}</small></span></button>)}</div>
        <div className="admin-recent-projects"><div className="admin-collection-heading"><h3>Recent projects</h3><button onClick={() => setActiveTab('projects')}>View all</button></div>{projects.slice(0, 3).map((project) => <article key={project._id || project.title}>{project.images?.[0] ? <img src={resolveMediaUrl(project.images[0])} alt="" onError={(event) => { event.currentTarget.hidden = true; }} /> : <span className="project-placeholder">MA</span>}<div><strong>{project.title}</strong><small>{project.type || 'Portfolio project'}</small></div></article>)}{projects.length === 0 && <div className="admin-empty">No projects published yet.</div>}</div>
      </div>
    </section>
  );
};

export default AdminHomePreview;
