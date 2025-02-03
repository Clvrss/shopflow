const { Op } = require('sequelize');
const sequelize = require('../config/database');
const { models } = require('../models');
const ApiError = require('../utils/ApiError');
const { buildPagination } = require('../utils/paginate');

async function listByProduct(productId, query) {
  const { page, limit, offset } = buildPagination(query);
  const where = { productId, status: 'approved' };

  const { rows, count } = await models.Review.findAndCountAll({
    where,
    include: [
      { model: models.User, as: 'user', attributes: ['id', 'first_name', 'last_name'] },
    ],
    order: [['createdAt', 'DESC']],
    offset,
    limit,
    distinct: true,
  });

  const [agg] = await models.Review.findAll({
    where,
    attributes: [
      [sequelize.fn('COUNT', sequelize.col('Review.id')), 'count'],
      [sequelize.fn('AVG', sequelize.col('Review.rating')), 'average'],
    ],
    raw: true,
  });

  const average = agg && agg.average !== null ? Math.round(Number(agg.average) * 10) / 10 : 0;
  return { rows, count, page, limit, aggregate: { count: agg ? Number(agg.count) : 0, average } };
}

async function create(userId, productId, { rating, title, body }) {
  const product = await models.Product.findByPk(productId);
  if (!product) throw ApiError.notFound('Product not found');

  const purchased = await models.Order.findOne({
    where: { userId, status: { [Op.in]: ['delivered', 'paid'] } },
    include: [{ model: models.OrderItem, as: 'items', where: { productId }, required: true }],
  });

  return models.Review.create({
    productId,
    userId,
    rating,
    title,
    body,
    isVerifiedPurchase: Boolean(purchased),
    status: 'approved',
  });
}

module.exports = { listByProduct, create };
