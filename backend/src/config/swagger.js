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
		components: {
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
				},
			},
			schemas: {
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
