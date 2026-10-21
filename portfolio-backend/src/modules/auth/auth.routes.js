const express = require('express');
const service = require('./auth.service');
const { setSessionCookie, clearSessionCookie } = require('./auth.cookies');
const { authenticate, requireCsrf } = require('../../shared/middleware/auth');
const { asyncHandler } = require('../../shared/middleware/errors');
const { authLimit } = require('../../shared/middleware/rateLimits');

const router = express.Router();
router.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  res.set('Pragma', 'no-cache');
  next();
});

const respondWithSession = (res, result) => {
  setSessionCookie(res, result.sessionToken);
  return res.json({ success: true, user: result.user, csrfToken: result.csrfToken });
};

router.post('/login', authLimit, asyncHandler(async (req, res) => respondWithSession(res, await service.login(req.body, { userAgent: req.get('user-agent') }))));
router.post('/register', (req, res) => res.status(403).json({ success: false, error: 'Public registration is disabled', code: 'REGISTRATION_DISABLED' }));

const currentUser = asyncHandler(async (req, res) => {
  const csrfToken = await service.issueCsrf(req.session, req.sessionToken);
  res.json({ success: true, user: service.publicUser(req.user), csrfToken });
});
router.get('/me', authenticate, currentUser);
router.get('/verify', authenticate, currentUser);
router.post('/logout', authenticate, requireCsrf, asyncHandler(async (req, res) => {
  await service.logout(req.session._id);
  clearSessionCookie(res);
  res.json({ success: true });
}));
router.post('/sessions/revoke-others', authenticate, requireCsrf, asyncHandler(async (req, res) => {
  const result = await service.revokeOtherSessions(req.user._id, req.session._id);
  res.json({ success: true, revoked: result.deletedCount || 0 });
}));
router.post('/password', authenticate, requireCsrf, asyncHandler(async (req, res) => {
  const result = await service.changePassword(req.user._id, req.body.currentPassword, req.body.newPassword, { userAgent: req.get('user-agent') });
  return respondWithSession(res, result);
}));

module.exports = router;
