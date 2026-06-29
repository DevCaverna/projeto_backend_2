const request = require('supertest');
const app = require('../src/app');
const { sequelize, User, Book } = require('../src/models');
const bcrypt = require('bcryptjs');

let adminToken, librarianToken, readerToken;

beforeEach(async () => {
	await sequelize.sync({ force: true });

	const hash = await bcrypt.hash('123456', 10);

	await User.bulkCreate([
		{
			name: 'Admin',
			email: 'admin@biblioteca.com',
			password: hash,
			role: 'admin',
			status: 'active',
		},
		{
			name: 'Bibliotecário',
			email: 'biblio@biblioteca.com',
			password: hash,
			role: 'librarian',
			status: 'active',
		},
		{
			name: 'João Leitor',
			email: 'joao@email.com',
			password: hash,
			role: 'reader',
			status: 'active',
		},
		{
			name: 'Maria Leitora',
			email: 'maria@email.com',
			password: hash,
			role: 'reader',
			status: 'active',
		},
	]);

	await Book.create({
		title: 'Livro Teste',
		author: 'Autor',
		publisher: 'Editora',
		year: 2024,
		category: 'Teste',
		isbn: '978-00-00000-00-0',
		total_quantity: 3,
		available_quantity: 3,
	});

	const adminRes = await request(app)
		.post('/auth/login')
		.send({ email: 'admin@biblioteca.com', password: '123456' });
	adminToken = adminRes.body.token;

	const biblioRes = await request(app)
		.post('/auth/login')
		.send({ email: 'biblio@biblioteca.com', password: '123456' });
	librarianToken = biblioRes.body.token;

	const readerRes = await request(app)
		.post('/auth/login')
		.send({ email: 'joao@email.com', password: '123456' });
	readerToken = readerRes.body.token;
});

afterAll(async () => {
	await sequelize.close();
});

describe('Auth', () => {
	it('should login with valid credentials', async () => {
		const res = await request(app)
			.post('/auth/login')
			.send({ email: 'admin@biblioteca.com', password: '123456' });
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('token');
		expect(res.body).toHaveProperty('user');
	});

	it('should reject invalid credentials', async () => {
		const res = await request(app)
			.post('/auth/login')
			.send({ email: 'admin@biblioteca.com', password: 'wrong' });
		expect(res.status).toBe(401);
		expect(res.body).toHaveProperty('error');
	});

	it('should register a new user (admin only)', async () => {
		const res = await request(app)
			.post('/auth/register')
			.set('Authorization', `Bearer ${adminToken}`)
			.send({
				name: 'Novo',
				email: 'novo@test.com',
				password: '123456',
				role: 'reader',
			});
		expect(res.status).toBe(201);
		expect(res.body).toHaveProperty('id');
	});

	it('should reject registration without admin role', async () => {
		const res = await request(app)
			.post('/auth/register')
			.set('Authorization', `Bearer ${readerToken}`)
			.send({
				name: 'Test',
				email: 'test@test.com',
				password: '123456',
				role: 'reader',
			});
		expect(res.status).toBe(403);
	});
});

describe('Books', () => {
	it('should list books (public)', async () => {
		const res = await request(app).get('/books');
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('books');
	});

	it('should create a book (admin/librarian)', async () => {
		const res = await request(app)
			.post('/books')
			.set('Authorization', `Bearer ${adminToken}`)
			.send({
				title: 'Novo Livro',
				author: 'Autor',
				publisher: 'Editora',
				year: 2024,
				category: 'Teste',
				isbn: '978-00-00000-00-1',
				total_quantity: 3,
			});
		expect(res.status).toBe(201);
		expect(res.body).toHaveProperty('id');
	});

	it('should get a book by id', async () => {
		const createRes = await request(app)
			.post('/books')
			.set('Authorization', `Bearer ${adminToken}`)
			.send({
				title: 'Novo Livro',
				author: 'Autor',
				publisher: 'Editora',
				year: 2024,
				category: 'Teste',
				isbn: '978-00-00000-00-2',
				total_quantity: 3,
			});
		const bookId = createRes.body.id;

		const res = await request(app).get(`/books/${bookId}`);
		expect(res.status).toBe(200);
		expect(res.body.title).toBe('Novo Livro');
	});

	it('should update a book', async () => {
		const createRes = await request(app)
			.post('/books')
			.set('Authorization', `Bearer ${adminToken}`)
			.send({
				title: 'Novo Livro',
				author: 'Autor',
				publisher: 'Editora',
				year: 2024,
				category: 'Teste',
				isbn: '978-00-00000-00-3',
				total_quantity: 3,
			});
		const bookId = createRes.body.id;

		const res = await request(app)
			.put(`/books/${bookId}`)
			.set('Authorization', `Bearer ${adminToken}`)
			.send({
				title: 'Livro Atualizado',
				author: 'Autor',
				publisher: 'Editora',
				year: 2024,
				category: 'Teste',
				isbn: '978-00-00000-00-3',
				total_quantity: 3,
			});
		expect(res.status).toBe(200);
		expect(res.body.title).toBe('Livro Atualizado');
	});

	it('should reject creating book without auth', async () => {
		const res = await request(app).post('/books').send({
			title: 'Test',
			author: 'A',
			publisher: 'P',
			year: 2024,
			category: 'C',
			isbn: '978-00-00000-00-4',
			total_quantity: 1,
		});
		expect(res.status).toBe(401);
	});
});

