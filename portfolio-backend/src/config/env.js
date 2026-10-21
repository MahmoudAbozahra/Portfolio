const path = require('path');

const parseInteger = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const splitOrigins = (value = '') => value.split(',')
  .map((origin) => origin.trim().replace(/\/$/, ''))
  .filter(Boolean);

const isProduction = process.env.NODE_ENV === 'production';
const configuredOrigins = splitOrigins(process.env.CORS_ORIGINS || process.env.FRONTEND_URL);
const sameSite = String(process.env.SESSION_COOKIE_SAME_SITE || (isProduction ? 'none' : 'lax')).toLowerCase();
if (!['lax', 'strict', 'none'].includes(sameSite)) throw new Error('SESSION_COOKIE_SAME_SITE must be lax, strict or none');

module.exports = Object.freeze({
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction,
  port: parseInteger(process.env.PORT, 5000),
  host: process.env.HOST || '127.0.0.1',
  mongoUri: process.env.MONGODB_URI || '',
  mongoDirectHosts: splitOrigins(process.env.MONGODB_DIRECT_HOSTS),
  corsOrigins: configuredOrigins.length ? configuredOrigins : ['http://localhost:5173', 'http://127.0.0.1:5173'],
  sessionCookieName: process.env.SESSION_COOKIE_NAME || 'portfolio_session',
  sessionCookieSecure: process.env.SESSION_COOKIE_SECURE ? process.env.SESSION_COOKIE_SECURE === 'true' : isProduction,
  sessionCookieSameSite: sameSite,
  sessionCookieDomain: process.env.SESSION_COOKIE_DOMAIN || undefined,
  sessionTtlMs: Math.min(Math.max(parseInteger(process.env.SESSION_TTL_HOURS, 8), 1), 168) * 60 * 60 * 1000,
  uploadsDir: path.resolve(process.env.UPLOADS_DIR || path.join(__dirname, '../../uploads')),
  maxImageBytes: parseInteger(process.env.MAX_IMAGE_BYTES, 5 * 1024 * 1024),
  maxImageCount: Math.min(parseInteger(process.env.MAX_IMAGE_COUNT, 10), 10),
  allowPortfolioReset: process.env.ALLOW_PORTFOLIO_RESET === 'true'
});
