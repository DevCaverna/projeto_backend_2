const Joi = require('joi');

const stripNonDigits = (v) => (v || '').replace(/\D/g, '');

const cpfValidator = (value, helpers) => {
	if (!value) return value;
	const digits = stripNonDigits(value);
	if (digits.length !== 11)
		return helpers.error('any.invalid', {
			message: 'CPF deve ter 11 dígitos',
		});
	return digits;
};

const phoneValidator = (value, helpers) => {
	if (!value) return value;
	const digits = stripNonDigits(value);
	if (digits.length < 10 || digits.length > 11)
		return helpers.error('any.invalid', {
			message: 'Telefone deve ter 10 ou 11 dígitos',
		});
	return digits;
};

const registerSchema = Joi.object({
	name: Joi.string().min(2).max(100).required(),
	email: Joi.string().email().required(),
	password: Joi.string().min(6).required(),
	role: Joi.string().valid('admin', 'librarian', 'reader').required(),
	cpf: Joi.string().allow(null, '').custom(cpfValidator, 'CPF validation'),
	phone: Joi.string()
		.allow(null, '')
		.custom(phoneValidator, 'Phone validation'),
	address: Joi.string().allow(null, ''),
});

const loginSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().required(),
});

const bookSchema = Joi.object({
	title: Joi.string().min(1).max(200).required(),
	author: Joi.string().min(1).max(200).required(),
	publisher: Joi.string().min(1).max(200).required(),
	year: Joi.number().integer().min(1000).max(9999).required(),
	category: Joi.string().min(1).max(100).required(),
	isbn: Joi.string().min(1).max(20).required(),
	total_quantity: Joi.number().integer().min(1).required(),
	available_quantity: Joi.number().integer().min(0).optional(),
	status: Joi.string().valid('available', 'unavailable').optional(),
});

const readerSchema = Joi.object({
	name: Joi.string().min(2).max(100).required(),
	email: Joi.string().email().required(),
	password: Joi.string().min(6).optional(),
	cpf: Joi.string().allow(null, '').custom(cpfValidator, 'CPF validation'),
	phone: Joi.string()
		.allow(null, '')
		.custom(phoneValidator, 'Phone validation'),
	address: Joi.string().allow(null, ''),
	status: Joi.string().valid('active', 'inactive').optional(),
});

const today = () => new Date().toISOString().split('T')[0];

const loanSchema = Joi.object({
	user_id: Joi.number().integer().optional(),
	book_id: Joi.number().integer().optional(),
	quantity: Joi.number().integer().min(1).optional(),
	books: Joi.array()
		.items(
			Joi.object({
				book_id: Joi.number().integer().required(),
				quantity: Joi.number().integer().min(1).default(1),
			}),
		)
		.min(1)
		.optional(),
	loan_date: Joi.date()
		.iso()
		.min(today())
		.required()
		.messages({ 'date.min': 'Data de empréstimo não pode ser no passado' }),
	due_date: Joi.date().iso().min(Joi.ref('loan_date')).required(),
}).or('book_id', 'books');

const forgotPasswordSchema = Joi.object({
	email: Joi.string().email().required(),
});

const resetPasswordSchema = Joi.object({
	token: Joi.string().required(),
	password: Joi.string().min(6).required(),
});

const validate = (schema) => (req, res, next) => {
	const { error } = schema.validate(req.body, { stripUnknown: true });
	if (error) return res.status(400).json({ error: error.details[0].message });
	next();
};

module.exports = {
	registerSchema,
	loginSchema,
	bookSchema,
	readerSchema,
	loanSchema,
	forgotPasswordSchema,
	resetPasswordSchema,
	validate,
};
