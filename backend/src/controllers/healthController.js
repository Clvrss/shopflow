const { ok } = require('../utils/response');

module.exports = {
  health: (req, res) => {
    return ok(res, {
      status: 'ok',
      service: 'shopflow-api',
      version: process.env.npm_package_version || '0.9.0',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  },
};
