'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		const tables = await queryInterface.showAllTables();
		const hasLoanBooks = tables.includes('loan_books');

		if (!hasLoanBooks) {
			await queryInterface.createTable('loan_books', {
				id: {
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER,
				},
				loan_id: {
					type: Sequelize.INTEGER,
					allowNull: false,
					references: { model: 'loans', key: 'id' },
					onUpdate: 'CASCADE',
					onDelete: 'CASCADE',
				},
				book_id: {
					type: Sequelize.INTEGER,
					allowNull: false,
					references: { model: 'books', key: 'id' },
					onUpdate: 'CASCADE',
					onDelete: 'RESTRICT',
				},
				quantity: {
					type: Sequelize.INTEGER,
					allowNull: false,
					defaultValue: 1,
				},
				created_at: {
					allowNull: false,
					type: Sequelize.DATE,
					defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
				},
				updated_at: {
					allowNull: false,
					type: Sequelize.DATE,
					defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
				},
			});

			await queryInterface.addIndex('loan_books', ['loan_id'], {
				name: 'idx_loan_books_loan_id',
			});
			await queryInterface.addIndex('loan_books', ['book_id'], {
				name: 'idx_loan_books_book_id',
			});

			await queryInterface.sequelize.query(
				'ALTER TABLE loan_books ADD CONSTRAINT loan_books_quantity_gt_zero CHECK (quantity > 0)',
			);
		}

		await queryInterface.sequelize.query(`
			INSERT INTO loan_books (loan_id, book_id, quantity, created_at, updated_at)
			SELECT id, book_id, 1, created_at, updated_at
			FROM loans
			WHERE book_id IS NOT NULL
				AND NOT EXISTS (
					SELECT 1
					FROM loan_books
					WHERE loan_books.loan_id = loans.id
						AND loan_books.book_id = loans.book_id
				)
		`);
	},

	down: async (queryInterface) => {
		await queryInterface.removeIndex(
			'loan_books',
			'idx_loan_books_loan_id',
		);
		await queryInterface.removeIndex(
			'loan_books',
			'idx_loan_books_book_id',
		);
		await queryInterface.sequelize.query(
			'ALTER TABLE loan_books DROP CONSTRAINT IF EXISTS loan_books_quantity_gt_zero',
		);
		await queryInterface.dropTable('loan_books');
	},
};
