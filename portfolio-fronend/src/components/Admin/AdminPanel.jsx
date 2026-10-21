import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { FaAddressCard, FaBriefcase, FaChartSimple, FaEnvelope, FaEye, FaFolderOpen, FaGraduationCap, FaHouse, FaRightFromBracket, FaShieldHalved, FaSliders, FaUserGear, FaUsers } from 'react-icons/fa6';
import { useData } from '../../contexts/DataContext';
import PersonalInfoManager from './PersonalInfoManager';
import ExperienceManager from './ExperienceManager';
import ProjectsManager from './ProjectsManager';
import SkillsManager from './SkillsManager';
import EducationManager from './EducationManager';
import HeroStatsManager from './HeroStatsManager';
import ContactManager from './ContactManager';
import AdminHomePreview from './AdminHomePreview';
import UsersManager from './UsersManager';
import AccountSettings from './AccountSettings';
import AdminErrorBoundary from './AdminErrorBoundary';

const coreTabs = [
  { key: 'overview', label: 'Overview', icon: FaChartSimple },
  { key: 'personal', label: 'Personal information', icon: FaAddressCard },
  { key: 'projects', label: 'Projects & galleries', icon: FaFolderOpen },
  { key: 'experience', label: 'Experience', icon: FaBriefcase },
  { key: 'skills', label: 'Skills', icon: FaSliders },
  { key: 'education', label: 'Education', icon: FaGraduationCap },
  { key: 'contact', label: 'Contact information', icon: FaEnvelope },
  { key: 'heroStats', label: 'Supporting stats', icon: FaEye }
];

const AdminPanel = ({ setShowAdmin }) => {
  const { isAuthenticated, user, logout, resetData } = useData();
  const [activeTab, setActiveTab] = useState('overview');
  const [resetting, setResetting] = useState(false);
  const tabs = useMemo(() => [
    ...coreTabs,
    ...(user?.role === 'admin' ? [{ key: 'users', label: 'Users & roles', icon: FaUsers }] : []),
    { key: 'account', label: 'Account settings', icon: FaUserGear }
  ], [user?.role]);

  if (!isAuthenticated) return <section className="section admin-section"><div className="panel admin-access-denied"><FaShieldHalved /><h2>Session required</h2><p>Sign in to access the content management system.</p></div></section>;

  const handleReset = async () => {
    if (!window.confirm('Reset all portfolio data? A verified backup and enabled server setting are required.')) return;
    setResetting(true);
    try { await resetData(); setActiveTab('overview'); }
    catch (error) { window.alert(error.response?.data?.error || error.message); }
    finally { setResetting(false); }
  };
  const handleLogout = async () => { await logout(); setShowAdmin(false); };
  const activePanel = {
    overview: <AdminHomePreview setActiveTab={setActiveTab} />,
    personal: <PersonalInfoManager />,
    projects: <ProjectsManager />,
    experience: <ExperienceManager />,
    skills: <SkillsManager />,
    education: <EducationManager />,
    contact: <ContactManager />,
    heroStats: <HeroStatsManager />,
    users: user.role === 'admin' ? <UsersManager /> : null,
    account: <AccountSettings />
  }[activeTab];

  return (
    <section className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand"><span>MA</span><div><strong>Portfolio CMS</strong><small>{user.role} workspace</small></div></div>
        <nav aria-label="Administration sections">{tabs.map((tab) => { const Icon = tab.icon; return <button key={tab.key} className={activeTab === tab.key ? 'active' : ''} onClick={() => setActiveTab(tab.key)}><Icon /><span>{tab.label}</span></button>; })}</nav>
        <div className="admin-sidebar-footer">
          {user.role === 'admin' && <button className="danger-subtle" onClick={handleReset} disabled={resetting}>{resetting ? 'Resetting…' : 'Reset portfolio'}</button>}
          <button onClick={() => setShowAdmin(false)}><FaHouse /> View site</button>
          <button onClick={handleLogout}><FaRightFromBracket /> Sign out</button>
        </div>
      </aside>
      <main className="admin-main">
        <header className="admin-topbar"><div><span className="status-dot" /> Secure session</div><div className="admin-current-user"><span>{user.username}</span><strong>{user.username.slice(0, 2).toUpperCase()}</strong></div></header>
        <div className="admin-stage">
          <AdminErrorBoundary resetKey={activeTab}><AnimatePresence mode="wait"><motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: .24 }}>{activePanel}</motion.div></AnimatePresence></AdminErrorBoundary>
        </div>
      </main>
    </section>
  );
};

export default AdminPanel;
