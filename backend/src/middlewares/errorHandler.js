module.exports = (err, req, res, _next) => {
	console.error(err.stack);
	if (
		err.name === 'SequelizeValidationError' ||
		err.name === 'SequelizeUniqueConstraintError'
	) {
		const messages = err.errors
			? err.errors.map((e) => e.message)
			: [err.message];
		return res.status(400).json({ error: messages.join(', ') });
	}
	if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
		return res.status(401).json({ error: 'Token inválido ou expirado' });
	}
	if (err.code === 'LIMIT_FILE_SIZE') {
		return res.status(400).json({ error: 'Arquivo muito grande' });
	}
	if (err.code === 'INVALID_FILE_TYPE') {
		return res.status(400).json({ error: err.message });
	}
	res.status(500).json({ error: 'Erro interno do servidor' });
};
