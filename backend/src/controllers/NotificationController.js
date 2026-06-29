const notificationService = require('../services/NotificationService');

class NotificationController {
	async index(req, res, next) {
		try {
			const notifications = await notificationService.findByUser(
				req.userId,
			);
			res.json(notifications);
		} catch (err) {
			next(err);
		}
	}

	async markAsRead(req, res, next) {
		try {
			const notification = await notificationService.markAsRead(
				req.params.id,
				req.userId,
			);
			res.json(notification);
		} catch (err) {
			if (err.message === 'Notificação não encontrada')
				return res.status(404).json({ error: err.message });
			next(err);
		}
	}

	async countUnread(req, res, next) {
		try {
			const count = await notificationService.countUnread(req.userId);
			res.json({ count });
		} catch (err) {
			next(err);
		}
	}
}

module.exports = new NotificationController();
