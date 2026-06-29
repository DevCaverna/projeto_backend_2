const { Op } = require('sequelize');
const { Book, User, Loan, sequelize } = require('../models');

class DashboardService {
	async stats() {
		const totalBooks = await Book.count();
		const totalReaders = await User.count({ where: { role: 'reader' } });
		const totalLoans = await Loan.count();
		const activeLoans = await Loan.count({
			where: { status: { [Op.in]: ['open', 'late'] } },
		});
		const overdueLoans = await Loan.count({
			where: {
				status: { [Op.in]: ['open', 'late'] },
				due_date: { [Op.lt]: new Date().toISOString().split('T')[0] },
			},
		});

		const mostLoaned = await Loan.findAll({
			attributes: [
				'book_id',
				[sequelize.fn('COUNT', sequelize.col('book_id')), 'loan_count'],
			],
			include: [
				{ association: 'book', attributes: ['id', 'title', 'author'] },
			],
			group: ['book_id', 'book.id'],
			order: [[sequelize.literal('loan_count'), 'DESC']],
			limit: 5,
		});

		return {
			totalBooks,
			totalReaders,
			totalLoans,
			activeLoans,
			overdueLoans,
			mostLoaned,
		};
	}

	async loansByMonth() {
		const loans = await Loan.findAll({
			attributes: [
				[
					sequelize.fn(
						'to_char',
						sequelize.col('loan_date'),
						'YYYY-MM',
					),
					'month',
				],
				[sequelize.fn('COUNT', sequelize.col('id')), 'count'],
			],
			group: [
				sequelize.fn('to_char', sequelize.col('loan_date'), 'YYYY-MM'),
			],
			order: [[sequelize.literal('month'), 'ASC']],
		});
		return loans;
	}

	async booksByCategory() {
		const books = await Book.findAll({
			attributes: [
				'category',
				[sequelize.fn('COUNT', sequelize.col('id')), 'count'],
			],
			group: ['category'],
			order: [[sequelize.literal('count'), 'DESC']],
		});
		return books;
	}
}

module.exports = new DashboardService();
