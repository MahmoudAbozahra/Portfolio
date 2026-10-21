const fs = require('fs');
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const env = require('./config/env');
const AppError = require('./shared/errors/AppError');
const { apiLimit, uploadLimit } = require('./shared/middleware/rateLimits');
const { errorHandler, notFound } = require('./shared/middleware/errors');
const authRoutes = require('./modules/auth/auth.routes');
const usersRoutes = require('./modules/users/users.routes');
const portfolioRoutes = require('./modules/portfolio/portfolio.routes');
const mediaRoutes = require('./modules/media/media.routes');

fs.mkdirSync(env.uploadsDir, { recursive: true });
const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);
const corsOptions = {
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-CSRF-Token', 'X-Confirm-Reset'],
  origin(origin, callback) {
    if (!origin || env.corsOrigins.includes(origin.replace(/\/$/, ''))) return callback(null, true);
    return callback(new AppError(403, 'CORS_REJECTED', 'Origin is not allowed'));
  }
};

// CORS must run before every middleware that can return a response, including
// security headers, parsers, rate limits, authentication and error handling.
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cookieParser());
app.use(express.json({ limit: '1mb', strict: true }));
app.use(express.urlencoded({ extended: false, limit: '256kb' }));
app.use('/uploads', express.static(env.uploadsDir, { maxAge: '7d', etag: true, fallthrough: false }));
app.use('/api/auth', authRoutes);
app.use('/api/users', apiLimit, usersRoutes);
app.use('/api/portfolio', apiLimit, portfolioRoutes);
app.use('/api/upload', apiLimit, uploadLimit, mediaRoutes);
app.get('/api/health', (req, res) => res.json({ success: true, service: 'portfolio-api' }));
app.get('/api/health/ready', (req, res) => {
  const ready = mongoose.connection.readyState === 1;
  res.status(ready ? 200 : 503).json({ success: ready, service: 'portfolio-api', status: ready ? 'ready' : 'unavailable' });
});
app.use(notFound);
app.use(errorHandler);

module.exports = app;
