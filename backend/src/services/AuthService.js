const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { User, PasswordReset } = require('../models');

const RESET_PASSWORD_MESSAGE =
	'Se o e-mail existir, enviaremos um link de recuperação';

class AuthService {
	async register(data) {
		const exists = await User.findOne({ where: { email: data.email } });
		if (exists) throw new Error('E-mail já cadastrado');

		const password = await bcrypt.hash(data.password, 10);
		const user = await User.create({ ...data, password });
		return {
			id: user.id,
			name: user.name,
			email: user.email,
			role: user.role,
		};
	}

	async login(email, password) {
		const user = await User.scope('withPassword').findOne({
			where: { email },
		});
		if (!user) throw new Error('E-mail ou senha inválidos');
		if (user.status === 'inactive') throw new Error('Usuário inativo');

		const valid = await bcrypt.compare(password, user.password);
		if (!valid) throw new Error('E-mail ou senha inválidos');

		const token = jwt.sign(
			{ id: user.id, role: user.role },
			process.env.JWT_SECRET,
			{
				expiresIn: process.env.JWT_EXPIRES_IN || '7d',
			},
		);

		return {
			token,
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				role: user.role,
				status: user.status,
			},
		};
	}

	async forgotPassword(email) {
		const user = await User.findOne({ where: { email } });
		if (!user) return { message: RESET_PASSWORD_MESSAGE };

		await PasswordReset.update(
			{ used: true },
			{ where: { user_id: user.id, used: false } },
		);

		const token = crypto.randomBytes(32).toString('hex');
		const expiresAt = new Date(Date.now() + 3600000);

		await PasswordReset.create({
			user_id: user.id,
			token,
			expires_at: expiresAt,
		});

		const result = { message: RESET_PASSWORD_MESSAGE };
		if (process.env.NODE_ENV !== 'production') {
			const frontendUrl =
				process.env.FRONTEND_URL || 'http://localhost:5173';
			result.token = token;
			result.reset_url = `${frontendUrl}/forgot-password?token=${token}`;
			result.expires_at = expiresAt;
		}

		return result;
	}

	async resetPassword(token, newPassword) {
		const reset = await PasswordReset.findOne({
			where: { token, used: false },
		});
		if (!reset) throw new Error('Token inválido');
		if (new Date() > new Date(reset.expires_at))
			throw new Error('Token expirado');

		const password = await bcrypt.hash(newPassword, 10);
		const { sequelize } = require('../models');

		const t = await sequelize.transaction();
		try {
			await User.update(
				{ password },
				{ where: { id: reset.user_id }, transaction: t },
			);
			await reset.update({ used: true }, { transaction: t });
			await t.commit();
		} catch (err) {
			await t.rollback();
			throw err;
		}

		return { message: 'Senha redefinida com sucesso' };
	}
}

module.exports = new AuthService();
