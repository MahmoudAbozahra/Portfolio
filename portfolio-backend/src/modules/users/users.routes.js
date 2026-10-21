const express = require('express');
const service = require('./users.service');
const { authenticate, requireCsrf, authorize } = require('../../shared/middleware/auth');
const { asyncHandler } = require('../../shared/middleware/errors');

const router = express.Router();
router.use(authenticate, authorize('admin'));
router.get('/', asyncHandler(async (req, res) => res.json({ success: true, users: await service.listUsers() })));
router.post('/', requireCsrf, asyncHandler(async (req, res) => res.status(201).json({ success: true, user: await service.createUser(req.body) })));
router.patch('/:userId', requireCsrf, asyncHandler(async (req, res) => res.json({ success: true, user: await service.updateUser(req.user, req.params.userId, req.body) })));
router.post('/:userId/password', requireCsrf, asyncHandler(async (req, res) => res.json({ success: true, ...(await service.resetPassword(req.user, req.params.userId, req.body.password)) })));
router.post('/:userId/revoke-sessions', requireCsrf, asyncHandler(async (req, res) => res.json({ success: true, revoked: await service.revokeSessions(req.user, req.params.userId) })));

module.exports = router;
