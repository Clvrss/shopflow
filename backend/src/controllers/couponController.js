const couponService = require('../services/couponService');
const { ok, created } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');
const { models } = require('../models');

const validate = asyncHandler(async (req, res) => {
  const coupon = await couponService.validateCoupon({
    code: req.body.code,
    subtotalCents: req.body.subtotalCents || 0,
    userId: req.user.id,
  });
  return ok(res, coupon);
});

const create = asyncHandler(async (req, res) => {
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
  return created(res, coupon);
});

module.exports = { validate, create };
