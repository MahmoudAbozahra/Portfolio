const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 40
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    maxlength: 254
  },
  password: {
    type: String,
    required: true,
    minlength: 12,
    select: false
  },
  role: {
    type: String,
    enum: ['admin', 'editor'],
    default: 'editor',
    required: true
  },
  active: {
    type: Boolean,
    default: true,
    required: true
  },
  lastLogin: Date
}, {
  timestamps: true,
  optimisticConcurrency: true,
  toJSON: {
    transform(doc, value) {
      delete value.password;
      delete value.__v;
      return value;
    }
  }
});

UserSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
