const { Router } = require('express');
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');
const controller = require('../controllers/ReaderController');
const { validate, readerSchema } = require('../validators');

const router = Router();

router.get('/', auth, role('admin', 'librarian'), controller.index);
router.get('/:id', auth, role('admin', 'librarian'), controller.show);
router.post(
	'/',
	auth,
	role('admin', 'librarian'),
	validate(readerSchema),
	controller.store,
);
router.put(
	'/:id',
	auth,
	role('admin', 'librarian'),
	validate(readerSchema),
	controller.update,
);
router.patch(
	'/:id/inactivate',
	auth,
	role('admin', 'librarian'),
	controller.inactivate,
);
router.delete('/:id', auth, role('admin', 'librarian'), controller.destroy);

module.exports = router;
