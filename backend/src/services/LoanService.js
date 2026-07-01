const { Op } = require('sequelize');
const {
	Loan,
	LoanBook,
	Book,
	User,
	Notification,
	sequelize,
} = require('../models');

class LoanService {
	normalizeItems(data) {
		const items = data.books || data.items || [];
		const normalized = items.length
			? items
			: [{ book_id: data.book_id, quantity: data.quantity || 1 }];

		if (!normalized.length || !normalized[0].book_id) {
			throw new Error('Informe ao menos um livro para o empréstimo');
		}

		const byBook = new Map();
		for (const item of normalized) {
			const bookId = item.book_id;
			const quantity = Number(item.quantity || 1);
			byBook.set(bookId, (byBook.get(bookId) || 0) + quantity);
		}

		return Array.from(byBook, ([book_id, quantity]) => ({
			book_id,
			quantity,
		}));
	}

	async ensureNoOpenLoan(userId, items) {
		const bookIds = items.map((item) => item.book_id);
		const existingLegacyLoan = await Loan.findOne({
			where: {
				user_id: userId,
				book_id: { [Op.in]: bookIds },
				status: 'open',
			},
		});
		const existingLoanItem = await LoanBook.findOne({
			include: [
				{
					association: 'loan',
					where: { user_id: userId, status: 'open' },
					attributes: [],
				},
			],
			where: { book_id: { [Op.in]: bookIds } },
		});
		if (existingLegacyLoan || existingLoanItem)
			throw new Error('Usuário já possui empréstimo ativo deste livro');
	}

	async create(data) {
		const user = await User.findByPk(data.user_id);
		if (!user) throw new Error('Usuário não encontrado');
		if (user.status === 'inactive') throw new Error('Usuário inativo');
		if (user.role === 'librarian' || user.role === 'admin') {
			throw new Error('Apenas leitores podem pegar livros emprestados');
		}

		const items = this.normalizeItems(data);
		await this.ensureNoOpenLoan(data.user_id, items);

		const loan = await sequelize.transaction(async (t) => {
			const books = [];
			for (const item of items) {
				if (item.quantity <= 0)
					throw new Error(
						'Quantidade do empréstimo deve ser maior que zero',
					);

				const book = await Book.findByPk(item.book_id, {
					transaction: t,
				});
				if (!book) throw new Error('Livro não encontrado');
				if (book.available_quantity < item.quantity)
					throw new Error('Livro indisponível para empréstimo');
				books.push({ book, quantity: item.quantity });
			}

			const newLoan = await Loan.create(
				{
					user_id: data.user_id,
					book_id: books[0].book.id,
					loan_date: data.loan_date,
					due_date: data.due_date,
					status: 'open',
				},
				{ transaction: t },
			);

			for (const item of books) {
				await LoanBook.create(
					{
						loan_id: newLoan.id,
						book_id: item.book.id,
						quantity: item.quantity,
					},
					{ transaction: t },
				);

				await item.book.decrement('available_quantity', {
					by: item.quantity,
					transaction: t,
				});

				const updatedBook = await Book.findByPk(item.book.id, {
					transaction: t,
				});
				if (updatedBook.available_quantity === 0) {
					await updatedBook.update(
						{ status: 'unavailable' },
						{ transaction: t },
					);
				}
			}

			const titles = books.map((item) => item.book.title).join(', ');
			await Notification.create(
				{
					user_id: data.user_id,
					message: `Empréstimo realizado: ${titles}. Devolução até ${new Date(data.due_date + 'T12:00:00').toLocaleDateString('pt-BR')}.`,
					type: 'loan',
					loan_id: newLoan.id,
				},
				{ transaction: t },
			);

			return newLoan;
		});

		return loan;
	}

