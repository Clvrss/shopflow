const buckets = new Map();

function rateLimit({ windowMs = 60000, max = 100 } = {}) {
  return function limiter(req, res, next) {
    const key = `${req.ip}:${req.method}:${req.path}`;
    const now = Date.now();
    const bucket = buckets.get(key);

    if (!bucket || bucket.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    bucket.count += 1;
    if (bucket.count > max) {
      return res.status(429).json({
        error: { message: 'Too many requests. Please try again later.' },
      });
    }
    return next();
  };
}

module.exports = { rateLimit };
