const { Op } = require('sequelize');
const { Book, Loan, LoanBook } = require('../models');

class BookService {
	async findAll(query) {
		const {
			page = 1,
			limit = 10,
			title,
			author,
			category,
			isbn,
			status,
			available,
		} = query;
		const where = {};

		if (title) where.title = { [Op.iLike]: `%${title}%` };
		if (author) where.author = { [Op.iLike]: `%${author}%` };
		if (category) where.category = { [Op.iLike]: `%${category}%` };
		if (isbn) where.isbn = { [Op.iLike]: `%${isbn}%` };
		if (status) where.status = status;
		if (available === 'true') where.available_quantity = { [Op.gt]: 0 };

		const offset = (page - 1) * limit;
		const { count, rows } = await Book.findAndCountAll({
			where,
			limit: parseInt(limit),
			offset: parseInt(offset),
			order: [['title', 'ASC']],
		});

		return {
			books: rows,
			total: count,
			page: parseInt(page),
			totalPages: Math.ceil(count / limit),
		};
	}

	async findById(id) {
		const book = await Book.findByPk(id);
		if (!book) throw new Error('Livro não encontrado');
		return book;
	}

	async create(data) {
		const existing = await Book.findOne({ where: { isbn: data.isbn } });
		if (existing) throw new Error('ISBN já cadastrado');

		const bookData = { ...data };
		if (
			bookData.available_quantity === undefined ||
			bookData.available_quantity === null
		) {
			bookData.available_quantity = bookData.total_quantity;
		}
		if (bookData.available_quantity === 0) bookData.status = 'unavailable';

		return Book.create(bookData);
	}

	async update(id, data) {
		const book = await Book.findByPk(id);
		if (!book) throw new Error('Livro não encontrado');

		if (data.isbn && data.isbn !== book.isbn) {
			const dup = await Book.findOne({ where: { isbn: data.isbn } });
			if (dup) throw new Error('ISBN já cadastrado');
		}

		if (
			data.available_quantity !== undefined &&
			data.status === undefined
		) {
			data.status =
				data.available_quantity === 0 ? 'unavailable' : 'available';
		}

		await book.update(data);
		return book;
	}

	async delete(id) {
		const book = await Book.findByPk(id);
		if (!book) throw new Error('Livro não encontrado');

		const activeLoans = await Loan.count({
			where: { book_id: id, status: 'open' },
		});
		const activeLoanItems = await LoanBook.count({
			where: { book_id: id },
			include: [
				{
					association: 'loan',
					where: { status: 'open' },
					attributes: [],
				},
			],
		});
		if (activeLoans > 0 || activeLoanItems > 0)
			throw new Error('Livro possui empréstimos ativos');

		await book.destroy();
		return { message: 'Livro removido com sucesso' };
	}
}

module.exports = new BookService();
