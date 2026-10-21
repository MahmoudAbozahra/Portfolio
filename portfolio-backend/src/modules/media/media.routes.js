const express = require('express');
const AppError = require('../../shared/errors/AppError');
const { authenticate, requireCsrf, authorize } = require('../../shared/middleware/auth');
const { asyncHandler } = require('../../shared/middleware/errors');
const Portfolio = require('../portfolio/portfolio.model');
const storage = require('./local-storage.adapter');
const { upload, validateFile } = require('./upload.middleware');

const router = express.Router();
const contentWrite = [authenticate, requireCsrf, authorize('admin', 'editor')];
const cleanup = (files = []) => files.forEach((file) => {
  try { storage.remove(file.path); } catch {}
});

router.post('/avatar', contentWrite, upload.single('avatar'), asyncHandler(async (req, res) => {
  if (!req.file) throw new AppError(400, 'FILE_REQUIRED', 'No file uploaded');
  validateFile(req.file);
  const portfolio = await Portfolio.findOne();
  if (!portfolio) {
    cleanup([req.file]);
    throw new AppError(404, 'PORTFOLIO_NOT_FOUND', 'Portfolio not found');
  }

  const oldAvatar = portfolio.personal?.avatar;
  const avatarUrl = storage.publicUrl(req.file.filename);
  portfolio.personal.avatar = avatarUrl;
  await portfolio.save();
  if (oldAvatar?.startsWith('/uploads/') && oldAvatar !== avatarUrl) storage.remove(oldAvatar);
  res.json({ success: true, avatarUrl });
}));

router.post('/project/:projectId/images', contentWrite, upload.array('images', 10), asyncHandler(async (req, res) => {
  if (!req.files?.length) throw new AppError(400, 'FILE_REQUIRED', 'No files uploaded');
  try {
    req.files.forEach(validateFile);
    const portfolio = await Portfolio.findOne();
    if (!portfolio) throw new AppError(404, 'PORTFOLIO_NOT_FOUND', 'Portfolio not found');
    const project = portfolio.projects.id(req.params.projectId);
    if (!project) throw new AppError(404, 'PROJECT_NOT_FOUND', 'Project not found');
    const images = req.files.map((file) => storage.publicUrl(file.filename));
    project.images.push(...images);
    await portfolio.save();
    res.json({ success: true, projectId: project._id, images, project });
  } catch (error) {
    cleanup(req.files);
    throw error;
  }
}));

router.delete('/project/:projectId/image/:imageIndex', contentWrite, asyncHandler(async (req, res) => {
  const portfolio = await Portfolio.findOne();
  if (!portfolio) throw new AppError(404, 'PORTFOLIO_NOT_FOUND', 'Portfolio not found');
  const project = portfolio.projects.id(req.params.projectId);
  if (!project) throw new AppError(404, 'PROJECT_NOT_FOUND', 'Project not found');
  const index = Number(req.params.imageIndex);
  if (!Number.isInteger(index) || index < 0 || index >= project.images.length) throw new AppError(404, 'IMAGE_NOT_FOUND', 'Image not found');
  const [imageUrl] = project.images.splice(index, 1);
  await portfolio.save();
  if (imageUrl?.startsWith('/uploads/')) storage.remove(imageUrl);
  res.json({ success: true, project });
}));

module.exports = router;
