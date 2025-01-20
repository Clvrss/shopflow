const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

function validate(rules) {
  return [
    ...rules,
    function validateResult(req, res, next) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const details = errors.array().map((e) => ({
          field: e.path,
          message: e.msg,
        }));
        return next(ApiError.unprocessable('Validation failed', details));
      }
      return next();
    },
  ];
}

module.exports = { validate };
