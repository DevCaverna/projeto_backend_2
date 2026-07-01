const { Router } = require('express');
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');
const controller = require('../controllers/AuthController');
const {
	validate,
	registerSchema,
	loginSchema,
	forgotPasswordSchema,
	resetPasswordSchema,
} = require('../validators');

const router = Router();

router.post(
	'/register',
	auth,
	role('admin'),
	validate(registerSchema),
	controller.register,
);
router.post('/login', validate(loginSchema), controller.login);
router.get('/me', auth, controller.me);
router.post(
	'/forgot-password',
	validate(forgotPasswordSchema),
	controller.forgotPassword,
);
router.post(
	'/reset-password',
	validate(resetPasswordSchema),
	controller.resetPassword,
);

module.exports = router;
