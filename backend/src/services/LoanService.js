const { Op } = require('sequelize');
const { Loan, Book, User, Notification, sequelize } = require('../models');

class LoanService {
	async create(data) {
		const user = await User.findByPk(data.user_id);
		if (!user) throw new Error('Usuário não encontrado');
		if (user.status === 'inactive') throw new Error('Usuário inativo');
		if (user.role === 'librarian' || user.role === 'admin') {
			throw new Error('Apenas leitores podem pegar livros emprestados');
		}

		const existing = await Loan.findOne({
			where: {
				user_id: data.user_id,
				book_id: data.book_id,
				status: 'open',
			},
		});
		if (existing)
			throw new Error('Usuário já possui empréstimo ativo deste livro');

		const loan = await sequelize.transaction(async (t) => {
			const book = await Book.findByPk(data.book_id, { transaction: t });
			if (!book) throw new Error('Livro não encontrado');
			if (book.available_quantity <= 0)
				throw new Error('Livro indisponível para empréstimo');

			const newLoan = await Loan.create(
				{
					user_id: data.user_id,
					book_id: data.book_id,
					loan_date: data.loan_date,
					due_date: data.due_date,
					status: 'open',
				},
				{ transaction: t },
			);

			await book.decrement('available_quantity', {
				by: 1,
				transaction: t,
			});

			const updatedBook = await Book.findByPk(data.book_id, {
				transaction: t,
			});
			if (updatedBook.available_quantity === 0) {
				await updatedBook.update(
					{ status: 'unavailable' },
					{ transaction: t },
				);
			}

			await Notification.create(
				{
					user_id: data.user_id,
					message: `Empréstimo realizado: "${book.title}". Devolução até ${new Date(data.due_date + 'T12:00:00').toLocaleDateString('pt-BR')}.`,
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
				include: [{ association: 'book' }],
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

			await loan.book.increment('available_quantity', {
				by: 1,
				transaction: t,
			});

			const updatedBook = await Book.findByPk(loan.book_id, {
				transaction: t,
			});
			if (updatedBook.available_quantity > 0) {
				await updatedBook.update(
					{ status: 'available' },
					{ transaction: t },
				);
			}

			await Notification.create(
				{
					user_id: loan.user_id,
					message: `Devolução registrada: "${loan.book.title}".`,
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
			include: [
				{ association: 'user', attributes: ['id', 'name', 'email'] },
				{
					association: 'book',
					attributes: ['id', 'title', 'author', 'isbn'],
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
			],
			order: [['due_date', 'ASC']],
		});

		return overdueLoans;
	}

	async findByUser(userId, page = 1, limit = 10) {
		const offset = (page - 1) * limit;
		const { count, rows } = await Loan.findAndCountAll({
			where: { user_id: userId },
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
