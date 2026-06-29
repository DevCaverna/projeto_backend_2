const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	class Notification extends Model {
		static associate(models) {
			Notification.belongsTo(models.User, {
				foreignKey: 'user_id',
				as: 'user',
			});
			Notification.belongsTo(models.Loan, {
				foreignKey: 'loan_id',
				as: 'loan',
			});
		}
	}

	Notification.init(
		{
			user_id: { type: DataTypes.INTEGER, allowNull: false },
			message: { type: DataTypes.TEXT, allowNull: false },
			type: {
				type: DataTypes.ENUM('overdue', 'return', 'loan', 'system'),
				allowNull: false,
				defaultValue: 'system',
			},
			read: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
			loan_id: { type: DataTypes.INTEGER, allowNull: true },
		},
		{
			sequelize,
			modelName: 'Notification',
			tableName: 'notifications',
			underscored: true,
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: false,
		},
	);

	return Notification;
};
