const router = require('express').Router();
const { requireAuth } = require('../middleware/auth');
const notificationController = require('../controllers/notificationController');

router.use(requireAuth);

router.get('/', notificationController.list);
router.get('/unread-count', notificationController.unreadCount);
router.post('/read-all', notificationController.markAllRead);
router.post('/:id/read', notificationController.markRead);

module.exports = router;
