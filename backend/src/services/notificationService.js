const { models } = require('../models');
const ApiError = require('../utils/ApiError');

async function list(userId, query = {}) {
  const where = { userId };
  if (query.unreadOnly === 'true') where.isRead = false;

  return models.Notification.findAll({
    where,
    order: [['createdAt', 'DESC']],
    limit: 50,
  });
}

async function unreadCount(userId) {
  return models.Notification.count({ where: { userId, isRead: false } });
}

async function markRead(userId, id) {
  const notification = await models.Notification.findOne({ where: { id, userId } });
  if (!notification) throw ApiError.notFound('Notification not found');

  notification.isRead = true;
  notification.readAt = new Date();
  await notification.save();
  return notification;
}

async function markAllRead(userId) {
  const affected = await models.Notification.update(
    { isRead: true, readAt: new Date() },
    { where: { userId, isRead: false } }
  );
  return affected[0] || 0;
}

async function create(userId, { type, title, body, link }) {
  return models.Notification.create({ userId, type, title, body, link });
}

module.exports = { list, unreadCount, markRead, markAllRead, create };
