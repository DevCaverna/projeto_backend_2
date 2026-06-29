const bookService = require('../services/BookService');
class BookController {
	async index(req, res, next) {
		try {
			const result = await bookService.findAll(req.query);
			res.json(result);
		} catch (err) {
			next(err);
		}
	}

	async show(req, res, next) {
		try {
			const book = await bookService.findById(req.params.id);
			res.json(book);
		} catch (err) {
			if (err.message === 'Livro não encontrado')
				return res.status(404).json({ error: err.message });
			next(err);
		}
	}

	async store(req, res, next) {
		try {
			const book = await bookService.create(req.body);
			res.status(201).json(book);
		} catch (err) {
			if (err.message === 'ISBN já cadastrado')
				return res.status(400).json({ error: err.message });
			next(err);
		}
	}

	async update(req, res, next) {
		try {
			const book = await bookService.update(req.params.id, req.body);
			res.json(book);
		} catch (err) {
			if (err.message === 'Livro não encontrado')
				return res.status(404).json({ error: err.message });
			if (err.message === 'ISBN já cadastrado')
				return res.status(400).json({ error: err.message });
			next(err);
		}
	}

	async destroy(req, res, next) {
		try {
			const result = await bookService.delete(req.params.id);
			res.json(result);
		} catch (err) {
			if (err.message === 'Livro não encontrado')
				return res.status(404).json({ error: err.message });
			if (err.message === 'Livro possui empréstimos ativos')
				return res.status(400).json({ error: err.message });
			next(err);
		}
	}

	async uploadCover(req, res, next) {
		try {
			const book = await bookService.findById(req.params.id);

			if (!req.file)
				return res
					.status(400)
					.json({ error: 'Nenhuma imagem enviada' });

			const coverUrl = `/uploads/${req.file.filename}`;
			await book.update({ cover_image: coverUrl });
			res.json({ cover_image: coverUrl });
		} catch (err) {
			next(err);
		}
	}
}

module.exports = new BookController();
