require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');
const env = require('./config/env');
const logger = require('./config/logger');

const getMongoUri = () => {
  if (!env.mongoDirectHosts.length) return env.mongoUri;
  if (!env.mongoUri.startsWith('mongodb+srv://')) {
    throw new Error('MONGODB_DIRECT_HOSTS requires a mongodb+srv:// MONGODB_URI');
  }

  const parsed = new URL(env.mongoUri);
  const credentials = parsed.username
    ? `${parsed.username}${parsed.password ? `:${parsed.password}` : ''}@`
    : '';
  const options = new URLSearchParams(parsed.searchParams);
  options.set('tls', 'true');
  if (!options.has('authSource')) options.set('authSource', 'admin');

  return `mongodb://${credentials}${env.mongoDirectHosts.join(',')}${parsed.pathname}?${options}`;
};

const startServer = async () => {
  if (!env.mongoUri) throw new Error('MONGODB_URI is required');

  const mongoUri = getMongoUri();
  if (env.mongoDirectHosts.length) logger.warn('Using MongoDB direct seed list because SRV TXT lookup is unavailable');
  await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
  logger.info('MongoDB connected');
  const server = app.listen(env.port, env.host, () => logger.info(`Server listening on ${env.host}:${env.port}`));

  const shutdown = async (signal) => {
    logger.info(`${signal} received; shutting down`);
    server.close(async () => {
      await mongoose.disconnect();
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10000).unref();
  };

  process.once('SIGTERM', () => shutdown('SIGTERM'));
  process.once('SIGINT', () => shutdown('SIGINT'));
  return server;
};

module.exports = { startServer };
