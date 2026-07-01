const loanService = require('../services/LoanService');

class LoanController {
	async store(req, res, next) {
		try {
			const loanData = { ...req.body };
			if (req.userRole === 'reader') {
				loanData.user_id = req.userId;
			}
			const loan = await loanService.create(loanData);
			res.status(201).json(loan);
		} catch (err) {
			const messages = [
				'Livro não encontrado',
				'Livro indisponível para empréstimo',
				'Usuário não encontrado',
				'Usuário inativo',
				'Apenas leitores podem pegar livros emprestados',
				'Usuário já possui empréstimo ativo deste livro',
				'Informe ao menos um livro para o empréstimo',
				'Quantidade do empréstimo deve ser maior que zero',
			];
			if (messages.includes(err.message))
				return res.status(400).json({ error: err.message });
			next(err);
		}
	}

	async returnBook(req, res, next) {
		try {
			const loan = await loanService.returnBook(req.params.id);
			res.json(loan);
		} catch (err) {
			if (err.message === 'Empréstimo não encontrado')
				return res.status(404).json({ error: err.message });
			if (err.message === 'Empréstimo já devolvido')
				return res.status(400).json({ error: err.message });
			next(err);
		}
	}

	async index(req, res, next) {
		try {
			const result = await loanService.findAll(req.query);
			res.json(result);
		} catch (err) {
			next(err);
		}
	}

	async show(req, res, next) {
		try {
			const loan = await loanService.findById(req.params.id);
			res.json(loan);
		} catch (err) {
			if (err.message === 'Empréstimo não encontrado')
				return res.status(404).json({ error: err.message });
			next(err);
		}
	}

	async overdue(req, res, next) {
		try {
			const loans = await loanService.findOverdue();
			res.json(loans);
		} catch (err) {
			next(err);
		}
	}

	async myLoans(req, res, next) {
		try {
			const loans = await loanService.findByUser(req.userId);
			res.json(loans);
		} catch (err) {
			next(err);
		}
	}
}

module.exports = new LoanController();
