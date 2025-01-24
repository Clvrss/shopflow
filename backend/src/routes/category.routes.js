const router = require('express').Router();
const categoryController = require('../controllers/categoryController');

router.get('/', categoryController.list);
router.get('/:slug/products', categoryController.products);

module.exports = router;
