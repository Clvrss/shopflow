/**
 * Wraps an async route handler so rejected promises are forwarded
 * to the Express error handler instead of hanging the request.
 */
module.exports = function asyncHandler(fn) {
  return function wrapper(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
