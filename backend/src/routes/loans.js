const { Router } = require('express');
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');
const controller = require('../controllers/LoanController');
const { validate, loanSchema } = require('../validators');

const router = Router();

router.get('/', auth, role('admin', 'librarian'), controller.index);
router.get('/overdue', auth, role('admin', 'librarian'), controller.overdue);
router.get('/my-loans', auth, role('reader'), controller.myLoans);
router.get('/my', auth, role('reader'), controller.myLoans);
router.get('/:id', auth, role('admin', 'librarian'), controller.show);
router.post(
	'/',
	auth,
	role('admin', 'librarian', 'reader'),
	validate(loanSchema),
	controller.store,
);
router.put(
	'/:id/return',
	auth,
	role('admin', 'librarian'),
	controller.returnBook,
);

module.exports = router;
