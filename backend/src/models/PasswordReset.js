const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	class PasswordReset extends Model {
		static associate(models) {
			PasswordReset.belongsTo(models.User, {
				foreignKey: 'user_id',
				as: 'user',
			});
		}
	}

	PasswordReset.init(
		{
			user_id: { type: DataTypes.INTEGER, allowNull: false },
			token: { type: DataTypes.STRING, allowNull: false },
			expires_at: { type: DataTypes.DATE, allowNull: false },
			used: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
		},
		{
			sequelize,
			modelName: 'PasswordReset',
			tableName: 'password_resets',
			underscored: true,
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: false,
		},
	);

	return PasswordReset;
};
