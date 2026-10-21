const express = require('express');
const service = require('./portfolio.service');
const { authenticate, requireCsrf, authorize } = require('../../shared/middleware/auth');
const { asyncHandler } = require('../../shared/middleware/errors');

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  res.set('Cache-Control', 'public, max-age=0, must-revalidate');
  return res.json(await service.getPortfolio());
}));
const contentWrite = [authenticate, requireCsrf, authorize('admin', 'editor')];
router.put('/', contentWrite, asyncHandler(async (req, res) => res.json(await service.updatePortfolio(req.body))));
router.put('/personal', contentWrite, asyncHandler(async (req, res) => res.json(await service.updatePersonal(req.body))));
router.post('/projects', contentWrite, asyncHandler(async (req, res) => res.status(201).json({ success: true, ...(await service.addProject(req.body)) })));
router.put('/projects/:projectId', contentWrite, asyncHandler(async (req, res) => res.json({ success: true, ...(await service.updateProject(req.params.projectId, req.body)) })));
router.delete('/projects/:projectId', contentWrite, asyncHandler(async (req, res) => res.json({ success: true, portfolio: await service.deleteProject(req.params.projectId) })));
router.delete('/', authenticate, requireCsrf, authorize('admin'), asyncHandler(async (req, res) => res.json({ success: true, portfolio: await service.resetPortfolio(req.get('x-confirm-reset')) })));

module.exports = router;
