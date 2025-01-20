const ApiError = require('../utils/ApiError');
const { verifyToken } = require('../utils/token');

function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next(ApiError.unauthorized());
  }

  const token = header.slice('Bearer '.length);
  try {
    const payload = verifyToken(token);
    req.user = { id: payload.sub, role: payload.role };
    return next();
  } catch (err) {
    return next(ApiError.unauthorized('Invalid or expired token'));
  }
}

function requireRole(...roles) {
  return function roleGuard(req, res, next) {
    if (!req.user) return next(ApiError.unauthorized());
    if (!roles.includes(req.user.role)) {
      return next(ApiError.forbidden());
    }
    return next();
  };
}

const requireAdmin = requireRole('admin');
const requireStaffOrAdmin = requireRole('staff', 'admin');

module.exports = { requireAuth, requireAdmin, requireStaffOrAdmin, requireRole };
