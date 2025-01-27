const cartService = require('../services/cartService');
const { ok } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');

const get = asyncHandler(async (req, res) => {
  const cart = await cartService.getCart(req.user.id);
  return ok(res, cart);
});

const addItem = asyncHandler(async (req, res) => {
  const cart = await cartService.addItem(req.user.id, req.body);
  return ok(res, cart);
});

const updateItem = asyncHandler(async (req, res) => {
  const cart = await cartService.updateItem(req.user.id, req.params.itemId, req.body.quantity);
  return ok(res, cart);
});

const removeItem = asyncHandler(async (req, res) => {
  const cart = await cartService.removeItem(req.user.id, req.params.itemId);
  return ok(res, cart);
});

module.exports = { get, addItem, updateItem, removeItem };
