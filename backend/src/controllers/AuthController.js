const authService = require('../services/AuthService');

class AuthController {
	async register(req, res, next) {
		try {
			const user = await authService.register(req.body);
			res.status(201).json(user);
		} catch (err) {
			if (err.message === 'E-mail já cadastrado')
				return res.status(400).json({ error: err.message });
			next(err);
		}
	}

	async login(req, res, next) {
		try {
			const { email, password } = req.body;
			const result = await authService.login(email, password);
			res.json(result);
		} catch (err) {
			if (
				err.message === 'E-mail ou senha inválidos' ||
				err.message === 'Usuário inativo'
			) {
				return res.status(401).json({ error: err.message });
			}
			next(err);
		}
	}

	async me(req, res, next) {
		try {
			res.json(req.user);
		} catch (err) {
			next(err);
		}
	}

	async forgotPassword(req, res, next) {
		try {
			const result = await authService.forgotPassword(req.body.email);
			res.json(result);
		} catch (err) {
			next(err);
		}
	}

	async resetPassword(req, res, next) {
		try {
			const result = await authService.resetPassword(
				req.body.token,
				req.body.password,
			);
			res.json(result);
		} catch (err) {
			if (
				err.message === 'Token inválido' ||
				err.message === 'Token expirado'
			) {
				return res.status(400).json({ error: err.message });
			}
			next(err);
		}
	}
}

module.exports = new AuthController();
