const crypto = require('crypto');
const env = require('../../config/env');
const repository = require('../../modules/auth/auth.repository');
const { hashToken, sessionIsExpired } = require('../../modules/auth/auth.service');
const AppError = require('../errors/AppError');
const { clearSessionCookie } = require('../../modules/auth/auth.cookies');

const authenticate = async (req, res, next) => {
  try {
    const rawToken = req.cookies?.[env.sessionCookieName];
    if (!rawToken) throw new AppError(401, 'AUTH_REQUIRED', 'Authentication required');
    const session = await repository.findSessionByHash(hashToken(rawToken));
    if (!session || sessionIsExpired(session)) {
      if (session) await repository.deleteSession(session._id);
      clearSessionCookie(res);
      throw new AppError(401, 'SESSION_EXPIRED', 'Session is invalid or expired');
    }
    const user = await repository.findUserById(session.user);
    if (!user || !user.active) {
      await repository.deleteSession(session._id);
      clearSessionCookie(res);
      throw new AppError(401, 'ACCOUNT_INACTIVE', 'Account is unavailable');
    }
    req.session = session;
    req.sessionToken = rawToken;
    req.user = user;
    return next();
  } catch (error) {
    return next(error instanceof AppError ? error : new AppError(401, 'INVALID_SESSION', 'Session is invalid or expired'));
  }
};

const requireCsrf = (req, res, next) => {
  const supplied = String(req.get('x-csrf-token') || '');
  const expected = String(req.session?.csrfTokenHash || '');
  const actual = hashToken(supplied);
  const valid = supplied && expected.length === actual.length && crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(actual));
  if (!valid) return next(new AppError(403, 'CSRF_INVALID', 'CSRF token is missing or invalid'));
  return next();
};

const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) return next(new AppError(403, 'FORBIDDEN', 'You do not have permission for this action'));
  return next();
};

module.exports = { authenticate, requireCsrf, authorize };
