const userService = require('../services/userService');
const orderService = require('../services/orderService');
const { ok, created } = require('../utils/response');
const { buildMeta } = require('../utils/paginate');
const asyncHandler = require('../utils/asyncHandler');

const getMe = asyncHandler(async (req, res) => {
  const user = await userService.getMe(req.user.id);
  return ok(res, user);
});

const updateMe = asyncHandler(async (req, res) => {
  const user = await userService.updateMe(req.user.id, req.body);
  return ok(res, user);
});

const listMyOrders = asyncHandler(async (req, res) => {
  const result = await orderService.listUserOrders(req.user.id, req.query);
  return ok(res, result.rows, buildMeta(result.count, result.page, result.limit));
});

const listMyAddresses = asyncHandler(async (req, res) => {
  const addresses = await userService.listAddresses(req.user.id);
  return ok(res, addresses);
});

const createAddress = asyncHandler(async (req, res) => {
  const address = await userService.addAddress(req.user.id, req.body);
  return created(res, address);
});

const deleteAddress = asyncHandler(async (req, res) => {
  await userService.removeAddress(req.user.id, req.params.addressId);
  return res.status(204).end();
});

const adminListUsers = asyncHandler(async (req, res) => {
  const result = await userService.listUsers(req.query);
  return ok(res, result.rows, buildMeta(result.count, result.page, result.limit));
});

const adminGetUser = asyncHandler(async (req, res) => {
  const user = await userService.getUserDetail(req.params.userId);
  return ok(res, user);
});

const adminSetRole = asyncHandler(async (req, res) => {
  const user = await userService.setUserRole(req.user.id, req.params.userId, req.body.roleId);
  return ok(res, user);
});

module.exports = {
  getMe,
  updateMe,
  listMyOrders,
  listMyAddresses,
  createAddress,
  deleteAddress,
  adminListUsers,
  adminGetUser,
  adminSetRole,
};
