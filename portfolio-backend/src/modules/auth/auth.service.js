const crypto = require('crypto');
const env = require('../../config/env');
const AppError = require('../../shared/errors/AppError');
const defaultRepository = require('./auth.repository');
const { validatePassword } = require('./auth.validation');

const hashToken = (value) => crypto.createHash('sha256').update(value).digest('hex');
const randomToken = () => crypto.randomBytes(32).toString('base64url');
const sessionIsExpired = (session, now = Date.now()) => !session?.expiresAt || new Date(session.expiresAt).getTime() <= now;
const publicUser = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  role: user.role,
  active: user.active,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
  lastLogin: user.lastLogin
});

const createAuthService = (repository = defaultRepository) => {
  const createSession = async (userId, userAgent = '') => {
    const sessionToken = randomToken();
    const csrfToken = hashToken(`csrf:${sessionToken}`);
    const session = await repository.createSession({
      user: userId,
      tokenHash: hashToken(sessionToken),
      csrfTokenHash: hashToken(csrfToken),
      expiresAt: new Date(Date.now() + env.sessionTtlMs),
      userAgent: String(userAgent || '').slice(0, 400)
    });
    return { session, sessionToken, csrfToken };
  };

  return {
    async login(input = {}, meta = {}) {
      const loginName = String(input.username || '').trim().slice(0, 254);
      const password = String(input.password || '');
      if (!loginName || !password) throw new AppError(400, 'INVALID_CREDENTIALS_INPUT', 'Username and password are required');
      const user = await repository.findByLogin(loginName);
      if (!user || !(await user.comparePassword(password))) throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid credentials');
      if (!user.active) throw new AppError(403, 'ACCOUNT_DISABLED', 'This account is inactive');
      user.lastLogin = new Date();
      await user.save();
      return { ...(await createSession(user._id, meta.userAgent)), user: publicUser(user) };
    },
    async issueCsrf(session, sessionToken) {
      const csrfToken = hashToken(`csrf:${sessionToken}`);
      if (session.csrfTokenHash !== hashToken(csrfToken)) {
        session.csrfTokenHash = hashToken(csrfToken);
        await session.save();
      }
      return csrfToken;
    },
    logout(sessionId) {
      return repository.deleteSession(sessionId);
    },
    revokeOtherSessions(userId, sessionId) {
      return repository.deleteSessionsForUser(userId, sessionId);
    },
    async changePassword(userId, currentPassword, newPassword, meta = {}) {
      const user = await repository.findUserById(userId, true);
      if (!user || !(await user.comparePassword(String(currentPassword || '')))) {
        throw new AppError(401, 'INVALID_CURRENT_PASSWORD', 'Current password is incorrect');
      }
      user.password = validatePassword(newPassword, 'New password');
      await user.save();
      const replacement = await createSession(user._id, meta.userAgent);
      await repository.deleteSessionsForUser(user._id, replacement.session._id);
      return { ...replacement, user: publicUser(user) };
    },
    publicUser
  };
};

module.exports = { ...createAuthService(), createAuthService, hashToken, sessionIsExpired, publicUser };
