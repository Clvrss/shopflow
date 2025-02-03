const router = require('express').Router();
const { requireAuth } = require('../middleware/auth');
const wishlistController = require('../controllers/wishlistController');

router.use(requireAuth);

router.get('/', wishlistController.list);
router.post('/:productId', wishlistController.add);
router.delete('/:productId', wishlistController.remove);

module.exports = router;
