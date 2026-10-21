const User = require('./user.model');
const Session = require('./session.model');

const publicFields = 'username email role active createdAt updatedAt lastLogin';

module.exports = {
  findByLogin(login) {
    return User.findOne({ $or: [{ username: login }, { email: login.toLowerCase() }] }).select('+password');
  },
  findUserById(id, includePassword = false) {
    const query = User.findById(id);
    return includePassword ? query.select('+password') : query.select(publicFields);
  },
  findSessionByHash(tokenHash) {
    return Session.findOne({ tokenHash });
  },
  createSession(data) {
    return Session.create(data);
  },
  deleteSession(id) {
    return Session.deleteOne({ _id: id });
  },
  deleteSessionsForUser(userId, exceptId) {
    return Session.deleteMany({ user: userId, ...(exceptId ? { _id: { $ne: exceptId } } : {}) });
  },
  touchSession(id) {
    return Session.updateOne({ _id: id }, { $set: { lastSeenAt: new Date() } });
  }
};
