const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Portfolio = require('../models/Portfolio');
const defaultData = require('../defaultData');

dotenv.config();

const normalize = (value) => String(value || '').trim().toLowerCase();
const titleAliases = {
  'agricultural erp platform': ['agricultural erp platform'],
  'maintenance & service management platform': ['maintenance & service management platform'],
  'supply chain & automated vehicle weighing': [
    'supply chain & automated vehicle weighing',
    'supply chain & vehicle weighing management system'
  ]
};

const matchesProject = (currentTitle, targetTitle) => (
  (titleAliases[normalize(targetTitle)] || [normalize(targetTitle)]).includes(normalize(currentTitle))
);

const mergeProjects = (currentProjects = []) => {
  const current = currentProjects.map((project) => project.toObject ? project.toObject() : project);
  const used = new Set();
  const featured = defaultData.projects.map((target) => {
    const index = current.findIndex((project, position) => !used.has(position) && matchesProject(project.title, target.title));
    if (index < 0) return target;
    used.add(index);
    return {
      ...current[index],
      ...target,
      _id: current[index]._id,
      images: current[index].images || []
    };
  });
  return [...featured, ...current.filter((_, index) => !used.has(index))];
};

const buildUpdate = (current) => {
  const existingPersonal = current.personal?.toObject ? current.personal.toObject() : (current.personal || {});
  const preserveIfPresent = (key) => existingPersonal[key] || defaultData.personal[key];
  return {
    personal: {
      ...defaultData.personal,
      phone: preserveIfPresent('phone'),
      resumeUrl: preserveIfPresent('resumeUrl'),
      avatar: preserveIfPresent('avatar')
    },
    experience: defaultData.experience,
    projects: mergeProjects(current.projects),
    skills: defaultData.skills,
    education: defaultData.education,
    heroStats: []
  };
};

const sync = async () => {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is required');
  await mongoose.connect(process.env.MONGODB_URI);
  const portfolio = await Portfolio.findOne();
  if (!portfolio) throw new Error('No portfolio document exists. Run portfolio:seed first.');

  const update = buildUpdate(portfolio);
  const summary = {
    mode: process.argv.includes('--apply') ? 'apply' : 'dry-run',
    projects: update.projects.map((project) => project.title),
    preservedProjectImages: update.projects.reduce((count, project) => count + (project.images?.length || 0), 0),
    preservedResumeUrl: update.personal.resumeUrl === portfolio.personal?.resumeUrl,
    preservedAvatar: update.personal.avatar === portfolio.personal?.avatar
  };

  if (summary.mode === 'apply') {
    portfolio.set(update);
    await portfolio.save();
  }
  console.log(JSON.stringify(summary, null, 2));
};

if (require.main === module) {
  sync()
    .then(() => mongoose.disconnect())
    .catch(async (error) => {
      console.error('Portfolio content sync failed:', error.message);
      await mongoose.disconnect();
      process.exitCode = 1;
    });
}

module.exports = { buildUpdate, mergeProjects };
