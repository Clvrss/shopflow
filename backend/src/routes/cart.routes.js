const router = require('express').Router();
const { body } = require('express-validator');
const { requireAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const cartController = require('../controllers/cartController');

router.use(requireAuth);

router.get('/', cartController.get);

router.post(
  '/items',
  validate([
    body('productId').isInt().withMessage('productId is required'),
    body('variantId').optional({ values: 'null' }).isInt(),
    body('quantity').optional().isInt({ min: 1 }).withMessage('quantity must be a positive integer'),
  ]),
  cartController.addItem
);

router.patch(
  '/items/:itemId',
  validate([body('quantity').isInt({ min: 1 }).withMessage('quantity must be a positive integer')]),
  cartController.updateItem
);

router.delete('/items/:itemId', cartController.removeItem);

module.exports = router;
