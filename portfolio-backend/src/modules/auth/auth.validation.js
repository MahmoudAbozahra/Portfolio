const AppError = require('../../shared/errors/AppError');

const roles = new Set(['admin', 'editor']);
const cleanText = (value, name, min, max) => {
  const cleaned = String(value || '').trim();
  if (cleaned.length < min || cleaned.length > max) {
    throw new AppError(422, 'VALIDATION_ERROR', `${name} must be between ${min} and ${max} characters`);
  }
  return cleaned;
};

const normalizeEmail = (value) => {
  const email = cleanText(value, 'Email', 5, 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new AppError(422, 'VALIDATION_ERROR', 'Email address is invalid');
  return email;
};

const validatePassword = (value, name = 'Password') => {
  const password = String(value || '');
  if (password.length < 12 || password.length > 128 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password)) {
    throw new AppError(422, 'WEAK_PASSWORD', `${name} must be 12–128 characters and include upper-case, lower-case and numeric characters`);
  }
  return password;
};

const validateRole = (value) => {
  if (!roles.has(value)) throw new AppError(422, 'VALIDATION_ERROR', 'Role must be admin or editor');
  return value;
};

module.exports = { cleanText, normalizeEmail, validatePassword, validateRole };
