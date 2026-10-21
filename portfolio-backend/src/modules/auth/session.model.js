const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  tokenHash: { type: String, required: true, unique: true, index: true },
  csrfTokenHash: { type: String, required: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
  lastSeenAt: { type: Date, default: Date.now },
  userAgent: { type: String, maxlength: 400, default: '' }
}, { timestamps: true });

module.exports = mongoose.models.Session || mongoose.model('Session', SessionSchema);
