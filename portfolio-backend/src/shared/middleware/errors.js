const multer = require('multer');
const AppError = require('../errors/AppError');
const logger = require('../../config/logger');

const asyncHandler = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
const notFound = (req, res, next) => next(new AppError(404, 'NOT_FOUND', 'Route not found'));

const errorHandler = (error, req, res, next) => { // eslint-disable-line no-unused-vars
  let status = error.status || 500;
  let code = error.code || 'INTERNAL_ERROR';
  let message = error.message || 'An unexpected error occurred';
  let details = error.details;

  if (error instanceof multer.MulterError) {
    status = 422;
    code = 'UPLOAD_REJECTED';
    message = error.code === 'LIMIT_FILE_SIZE' ? 'Image exceeds the upload limit' : 'Upload could not be processed';
  } else if (error instanceof SyntaxError && error.status === 400) {
    status = 400;
    code = 'INVALID_JSON';
    message = 'Request body contains invalid JSON';
  } else if (error.name === 'ValidationError') {
    status = 422;
    code = 'VALIDATION_ERROR';
    message = 'Submitted data is invalid';
    details = Object.values(error.errors || {}).map((item) => item.message);
  } else if (error.name === 'CastError') {
    status = 400;
    code = 'INVALID_ID';
    message = 'The supplied identifier is invalid';
  } else if (error.code === 11000) {
    status = 409;
    code = 'CONFLICT';
    message = 'A record with those unique fields already exists';
  } else if (!(error instanceof AppError)) {
    if (status === 404) {
      code = 'NOT_FOUND';
      message = 'Resource not found';
    } else {
      status = 500;
      code = 'INTERNAL_ERROR';
    }
  }

  if (status >= 500) {
    logger.error(`${req.method} ${req.originalUrl} failed`, error);
    message = 'An unexpected server error occurred';
    details = undefined;
  }

  res.status(status).json({ success: false, error: message, code, ...(details ? { details } : {}) });
};

module.exports = { asyncHandler, errorHandler, notFound };
