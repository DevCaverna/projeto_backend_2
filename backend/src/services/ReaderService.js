const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { User, Loan } = require('../models');

class ReaderService {
	async findAll(query) {
		const { page = 1, limit = 10, name, cpf } = query;
		const where = { role: 'reader' };

		if (name) where.name = { [Op.iLike]: `%${name}%` };
		if (cpf) where.cpf = { [Op.iLike]: `%${cpf}%` };

		const offset = (page - 1) * limit;
		const { count, rows } = await User.findAndCountAll({
			where,
			limit: parseInt(limit),
			offset: parseInt(offset),
			order: [['name', 'ASC']],
		});

		return {
			readers: rows,
			total: count,
			page: parseInt(page),
			totalPages: Math.ceil(count / limit),
		};
	}

	async findById(id) {
		const reader = await User.findOne({ where: { id, role: 'reader' } });
		if (!reader) throw new Error('Leitor não encontrado');

		const loans = await Loan.findAll({
			where: { user_id: id },
			include: [
				{
					association: 'book',
					attributes: ['id', 'title', 'author', 'isbn'],
				},
			],
			order: [['loan_date', 'DESC']],
		});

		return { ...reader.toJSON(), loans };
	}

	async create(data) {
		const exists = await User.findOne({ where: { email: data.email } });
		if (exists) throw new Error('E-mail já cadastrado');

		const password = await bcrypt.hash(
			data.password || crypto.randomBytes(6).toString('hex'),
			10,
		);
		const reader = await User.create({ ...data, password, role: 'reader' });
		return {
			id: reader.id,
			name: reader.name,
			email: reader.email,
			role: reader.role,
		};
	}

	async update(id, data) {
		const reader = await User.findOne({ where: { id, role: 'reader' } });
		if (!reader) throw new Error('Leitor não encontrado');

		if (data.email && data.email !== reader.email) {
			const dup = await User.findOne({ where: { email: data.email } });
			if (dup) throw new Error('E-mail já cadastrado');
		}

		if (data.password) {
			data.password = await bcrypt.hash(data.password, 10);
		}

		await reader.update(data);
		return reader;
	}

	async inactivate(id) {
		const reader = await User.findOne({ where: { id, role: 'reader' } });
		if (!reader) throw new Error('Leitor não encontrado');

		const activeLoans = await Loan.count({
			where: { user_id: id, status: 'open' },
		});
		if (activeLoans > 0)
			throw new Error('Leitor possui empréstimos ativos');

		await reader.update({ status: 'inactive' });
		return reader;
	}
}

module.exports = new ReaderService();