describe('Readers', () => {
	it('should list readers', async () => {
		const res = await request(app)
			.get('/readers')
			.set('Authorization', `Bearer ${adminToken}`);
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('readers');
	});

	it('should create a reader', async () => {
		const res = await request(app)
			.post('/readers')
			.set('Authorization', `Bearer ${adminToken}`)
			.send({
				name: 'Leitor Teste',
				email: 'leitor@teste.com',
				cpf: '111.222.333-44',
			});
		expect(res.status).toBe(201);
		expect(res.body).toHaveProperty('id');
	});

	it('should inactivate a reader', async () => {
		const createRes = await request(app)
			.post('/readers')
			.set('Authorization', `Bearer ${adminToken}`)
			.send({
				name: 'Leitor Teste',
				email: 'leitor@teste.com',
				cpf: '111.222.333-44',
			});
		const readerId = createRes.body.id;

		const res = await request(app)
			.patch(`/readers/${readerId}/inactivate`)
			.set('Authorization', `Bearer ${adminToken}`);
		expect(res.status).toBe(200);
		expect(res.body.status).toBe('inactive');
	});
});

describe('Loans', () => {
	it('should create a loan', async () => {
		const book = await Book.findOne();
		const readersRes = await request(app)
			.get('/readers')
			.set('Authorization', `Bearer ${adminToken}`);
		const reader = readersRes.body.readers[0];

		const res = await request(app)
			.post('/loans')
			.set('Authorization', `Bearer ${adminToken}`)
			.send({
				user_id: reader.id,
				book_id: book.id,
				loan_date: new Date().toISOString().split('T')[0],
				due_date: new Date(Date.now() + 7 * 86400000)
					.toISOString()
					.split('T')[0],
			});
		expect(res.status).toBe(201);
		expect(res.body).toHaveProperty('id');
	});

	it('should return a loan', async () => {
		const book = await Book.findOne();
		const readersRes = await request(app)
			.get('/readers')
			.set('Authorization', `Bearer ${adminToken}`);
		const reader = readersRes.body.readers[0];

		const createRes = await request(app)
			.post('/loans')
			.set('Authorization', `Bearer ${adminToken}`)
			.send({
				user_id: reader.id,
				book_id: book.id,
				loan_date: new Date().toISOString().split('T')[0],
				due_date: new Date(Date.now() + 7 * 86400000)
					.toISOString()
					.split('T')[0],
			});
		const loanId = createRes.body.id;

		const res = await request(app)
			.put(`/loans/${loanId}/return`)
			.set('Authorization', `Bearer ${adminToken}`);
		expect(res.status).toBe(200);
		expect(res.body.status).toBe('returned');
	});

	it('should list loans', async () => {
		const res = await request(app)
			.get('/loans')
			.set('Authorization', `Bearer ${adminToken}`);
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('loans');
	});
});

describe('Authorization', () => {
	it('should block reader from admin routes', async () => {
		const res = await request(app)
			.get('/users')
			.set('Authorization', `Bearer ${readerToken}`);
		expect(res.status).toBe(403);
	});

	it('should block librarian from admin-only routes', async () => {
		const res = await request(app)
			.get('/users')
			.set('Authorization', `Bearer ${librarianToken}`);
		expect(res.status).toBe(403);
	});
});
