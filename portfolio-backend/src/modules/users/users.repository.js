const User = require('../auth/user.model');
const Session = require('../auth/session.model');

const publicFields = 'username email role active createdAt updatedAt lastLogin';

module.exports = {
  list() {
    return User.find({}).select(publicFields).sort({ role: 1, createdAt: 1 }).lean();
  },
  findById(id, includePassword = false) {
    const query = User.findById(id);
    return includePassword ? query.select('+password') : query.select(publicFields);
  },
  findConflict(username, email, excludeId) {
    return User.findOne({
      ...(excludeId ? { _id: { $ne: excludeId } } : {}),
      $or: [{ username }, { email }]
    }).select('_id').lean();
  },
  create(data) {
    return User.create(data);
  },
  countActiveAdmins() {
    return User.countDocuments({ role: 'admin', active: true });
  },
  revokeSessions(userId) {
    return Session.deleteMany({ user: userId });
  }
};
