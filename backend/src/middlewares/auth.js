const jwt = require('jsonwebtoken');
const { User } = require('../models');

module.exports = async (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader)
		return res.status(401).json({ error: 'Token não fornecido' });

	const parts = authHeader.split(' ');
	if (parts.length !== 2 || parts[0] !== 'Bearer') {
		return res.status(401).json({ error: 'Formato de token inválido' });
	}

	try {
		const decoded = jwt.verify(parts[1], process.env.JWT_SECRET);
		const user = await User.findByPk(decoded.id, {
			attributes: ['id', 'name', 'email', 'role', 'status'],
		});
		if (!user)
			return res.status(401).json({ error: 'Usuário não encontrado' });
		if (user.status === 'inactive')
			return res.status(401).json({ error: 'Usuário inativo' });

		req.userId = user.id;
		req.userRole = user.role;
		req.user = user;
		next();
	} catch (err) {
		return res.status(401).json({ error: 'Token inválido' });
	}
};
