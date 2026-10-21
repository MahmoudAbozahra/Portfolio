const rateLimit = require('express-rate-limit');

const createLimit = (windowMs, limit, message) => rateLimit({
  windowMs,
  limit,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, error: message, code: 'RATE_LIMITED' }
});

module.exports = {
  apiLimit: createLimit(15 * 60 * 1000, 300, 'Too many requests. Please try again later.'),
  authLimit: createLimit(15 * 60 * 1000, 10, 'Too many login attempts. Please try again later.'),
  uploadLimit: createLimit(15 * 60 * 1000, 30, 'Too many upload attempts. Please try again later.')
};