	async returnBook(id) {
		return sequelize.transaction(async (t) => {
			const loan = await Loan.findByPk(id, {
				include: [
					{ association: 'book' },
					{
						association: 'items',
						include: [{ association: 'book' }],
					},
				],
				transaction: t,
			});
			if (!loan) throw new Error('Empréstimo não encontrado');
			if (loan.status === 'returned')
				throw new Error('Empréstimo já devolvido');

			const returnDate = new Date().toISOString().split('T')[0];

			await loan.update(
				{ return_date: returnDate, status: 'returned' },
				{ transaction: t },
			);

			const items = loan.items.length
				? loan.items
				: [{ book: loan.book, quantity: 1 }];

			for (const item of items) {
				await item.book.increment('available_quantity', {
					by: item.quantity,
					transaction: t,
				});

				const updatedBook = await Book.findByPk(item.book.id, {
					transaction: t,
				});
				if (updatedBook.available_quantity > 0) {
					await updatedBook.update(
						{ status: 'available' },
						{ transaction: t },
					);
				}
			}

			const titles = items.map((item) => item.book.title).join(', ');
			await Notification.create(
				{
					user_id: loan.user_id,
					message: `Devolução registrada: ${titles}.`,
					type: 'return',
					loan_id: loan.id,
				},
				{ transaction: t },
			);

			return loan;
		});
	}

	async findAll(query) {
		const {
			page = 1,
			limit = 10,
			status,
			start_date,
			end_date,
			user_id,
		} = query;
		const where = {};

		if (status) where.status = status;
		if (user_id) where.user_id = user_id;
		if (start_date)
			where.loan_date = { ...where.loan_date, [Op.gte]: start_date };
		if (end_date)
			where.loan_date = { ...where.loan_date, [Op.lte]: end_date };

		const offset = (page - 1) * limit;
		const { count, rows } = await Loan.findAndCountAll({
			where,
			distinct: true,
			include: [
				{ association: 'user', attributes: ['id', 'name', 'email'] },
				{
					association: 'book',
					attributes: ['id', 'title', 'author', 'isbn'],
				},
				{
					association: 'items',
					attributes: ['id', 'book_id', 'quantity'],
					include: [
						{
							association: 'book',
							attributes: ['id', 'title', 'author', 'isbn'],
						},
					],
				},
			],
			limit: parseInt(limit),
			offset: parseInt(offset),
			order: [['loan_date', 'DESC']],
		});

		return {
			loans: rows,
			total: count,
			page: parseInt(page),
			totalPages: Math.ceil(count / limit),
		};
	}

	async findById(id) {
		const loan = await Loan.findByPk(id, {
			include: [
				{ association: 'user', attributes: ['id', 'name', 'email'] },
				{
					association: 'book',
					attributes: ['id', 'title', 'author', 'isbn'],
				},
				{
					association: 'items',
					attributes: ['id', 'book_id', 'quantity'],
					include: [
						{
							association: 'book',
							attributes: ['id', 'title', 'author', 'isbn'],
						},
					],
				},
			],
		});
		if (!loan) throw new Error('Empréstimo não encontrado');
		return loan;
	}

	async findOverdue() {
		const today = new Date().toISOString().split('T')[0];

		await Loan.update(
			{ status: 'late' },
			{
				where: {
					status: 'open',
					due_date: { [Op.lt]: today },
				},
			},
		);

		const overdueLoans = await Loan.findAll({
			where: {
				status: 'late',
				due_date: { [Op.lt]: today },
			},
			include: [
				{ association: 'user', attributes: ['id', 'name', 'email'] },
				{ association: 'book', attributes: ['id', 'title', 'author'] },
				{
					association: 'items',
					attributes: ['id', 'book_id', 'quantity'],
					include: [
						{
							association: 'book',
							attributes: ['id', 'title', 'author'],
						},
					],
				},
			],
			order: [['due_date', 'ASC']],
		});

		return overdueLoans;
	}

	async findByUser(userId, page = 1, limit = 10) {
		const offset = (page - 1) * limit;
		const { count, rows } = await Loan.findAndCountAll({
			where: { user_id: userId },
			distinct: true,
			include: [
				{
					association: 'book',
					attributes: [
						'id',
						'title',
						'author',
						'isbn',
						'cover_image',
					],
				},
				{
					association: 'items',
					attributes: ['id', 'book_id', 'quantity'],
					include: [
						{
							association: 'book',
							attributes: [
								'id',
								'title',
								'author',
								'isbn',
								'cover_image',
							],
						},
					],
				},
			],
			limit: parseInt(limit),
			offset: parseInt(offset),
			order: [['loan_date', 'DESC']],
		});

		return {
			loans: rows,
			total: count,
			page: parseInt(page),
			totalPages: Math.ceil(count / limit),
		};
	}
}

module.exports = new LoanService();
