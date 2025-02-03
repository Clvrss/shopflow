const wishlistService = require('../services/wishlistService');
const { ok, created } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');

const list = asyncHandler(async (req, res) => {
  const items = await wishlistService.listWishlist(req.user.id);
  return ok(res, items);
});

const add = asyncHandler(async (req, res) => {
  const item = await wishlistService.addItem(req.user.id, req.params.productId);
  return created(res, item);
});

const remove = asyncHandler(async (req, res) => {
  await wishlistService.removeItem(req.user.id, req.params.productId);
  return res.status(204).end();
});

module.exports = { list, add, remove };
