const adminService = require('../services/adminService');
const userService = require('../services/userService');
const orderService = require('../services/orderService');
const productService = require('../services/productService');
const { ok } = require('../utils/response');
const { buildMeta } = require('../utils/paginate');
const asyncHandler = require('../utils/asyncHandler');
const { models } = require('../models');

const dashboardStats = asyncHandler(async (req, res) => {
  const stats = await adminService.getDashboardStats();
  return ok(res, stats);
});

const salesReport = asyncHandler(async (req, res) => {
  const report = await adminService.getSalesReport(req.query);
  return ok(res, report);
});

const salesExport = asyncHandler(async (req, res) => {
  const csv = await adminService.exportSalesReport(req.query);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="sales-report.csv"');
  return res.send(csv);
});

const listUsers = asyncHandler(async (req, res) => {
  const result = await userService.listUsers(req.query);
  return ok(res, result.rows, buildMeta(result.count, result.page, result.limit));
});

const getUser = asyncHandler(async (req, res) => {
  const user = await userService.getUserDetail(req.params.userId);
  return ok(res, user);
});

const setUserRole = asyncHandler(async (req, res) => {
  const user = await userService.setUserRole(req.user.id, req.params.userId, req.body.roleId);
  return ok(res, user);
});

const listOrders = asyncHandler(async (req, res) => {
  const result = await orderService.listAllOrders(req.query);
  return ok(res, result.rows, buildMeta(result.count, result.page, result.limit));
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await orderService.updateOrderStatus(req.params.orderId, req.body.status, {
    actorId: req.user.id,
    ip: req.ip,
  });
  return ok(res, order);
});

const lowStock = asyncHandler(async (req, res) => {
  const result = await productService.listLowStock(req.query);
  return ok(res, result.rows, buildMeta(result.count, result.page, result.limit));
});

const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await models.Coupon.create({
    code: String(req.body.code || '').toUpperCase(),
    description: req.body.description || null,
    discountType: req.body.discountType,
    discountValue: req.body.discountValue,
    minSubtotalCents: req.body.minSubtotalCents || 0,
    maxUses: req.body.maxUses || null,
    expiresAt: req.body.expiresAt || null,
    isActive: req.body.isActive !== false,
  });
  return res.status(201).json({ data: coupon });
});

module.exports = {
  dashboardStats,
  salesReport,
  salesExport,
  listUsers,
  getUser,
  setUserRole,
  listOrders,
  updateOrderStatus,
  lowStock,
  createCoupon,
};
