const { Router } = require('express');
const auth = require('../middlewares/auth');
const controller = require('../controllers/NotificationController');

const router = Router();

router.get('/', auth, controller.index);
router.get('/count', auth, controller.countUnread);
router.patch('/:id/read', auth, controller.markAsRead);

module.exports = router;
