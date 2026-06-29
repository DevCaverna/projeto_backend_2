const { Router } = require('express');
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');
const upload = require('../middlewares/upload');
const controller = require('../controllers/BookController');
const { validate, bookSchema } = require('../validators');

const router = Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post(
	'/',
	auth,
	role('admin', 'librarian'),
	validate(bookSchema),
	controller.store,
);
router.put(
	'/:id',
	auth,
	role('admin', 'librarian'),
	validate(bookSchema),
	controller.update,
);
router.delete('/:id', auth, role('admin', 'librarian'), controller.destroy);
router.post(
	'/:id/cover',
	auth,
	role('admin', 'librarian'),
	upload.single('cover'),
	controller.uploadCover,
);

module.exports = router;
