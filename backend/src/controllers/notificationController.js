const notificationService = require('../services/notificationService');
const { ok } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');

const list = asyncHandler(async (req, res) => {
  const notifications = await notificationService.list(req.user.id, req.query);
  return ok(res, notifications);
});

const unreadCount = asyncHandler(async (req, res) => {
  const count = await notificationService.unreadCount(req.user.id);
  return ok(res, { count });
});

const markRead = asyncHandler(async (req, res) => {
  const notification = await notificationService.markRead(req.user.id, req.params.id);
  return ok(res, notification);
});

const markAllRead = asyncHandler(async (req, res) => {
  const updated = await notificationService.markAllRead(req.user.id);
  return ok(res, { updated });
});

module.exports = { list, unreadCount, markRead, markAllRead };
