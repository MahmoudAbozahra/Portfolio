const AppError = require('../../shared/errors/AppError');
const repository = require('./users.repository');
const { cleanText, normalizeEmail, validatePassword, validateRole } = require('../auth/auth.validation');
const { publicUser } = require('../auth/auth.service');

const wouldRemoveFinalAdmin = ({ target, nextRole, nextActive, activeAdminCount }) => (
  target.role === 'admin' && target.active && (nextRole !== 'admin' || !nextActive) && activeAdminCount <= 1
);

const ensureUnique = async (username, email, excludeId) => {
  if (await repository.findConflict(username, email, excludeId)) {
    throw new AppError(409, 'USER_EXISTS', 'Username or email is already in use');
  }
};

const listUsers = () => repository.list();

const createUser = async (input = {}) => {
  const username = cleanText(input.username, 'Username', 3, 40);
  const email = normalizeEmail(input.email);
  const password = validatePassword(input.password);
  const role = validateRole(input.role || 'editor');
  await ensureUnique(username, email);
  if (input.active !== undefined && typeof input.active !== 'boolean') throw new AppError(422, 'VALIDATION_ERROR', 'Active status must be a boolean');
  return publicUser(await repository.create({ username, email, password, role, active: input.active !== false }));
};

const updateUser = async (actor, id, input = {}) => {
  const target = await repository.findById(id);
  if (!target) throw new AppError(404, 'USER_NOT_FOUND', 'User not found');
  const username = input.username === undefined ? target.username : cleanText(input.username, 'Username', 3, 40);
  const email = input.email === undefined ? target.email : normalizeEmail(input.email);
  const role = input.role === undefined ? target.role : validateRole(input.role);
  if (input.active !== undefined && typeof input.active !== 'boolean') throw new AppError(422, 'VALIDATION_ERROR', 'Active status must be a boolean');
  const active = input.active === undefined ? target.active : input.active;

  if (String(actor._id) === String(target._id) && (role !== 'admin' || !active)) {
    throw new AppError(409, 'SELF_LOCKOUT_PREVENTED', 'You cannot demote or deactivate your own account');
  }
  const activeAdminCount = await repository.countActiveAdmins();
  if (wouldRemoveFinalAdmin({ target, nextRole: role, nextActive: active, activeAdminCount })) {
    throw new AppError(409, 'FINAL_ADMIN_REQUIRED', 'At least one active administrator must remain');
  }
  await ensureUnique(username, email, target._id);
  const shouldRevoke = target.active !== active || target.role !== role;
  target.set({ username, email, role, active });
  await target.save();
  if (shouldRevoke) await repository.revokeSessions(target._id);
  return publicUser(target);
};

const resetPassword = async (actor, id, newPassword) => {
  const target = await repository.findById(id, true);
  if (!target) throw new AppError(404, 'USER_NOT_FOUND', 'User not found');
  if (String(actor._id) === String(target._id)) {
    throw new AppError(409, 'USE_ACCOUNT_PASSWORD_CHANGE', 'Use Account Settings to change your own password');
  }
  target.password = validatePassword(newPassword, 'Temporary password');
  await target.save();
  const result = await repository.revokeSessions(target._id);
  return { user: publicUser(target), revoked: result.deletedCount || 0 };
};

const revokeSessions = async (actor, id) => {
  if (String(actor._id) === String(id)) throw new AppError(409, 'SELF_SESSION_REVOKE_PREVENTED', 'Use logout or Account Settings for your own sessions');
  const target = await repository.findById(id);
  if (!target) throw new AppError(404, 'USER_NOT_FOUND', 'User not found');
  const result = await repository.revokeSessions(target._id);
  return result.deletedCount || 0;
};

module.exports = { listUsers, createUser, updateUser, resetPassword, revokeSessions, wouldRemoveFinalAdmin };
