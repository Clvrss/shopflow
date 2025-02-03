const router = require('express').Router();
const { body } = require('express-validator');
const { requireAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const couponController = require('../controllers/couponController');

router.post(
  '/validate',
  requireAuth,
  validate([
    body('code').notEmpty().withMessage('Coupon code is required'),
    body('subtotalCents').optional().isInt({ min: 0 }),
  ]),
  couponController.validate
);

module.exports = router;
