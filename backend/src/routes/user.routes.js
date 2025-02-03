const router = require('express').Router();
const { body } = require('express-validator');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const userController = require('../controllers/userController');

router.get('/me', requireAuth, userController.getMe);

router.patch(
  '/me',
  requireAuth,
  validate([
    body('firstName').optional().isString().trim().isLength({ max: 100 }),
    body('lastName').optional().isString().trim().isLength({ max: 100 }),
    body('phone').optional().isString().isLength({ max: 30 }),
    body('bio').optional().isString(),
    body('locale').optional().isString().isLength({ max: 10 }),
    body('marketingOptIn').optional().isBoolean(),
  ]),
  userController.updateMe
);

router.get('/me/orders', requireAuth, userController.listMyOrders);
router.get('/me/addresses', requireAuth, userController.listMyAddresses);

router.post(
  '/me/addresses',
  requireAuth,
  validate([
    body('label').optional().isString().isLength({ max: 50 }),
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('line1').notEmpty().withMessage('Address line 1 is required'),
    body('city').notEmpty().withMessage('City is required'),
    body('country').isLength({ min: 2, max: 2 }).withMessage('Country must be a 2-letter code'),
    body('isDefault').optional().isBoolean(),
  ]),
  userController.createAddress
);

router.delete('/me/addresses/:addressId', requireAuth, userController.deleteAddress);

router.get('/', requireAuth, requireAdmin, userController.adminListUsers);
router.get('/:userId', requireAuth, requireAdmin, userController.adminGetUser);

router.patch(
  '/:userId/role',
  requireAuth,
  requireAdmin,
  validate([body('roleId').isInt().withMessage('roleId must be an integer')]),
  userController.adminSetRole
);

module.exports = router;
