const defaultData = require('../../../defaultData');
const env = require('../../config/env');
const AppError = require('../../shared/errors/AppError');
const repository = require('./portfolio.repository');
const { sanitizePersonal, sanitizePortfolio, sanitizeProject } = require('./portfolio.validation');

const getPortfolio = async () => (await repository.findOne()) || defaultData;

const updatePortfolio = async (payload) => {
  const update = sanitizePortfolio(payload);
  const portfolio = await repository.findOne();
  if (!portfolio) return repository.create(update);
  portfolio.set(update);
  return portfolio.save();
};

const updatePersonal = async (payload) => {
  const personal = sanitizePersonal(payload);
  const portfolio = await repository.findOne();
  if (!portfolio) return repository.create({ ...defaultData, personal });
  portfolio.personal = personal;
  return portfolio.save();
};

const addProject = async (payload) => {
  const project = sanitizeProject(payload);
  const portfolio = (await repository.findOne()) || await repository.create(defaultData);
  portfolio.projects.push(project);
  await portfolio.save();
  return { project: portfolio.projects.at(-1), portfolio };
};

const updateProject = async (id, payload) => {
  const portfolio = await repository.findOne();
  if (!portfolio) throw new AppError(404, 'PORTFOLIO_NOT_FOUND', 'Portfolio not found');
  const project = portfolio.projects.id(id);
  if (!project) throw new AppError(404, 'PROJECT_NOT_FOUND', 'Project not found');
  project.set(sanitizeProject({ ...project.toObject(), ...payload }));
  await portfolio.save();
  return { project, portfolio };
};

const deleteProject = async (id) => {
  const portfolio = await repository.findOne();
  if (!portfolio) throw new AppError(404, 'PORTFOLIO_NOT_FOUND', 'Portfolio not found');
  const project = portfolio.projects.id(id);
  if (!project) throw new AppError(404, 'PROJECT_NOT_FOUND', 'Project not found');
  project.deleteOne();
  await portfolio.save();
  return portfolio;
};

const resetPortfolio = async (confirmation) => {
  if (!env.allowPortfolioReset) throw new AppError(403, 'RESET_DISABLED', 'Portfolio reset is disabled in this environment');
  if (confirmation !== 'RESET_PORTFOLIO') throw new AppError(400, 'RESET_CONFIRMATION_REQUIRED', 'Explicit reset confirmation is required');
  return repository.resetWith(defaultData);
};

module.exports = { getPortfolio, updatePortfolio, updatePersonal, addProject, updateProject, deleteProject, resetPortfolio };
