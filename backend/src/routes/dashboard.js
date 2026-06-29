const { Router } = require('express');
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');
const controller = require('../controllers/DashboardController');

const router = Router();

router.get('/stats', auth, role('admin', 'librarian'), controller.stats);
router.get(
	'/loans-by-month',
	auth,
	role('admin', 'librarian'),
	controller.loansByMonth,
);
router.get(
	'/books-by-category',
	auth,
	role('admin', 'librarian'),
	controller.booksByCategory,
);

module.exports = router;
