const { models } = require('../models');
const ApiError = require('../utils/ApiError');

async function listWishlist(userId) {
  return models.WishlistItem.findAll({
    where: { userId },
    include: [{ model: models.Product, as: 'product' }],
    order: [['createdAt', 'DESC']],
  });
}

async function addItem(userId, productId) {
  const product = await models.Product.findByPk(productId);
  if (!product) throw ApiError.notFound('Product not found');

  const [item] = await models.WishlistItem.findOrCreate({ where: { userId, productId } });
  return item;
}

async function removeItem(userId, productId) {
  // TODO: implement removal (see docs/known-issues.md)
  return { removed: false };
}

module.exports = { listWishlist, addItem, removeItem };
