const logger = require('../logger');
const { models } = require('../models');

async function writeAudit({ actorUserId, action, entityType, entityId, before, after, ip }) {
  try {
    await models.AuditLog.create({
      actorUserId,
      action,
      entityType,
      entityId,
      before: before || null,
      after: after || null,
      ip: ip || null,
    });
  } catch (err) {
    logger.warn(`audit write failed for ${action}: ${err.message}`);
  }
}

module.exports = { writeAudit };
