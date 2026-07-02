'use strict';
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('users', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			name: { type: Sequelize.STRING, allowNull: false },
			email: { type: Sequelize.STRING, allowNull: false, unique: true },
			password: { type: Sequelize.STRING, allowNull: false },
			role: {
				type: Sequelize.ENUM('admin', 'librarian', 'reader'),
				allowNull: false,
				defaultValue: 'reader',
			},
			cpf: { type: Sequelize.STRING, allowNull: true, unique: true },
			phone: { type: Sequelize.STRING, allowNull: true },
			address: { type: Sequelize.TEXT, allowNull: true },
			status: {
				type: Sequelize.ENUM('active', 'inactive'),
				allowNull: false,
				defaultValue: 'active',
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

		await queryInterface.createTable('books', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			title: { type: Sequelize.STRING, allowNull: false },
			author: { type: Sequelize.STRING, allowNull: false },
			publisher: { type: Sequelize.STRING, allowNull: false },
			year: { type: Sequelize.INTEGER, allowNull: false },
			category: { type: Sequelize.STRING, allowNull: false },
			isbn: { type: Sequelize.STRING, allowNull: false, unique: true },
			total_quantity: {
				type: Sequelize.INTEGER,
				allowNull: false,
				defaultValue: 1,
			},
			available_quantity: {
				type: Sequelize.INTEGER,
				allowNull: false,
				defaultValue: 1,
			},
			cover_image: { type: Sequelize.STRING, allowNull: true },
			status: {
				type: Sequelize.ENUM('available', 'unavailable'),
				allowNull: false,
				defaultValue: 'available',
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

		await queryInterface.createTable('loans', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			user_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: { model: 'users', key: 'id' },
				onUpdate: 'CASCADE',
				onDelete: 'RESTRICT',
			},
			book_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: { model: 'books', key: 'id' },
				onUpdate: 'CASCADE',
				onDelete: 'RESTRICT',
			},
			loan_date: { type: Sequelize.DATEONLY, allowNull: false },
			due_date: { type: Sequelize.DATEONLY, allowNull: false },
			return_date: { type: Sequelize.DATEONLY, allowNull: true },
			status: {
				type: Sequelize.ENUM('open', 'returned', 'late'),
				allowNull: false,
				defaultValue: 'open',
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

		await queryInterface.createTable('notifications', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			user_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: { model: 'users', key: 'id' },
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
			message: { type: Sequelize.TEXT, allowNull: false },
			type: {
				type: Sequelize.ENUM('overdue', 'return', 'loan', 'system'),
				allowNull: false,
				defaultValue: 'system',
			},
			read: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
			loan_id: {
				type: Sequelize.INTEGER,
				allowNull: true,
				references: { model: 'loans', key: 'id' },
				onUpdate: 'CASCADE',
				onDelete: 'SET NULL',
			},
			created_at: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
			},
		});

		await queryInterface.createTable('password_resets', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			user_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: { model: 'users', key: 'id' },
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
			token: { type: Sequelize.STRING, allowNull: false },
			expires_at: { type: Sequelize.DATE, allowNull: false },
			used: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
			created_at: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
			},
		});

		await queryInterface.addIndex('loans', ['user_id'], {
			name: 'idx_loans_user_id',
		});
		await queryInterface.addIndex('loans', ['book_id'], {
			name: 'idx_loans_book_id',
		});
		await queryInterface.addIndex('loans', ['status'], {
			name: 'idx_loans_status',
		});

		await queryInterface.addIndex('notifications', ['user_id'], {
			name: 'idx_notifications_user_id',
		});
		await queryInterface.addIndex('notifications', ['loan_id'], {
			name: 'idx_notifications_loan_id',
		});

		await queryInterface.addIndex('password_resets', ['user_id'], {
			name: 'idx_password_resets_user_id',
		});
		await queryInterface.addIndex('password_resets', ['token'], {
			name: 'idx_password_resets_token',
		});

		await queryInterface.addIndex('books', ['category'], {
			name: 'idx_books_category',
		});
		await queryInterface.addIndex('books', ['status'], {
			name: 'idx_books_status',
		});

		await queryInterface.sequelize.query(
			'ALTER TABLE books ADD CONSTRAINT books_available_lte_total CHECK (available_quantity <= total_quantity)',
		);
		await queryInterface.sequelize.query(
			'ALTER TABLE books ADD CONSTRAINT books_total_quantity_gt_zero CHECK (total_quantity > 0)',
		);
		await queryInterface.sequelize.query(
			'ALTER TABLE loans ADD CONSTRAINT loans_due_date_gte_loan_date CHECK (due_date >= loan_date)',
		);
	},

	down: async (queryInterface) => {
		await queryInterface.removeIndex('loans', 'idx_loans_user_id');
		await queryInterface.removeIndex('loans', 'idx_loans_book_id');
		await queryInterface.removeIndex('loans', 'idx_loans_status');

		await queryInterface.removeIndex(
			'notifications',
			'idx_notifications_user_id',
		);
		await queryInterface.removeIndex(
			'notifications',
			'idx_notifications_loan_id',
		);

		await queryInterface.removeIndex(
			'password_resets',
			'idx_password_resets_user_id',
		);
		await queryInterface.removeIndex(
			'password_resets',
			'idx_password_resets_token',
		);

		await queryInterface.removeIndex('books', 'idx_books_category');
		await queryInterface.removeIndex('books', 'idx_books_status');

		await queryInterface.sequelize.query(
			'ALTER TABLE loans DROP CONSTRAINT IF EXISTS loans_due_date_gte_loan_date',
		);
		await queryInterface.sequelize.query(
			'ALTER TABLE books DROP CONSTRAINT IF EXISTS books_total_quantity_gt_zero',
		);
		await queryInterface.sequelize.query(
			'ALTER TABLE books DROP CONSTRAINT IF EXISTS books_available_lte_total',
		);

		await queryInterface.dropTable('password_resets');
		await queryInterface.dropTable('notifications');
		await queryInterface.dropTable('loans');
		await queryInterface.dropTable('books');
		await queryInterface.dropTable('users');
	},
};
