const jwt = require('jsonwebtoken');
const config = require('../config');
const ApiError = require('./ApiError');

function signAccessToken(user) {
  return jwt.sign(
    { sub: user.id, role: user.roleName || 'customer' },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
}

function signRefreshToken(user) {
  return jwt.sign(
    { sub: user.id, type: 'refresh' },
    config.jwt.secret,
    { expiresIn: config.jwt.refreshExpiresIn }
  );
}

function verifyToken(token) {
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch (err) {
    throw ApiError.unauthorized('Invalid or expired token');
  }
}

module.exports = { signAccessToken, signRefreshToken, verifyToken };
