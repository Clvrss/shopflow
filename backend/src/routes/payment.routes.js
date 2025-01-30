const router = require('express').Router();
const { body } = require('express-validator');
const { requireAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const paymentController = require('../controllers/paymentController');

router.post(
  '/:orderId/charge',
  requireAuth,
  validate([
    body('method').optional().isIn(['card', 'paypal', 'bank_transfer', 'klarna']),
  ]),
  paymentController.charge
);

module.exports = router;
