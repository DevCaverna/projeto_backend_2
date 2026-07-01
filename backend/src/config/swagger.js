const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Biblioteca API',
			description: 'API REST para Sistema de Gerenciamento de Biblioteca',
			version: '1.0.0',
		},
		servers: [{ url: 'http://localhost:3000', description: 'Local' }],
		paths: {
			'/auth/register': {
				post: {
					tags: ['Auth'],
					summary: 'Cadastra usuário',
					security: [{ bearerAuth: [] }],
					requestBody: {
						required: true,
						content: {
							'application/json': {
								schema: {
									$ref: '#/components/schemas/UserInput',
								},
							},
						},
					},
					responses: {
						201: { description: 'Usuário cadastrado' },
						400: { description: 'Dados inválidos' },
						403: { description: 'Acesso negado' },
					},
				},
			},
			'/auth/login': {
				post: {
					tags: ['Auth'],
					summary: 'Autentica usuário',
					requestBody: {
						required: true,
						content: {
							'application/json': {
								schema: {
									type: 'object',
									required: ['email', 'password'],
									properties: {
										email: {
											type: 'string',
											format: 'email',
										},
										password: { type: 'string' },
									},
								},
							},
						},
					},
					responses: {
						200: { description: 'Login realizado' },
						401: { description: 'Credenciais inválidas' },
					},
				},
			},
			'/auth/me': {
				get: {
					tags: ['Auth'],
					summary: 'Retorna usuário autenticado',
					security: [{ bearerAuth: [] }],
					responses: {
						200: {
							description: 'Usuário autenticado',
							content: {
								'application/json': {
									schema: {
										$ref: '#/components/schemas/User',
									},
								},
							},
						},
						401: { description: 'Token inválido ou ausente' },
					},
				},
			},
			'/users': {
				get: {
					tags: ['Usuários'],
					summary: 'Lista usuários',
					security: [{ bearerAuth: [] }],
					responses: { 200: { description: 'Lista de usuários' } },
				},
				post: {
					tags: ['Usuários'],
					summary: 'Cria usuário',
					security: [{ bearerAuth: [] }],
					requestBody: {
						required: true,
						content: {
							'application/json': {
								schema: {
									$ref: '#/components/schemas/UserInput',
								},
							},
						},
					},
					responses: {
						201: { description: 'Usuário criado' },
						400: { description: 'Dados inválidos' },
					},
				},
			},
			'/users/{id}': {
				put: {
					tags: ['Usuários'],
					summary: 'Atualiza usuário',
					security: [{ bearerAuth: [] }],
					parameters: [{ $ref: '#/components/parameters/Id' }],
					responses: {
						200: { description: 'Usuário atualizado' },
						404: { description: 'Usuário não encontrado' },
					},
				},
				delete: {
					tags: ['Usuários'],
					summary: 'Remove usuário',
					security: [{ bearerAuth: [] }],
					parameters: [{ $ref: '#/components/parameters/Id' }],
					responses: {
						200: { description: 'Usuário removido' },
						400: { description: 'Operação não permitida' },
						404: { description: 'Usuário não encontrado' },
					},
				},
			},
			'/books': {
				get: {
					tags: ['Livros'],
					summary: 'Lista livros com filtros',
					parameters: [
						{
							name: 'title',
							in: 'query',
							schema: { type: 'string' },
						},
						{
							name: 'author',
							in: 'query',
							schema: { type: 'string' },
						},
						{
							name: 'category',
							in: 'query',
							schema: { type: 'string' },
						},
						{
							name: 'isbn',
							in: 'query',
							schema: { type: 'string' },
						},
						{
							name: 'available',
							in: 'query',
							schema: { type: 'boolean' },
						},
					],
					responses: { 200: { description: 'Lista de livros' } },
				},
				post: {
					tags: ['Livros'],
					summary: 'Cria livro',
					security: [{ bearerAuth: [] }],
					requestBody: {
						required: true,
						content: {
							'application/json': {
								schema: {
									$ref: '#/components/schemas/BookInput',
								},
							},
						},
					},
					responses: {
						201: { description: 'Livro criado' },
						400: { description: 'Dados inválidos' },
					},
				},
			},
			'/books/{id}': {
				get: {
					tags: ['Livros'],
					summary: 'Busca livro por ID',
					parameters: [{ $ref: '#/components/parameters/Id' }],
					responses: {
						200: { description: 'Livro encontrado' },
						404: { description: 'Livro não encontrado' },
					},
				},
				put: {
					tags: ['Livros'],
					summary: 'Atualiza livro',
					security: [{ bearerAuth: [] }],
					parameters: [{ $ref: '#/components/parameters/Id' }],
					requestBody: {
						required: true,
						content: {
							'application/json': {
								schema: {
									$ref: '#/components/schemas/BookInput',
								},
							},
						},
					},
					responses: {
						200: { description: 'Livro atualizado' },
						404: { description: 'Livro não encontrado' },
					},
				},
				delete: {
					tags: ['Livros'],
					summary: 'Remove livro',
					security: [{ bearerAuth: [] }],
					parameters: [{ $ref: '#/components/parameters/Id' }],
					responses: {
						200: { description: 'Livro removido' },
						400: { description: 'Livro possui empréstimos ativos' },
					},
				},
			},
			'/readers': {
				get: {
					tags: ['Leitores'],
					summary: 'Lista leitores com filtros',
					security: [{ bearerAuth: [] }],
					parameters: [
						{
							name: 'name',
							in: 'query',
							schema: { type: 'string' },
						},
						{
							name: 'cpf',
							in: 'query',
							schema: { type: 'string' },
						},
					],
					responses: { 200: { description: 'Lista de leitores' } },
				},
				post: {
					tags: ['Leitores'],
					summary: 'Cria leitor',
					security: [{ bearerAuth: [] }],
					requestBody: {
						required: true,
						content: {
							'application/json': {
								schema: {
									$ref: '#/components/schemas/ReaderInput',
								},
							},
						},
					},
					responses: { 201: { description: 'Leitor criado' } },
				},
			},
			'/readers/{id}': {
				get: {
					tags: ['Leitores'],
					summary: 'Busca leitor por ID',
					security: [{ bearerAuth: [] }],
					parameters: [{ $ref: '#/components/parameters/Id' }],
					responses: {
						200: { description: 'Leitor encontrado' },
						404: { description: 'Leitor não encontrado' },
					},
				},
				put: {
					tags: ['Leitores'],
					summary: 'Atualiza leitor',
					security: [{ bearerAuth: [] }],
					parameters: [{ $ref: '#/components/parameters/Id' }],
					requestBody: {
						required: true,
						content: {
							'application/json': {
								schema: {
									$ref: '#/components/schemas/ReaderInput',
								},
							},
						},
					},
					responses: { 200: { description: 'Leitor atualizado' } },
				},
				delete: {
					tags: ['Leitores'],
					summary: 'Inativa leitor',
					security: [{ bearerAuth: [] }],
					parameters: [{ $ref: '#/components/parameters/Id' }],
					responses: {
						200: { description: 'Leitor inativado' },
						400: {
							description: 'Leitor possui empréstimos ativos',
						},
					},
				},
			},
			'/loans': {
				get: {
					tags: ['Empréstimos'],
					summary: 'Lista empréstimos com filtros',
					security: [{ bearerAuth: [] }],
					parameters: [
						{
							name: 'status',
							in: 'query',
							schema: { type: 'string' },
						},
						{
							name: 'start_date',
							in: 'query',
							schema: { type: 'string', format: 'date' },
						},
						{
							name: 'end_date',
							in: 'query',
							schema: { type: 'string', format: 'date' },
						},
						{
							name: 'user_id',
							in: 'query',
							schema: { type: 'integer' },
						},
					],
					responses: { 200: { description: 'Lista de empréstimos' } },
				},
				post: {
					tags: ['Empréstimos'],
					summary: 'Registra empréstimo',
					security: [{ bearerAuth: [] }],
					requestBody: {
						required: true,
						content: {
							'application/json': {
								schema: {
									$ref: '#/components/schemas/LoanInput',
								},
							},
						},
					},
					responses: {
						201: { description: 'Empréstimo criado' },
						400: { description: 'Regra de negócio violada' },
					},
				},
			},
			'/loans/{id}': {
				get: {
					tags: ['Empréstimos'],
					summary: 'Busca empréstimo por ID',
					security: [{ bearerAuth: [] }],
					parameters: [{ $ref: '#/components/parameters/Id' }],
					responses: {
						200: { description: 'Empréstimo encontrado' },
						404: { description: 'Empréstimo não encontrado' },
					},
				},
			},
			'/loans/{id}/return': {
				put: {
					tags: ['Empréstimos'],
					summary: 'Registra devolução',
					security: [{ bearerAuth: [] }],
					parameters: [{ $ref: '#/components/parameters/Id' }],
					responses: {
						200: { description: 'Devolução registrada' },
						400: { description: 'Empréstimo já devolvido' },
						404: { description: 'Empréstimo não encontrado' },
					},
				},
			},
			'/loans/my-loans': {
				get: {
					tags: ['Empréstimos'],
					summary: 'Lista empréstimos do leitor autenticado',
					security: [{ bearerAuth: [] }],
					responses: { 200: { description: 'Meus empréstimos' } },
				},
			},
			'/loans/overdue': {
				get: {
					tags: ['Empréstimos'],
					summary: 'Lista empréstimos atrasados',
					security: [{ bearerAuth: [] }],
					responses: {
						200: { description: 'Empréstimos atrasados' },
					},
				},
			},
		},
		components: {
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
				},
			},
			parameters: {
				Id: {
					name: 'id',
					in: 'path',
					required: true,
					schema: { type: 'integer' },
				},
			},
			schemas: {
				UserInput: {
					type: 'object',
					required: ['name', 'email', 'password', 'role'],
					properties: {
						name: { type: 'string' },
						email: { type: 'string', format: 'email' },
						password: { type: 'string', minLength: 6 },
						role: {
							type: 'string',
							enum: ['admin', 'librarian', 'reader'],
						},
						cpf: { type: 'string' },
						phone: { type: 'string' },
						address: { type: 'string' },
					},
				},
				User: {
					type: 'object',
					properties: {
						id: { type: 'integer' },
						name: { type: 'string' },
						email: { type: 'string' },
						role: {
							type: 'string',
							enum: ['admin', 'librarian', 'reader'],
						},
						status: {
							type: 'string',
							enum: ['active', 'inactive'],
						},
					},
				},
				BookInput: {
					type: 'object',
					required: [
						'title',
						'author',
						'publisher',
						'year',
						'category',
						'isbn',
						'total_quantity',
					],
					properties: {
						title: { type: 'string' },
						author: { type: 'string' },
						publisher: { type: 'string' },
						year: { type: 'integer' },
						category: { type: 'string' },
						isbn: { type: 'string' },
						total_quantity: { type: 'integer' },
						available_quantity: { type: 'integer' },
						status: {
							type: 'string',
							enum: ['available', 'unavailable'],
						},
					},
				},
				Book: {
					type: 'object',
					properties: {
						id: { type: 'integer' },
						title: { type: 'string' },
						author: { type: 'string' },
						publisher: { type: 'string' },
						year: { type: 'integer' },
						category: { type: 'string' },
						isbn: { type: 'string' },
						total_quantity: { type: 'integer' },
						available_quantity: { type: 'integer' },
						cover_image: { type: 'string' },
						status: {
							type: 'string',
							enum: ['available', 'unavailable'],
						},
					},
				},
				ReaderInput: {
					type: 'object',
					required: ['name', 'email'],
					properties: {
						name: { type: 'string' },
						email: { type: 'string', format: 'email' },
						password: { type: 'string', minLength: 6 },
						cpf: { type: 'string' },
						phone: { type: 'string' },
						address: { type: 'string' },
						status: {
							type: 'string',
							enum: ['active', 'inactive'],
						},
					},
				},
				LoanInput: {
					type: 'object',
					required: ['user_id', 'loan_date', 'due_date'],
					properties: {
						user_id: { type: 'integer' },
						book_id: { type: 'integer' },
						quantity: { type: 'integer', default: 1 },
						books: {
							type: 'array',
							items: {
								type: 'object',
								required: ['book_id'],
								properties: {
									book_id: { type: 'integer' },
									quantity: { type: 'integer', default: 1 },
								},
							},
						},
						loan_date: { type: 'string', format: 'date' },
						due_date: { type: 'string', format: 'date' },
					},
				},
				Loan: {
					type: 'object',
					properties: {
						id: { type: 'integer' },
						user_id: { type: 'integer' },
						book_id: { type: 'integer' },
						loan_date: { type: 'string', format: 'date' },
						due_date: { type: 'string', format: 'date' },
						return_date: { type: 'string', format: 'date' },
						status: {
							type: 'string',
							enum: ['open', 'returned', 'late'],
						},
						items: {
							type: 'array',
							items: {
								type: 'object',
								properties: {
									id: { type: 'integer' },
									book_id: { type: 'integer' },
									quantity: { type: 'integer' },
									book: { $ref: '#/components/schemas/Book' },
								},
							},
						},
					},
				},
				Notification: {
					type: 'object',
					properties: {
						id: { type: 'integer' },
						user_id: { type: 'integer' },
						message: { type: 'string' },
						type: { type: 'string' },
						read: { type: 'boolean' },
						created_at: { type: 'string', format: 'date-time' },
					},
				},
				Error: {
					type: 'object',
					properties: { error: { type: 'string' } },
				},
			},
		},
	},
	apis: ['./src/routes/*.js', './src/controllers/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = (app) => {
	app.use(
		'/api-docs',
		swaggerUi.serve,
		swaggerUi.setup(swaggerSpec, { explorer: true }),
	);
	app.get('/api-docs.json', (req, res) => res.json(swaggerSpec));
};
