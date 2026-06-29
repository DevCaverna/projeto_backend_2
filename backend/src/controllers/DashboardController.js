const dashboardService = require('../services/DashboardService');

class DashboardController {
	async stats(req, res, next) {
		try {
			const data = await dashboardService.stats();
			res.json(data);
		} catch (err) {
			next(err);
		}
	}

	async loansByMonth(req, res, next) {
		try {
			const data = await dashboardService.loansByMonth();
			res.json(data);
		} catch (err) {
			next(err);
		}
	}

	async booksByCategory(req, res, next) {
		try {
			const data = await dashboardService.booksByCategory();
			res.json(data);
		} catch (err) {
			next(err);
		}
	}
}

module.exports = new DashboardController();
