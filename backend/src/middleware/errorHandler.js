const config = require('../config');
const logger = require('../logger');
const ApiError = require('../utils/ApiError');

function notFoundHandler(req, res, next) {
  next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || (err.name === 'SequelizeUniqueConstraintError' ? 409 : 500);
  const message = statusCode >= 500 ? 'An unexpected error occurred' : err.message;
  const details = statusCode >= 500 ? undefined : err.details;

  if (statusCode >= 500) {
    logger.error(`${req.method} ${req.originalUrl}`, {
      requestId: req.id,
      error: err.message,
      stack: err.stack,
    });
  } else {
    logger.warn(`${req.method} ${req.originalUrl} -> ${statusCode} ${err.message}`, {
      requestId: req.id,
    });
  }

  res.status(statusCode).json({
    error: {
      message,
      ...(details ? { details } : {}),
      ...(statusCode >= 500 && config.env !== 'production' ? { debug: err.message } : {}),
    },
    requestId: req.id,
  });
}

module.exports = { notFoundHandler, errorHandler };
