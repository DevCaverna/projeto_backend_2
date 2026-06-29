const { Notification } = require('../models');

class NotificationService {
	async findByUser(userId) {
		return Notification.findAll({
			where: { user_id: userId },
			order: [['created_at', 'DESC']],
			limit: 50,
		});
	}

	async markAsRead(id, userId) {
		const notification = await Notification.findOne({
			where: { id, user_id: userId },
		});
		if (!notification) throw new Error('Notificação não encontrada');
		await notification.update({ read: true });
		return notification;
	}

	async countUnread(userId) {
		return Notification.count({ where: { user_id: userId, read: false } });
	}
}

module.exports = new NotificationService();
