'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
	up: async (queryInterface) => {
		const hash = await bcrypt.hash('123456', 10);

		await queryInterface.bulkInsert('users', [
			{
				name: 'Admin',
				email: 'admin@biblioteca.com',
				password: hash,
				role: 'admin',
				cpf: '00000000001',
				status: 'active',
			},
			{
				name: 'Bibliotecário',
				email: 'biblio@biblioteca.com',
				password: hash,
				role: 'librarian',
				cpf: '00000000002',
				status: 'active',
			},
			{
				name: 'João Leitor',
				email: 'joao@email.com',
				password: hash,
				role: 'reader',
				cpf: '00000000003',
				status: 'active',
				phone: '41999990001',
				address: 'Rua das Flores, 123',
			},
			{
				name: 'Maria Leitora',
				email: 'maria@email.com',
				password: hash,
				role: 'reader',
				cpf: '00000000004',
				status: 'active',
				phone: '41999990002',
				address: 'Av. Principal, 456',
			},
		]);

		await queryInterface.bulkInsert('books', [
			{
				title: 'Dom Casmurro',
				author: 'Machado de Assis',
				publisher: 'Editora A',
				year: 1899,
				category: 'Literatura',
				isbn: '978-85-01-00001-1',
				total_quantity: 5,
				available_quantity: 5,
				status: 'available',
				cover_image: 'has',
			},
			{
				title: '1984',
				author: 'George Orwell',
				publisher: 'Editora B',
				year: 1949,
				category: 'Ficção',
				isbn: '978-85-01-00002-8',
				total_quantity: 3,
				available_quantity: 3,
				status: 'available',
				cover_image: 'has',
			},
			{
				title: 'O Pequeno Príncipe',
				author: 'Antoine de Saint-Exupéry',
				publisher: 'Editora C',
				year: 1943,
				category: 'Infantil',
				isbn: '978-85-01-00003-5',
				total_quantity: 10,
				available_quantity: 10,
				status: 'available',
				cover_image: 'has',
			},
			{
				title: 'A Revolução dos Bichos',
				author: 'George Orwell',
				publisher: 'Editora B',
				year: 1945,
				category: 'Ficção',
				isbn: '978-85-01-00004-2',
				total_quantity: 4,
				available_quantity: 4,
				status: 'available',
				cover_image: 'has',
			},
			{
				title: 'Grande Sertão: Veredas',
				author: 'Guimarães Rosa',
				publisher: 'Editora D',
				year: 1956,
				category: 'Literatura',
				isbn: '978-85-01-00005-9',
				total_quantity: 2,
				available_quantity: 2,
				status: 'available',
			},
		]);

		const users = await queryInterface.sequelize.query(
			`SELECT id, email FROM users WHERE email IN ('joao@email.com', 'maria@email.com')`,
			{ type: queryInterface.sequelize.QueryTypes.SELECT },
		);
		const books = await queryInterface.sequelize.query(
			`SELECT id, title FROM books WHERE title IN ('Dom Casmurro', '1984')`,
			{ type: queryInterface.sequelize.QueryTypes.SELECT },
		);

		const joaoId = users.find((u) => u.email === 'joao@email.com').id;
		const mariaId = users.find((u) => u.email === 'maria@email.com').id;
		const domCasmurroId = books.find((b) => b.title === 'Dom Casmurro').id;
		const orwell1984Id = books.find((b) => b.title === '1984').id;

		await queryInterface.bulkInsert('loans', [
			{
				user_id: joaoId,
				book_id: domCasmurroId,
				loan_date: '2024-10-01',
				due_date: '2024-10-15',
				return_date: '2024-10-14',
				status: 'returned',
			},
			{
				user_id: mariaId,
				book_id: orwell1984Id,
				loan_date: '2024-11-01',
				due_date: '2024-11-15',
				return_date: null,
				status: 'open',
			},
		]);

		const mariaLoan = await queryInterface.sequelize.query(
			`SELECT id FROM loans WHERE user_id = :userId AND book_id = :bookId AND loan_date = '2024-11-01'`,
			{
				replacements: { userId: mariaId, bookId: orwell1984Id },
				type: queryInterface.sequelize.QueryTypes.SELECT,
			},
		);

		await queryInterface.bulkInsert('notifications', [
			{
				user_id: mariaId,
				message:
					'Empréstimo realizado: "1984". Devolução até 2024-11-15.',
				type: 'loan',
				loan_id: mariaLoan[0].id,
				created_at: new Date(),
				read: false,
			},
		]);
	},

	down: async (queryInterface) => {
		await queryInterface.bulkDelete('notifications', null, {});
		await queryInterface.bulkDelete('password_resets', null, {});
		await queryInterface.bulkDelete('loans', null, {});
		await queryInterface.bulkDelete('books', null, {});
		await queryInterface.bulkDelete('users', null, {});
	},
};
