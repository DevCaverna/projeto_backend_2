const { Router } = require('express');
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');
const { User } = require('../models');
const authService = require('../services/AuthService');
const { validate, registerSchema } = require('../validators');

const router = Router();

router.get('/', auth, role('admin'), async (req, res, next) => {
	try {
		const users = await User.findAll({ order: [['name', 'ASC']] });
		res.json(users);
	} catch (err) {
		next(err);
	}
});

router.post(
	'/',
	auth,
	role('admin'),
	validate(registerSchema),
	async (req, res, next) => {
		try {
			const user = await authService.register(req.body);
			res.status(201).json(user);
		} catch (err) {
			if (err.message === 'E-mail já cadastrado')
				return res.status(400).json({ error: err.message });
			next(err);
		}
	},
);

router.put('/:id', auth, role('admin'), async (req, res, next) => {
	try {
		const user = await User.findByPk(req.params.id);
		if (!user)
			return res.status(404).json({ error: 'Usuário não encontrado' });

		const { name, email, role: newRole, status } = req.body;
		const updates = {};
		if (name !== undefined) updates.name = name;
		if (email !== undefined) updates.email = email;
		if (newRole !== undefined) updates.role = newRole;
		if (status !== undefined) updates.status = status;

		if (email && email !== user.email) {
			const dup = await User.findOne({ where: { email } });
			if (dup)
				return res.status(400).json({ error: 'E-mail já cadastrado' });
		}

		await user.update(updates);
		res.json(user);
	} catch (err) {
		next(err);
	}
});

router.delete('/:id', auth, role('admin'), async (req, res, next) => {
	try {
		const user = await User.findByPk(req.params.id);
		if (!user)
			return res.status(404).json({ error: 'Usuário não encontrado' });
		if (user.id === req.userId)
			return res
				.status(400)
				.json({ error: 'Não pode excluir a si mesmo' });
		if (user.role === 'admin')
			return res
				.status(400)
				.json({ error: 'Não pode excluir outro administrador' });
		await user.destroy();
		res.json({ message: 'Usuário removido com sucesso' });
	} catch (err) {
		next(err);
	}
});

module.exports = router;
