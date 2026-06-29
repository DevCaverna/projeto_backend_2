const readerService = require('../services/ReaderService');

class ReaderController {
	async index(req, res, next) {
		try {
			const result = await readerService.findAll(req.query);
			res.json(result);
		} catch (err) {
			next(err);
		}
	}

	async show(req, res, next) {
		try {
			const reader = await readerService.findById(req.params.id);
			res.json(reader);
		} catch (err) {
			if (err.message === 'Leitor não encontrado')
				return res.status(404).json({ error: err.message });
			next(err);
		}
	}

	async store(req, res, next) {
		try {
			const reader = await readerService.create(req.body);
			res.status(201).json(reader);
		} catch (err) {
			if (err.message === 'E-mail já cadastrado')
				return res.status(400).json({ error: err.message });
			next(err);
		}
	}

	async update(req, res, next) {
		try {
			const reader = await readerService.update(req.params.id, req.body);
			res.json(reader);
		} catch (err) {
			if (err.message === 'Leitor não encontrado')
				return res.status(404).json({ error: err.message });
			if (err.message === 'E-mail já cadastrado')
				return res.status(400).json({ error: err.message });
			next(err);
		}
	}

	async inactivate(req, res, next) {
		try {
			const reader = await readerService.inactivate(req.params.id);
			res.json(reader);
		} catch (err) {
			if (err.message === 'Leitor não encontrado')
				return res.status(404).json({ error: err.message });
			if (err.message === 'Leitor possui empréstimos ativos')
				return res.status(400).json({ error: err.message });
			next(err);
		}
	}
}

module.exports = new ReaderController();
