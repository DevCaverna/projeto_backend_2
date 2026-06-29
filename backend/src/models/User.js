const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	class User extends Model {
		static associate(models) {
			User.hasMany(models.Loan, { foreignKey: 'user_id', as: 'loans' });
			User.hasMany(models.Notification, {
				foreignKey: 'user_id',
				as: 'notifications',
			});
		}
	}

	User.init(
		{
			name: { type: DataTypes.STRING, allowNull: false },
			email: { type: DataTypes.STRING, allowNull: false, unique: true },
			password: { type: DataTypes.STRING, allowNull: false },
			role: {
				type: DataTypes.ENUM('admin', 'librarian', 'reader'),
				allowNull: false,
				defaultValue: 'reader',
			},
			cpf: { type: DataTypes.STRING, allowNull: true, unique: true },
			phone: { type: DataTypes.STRING, allowNull: true },
			address: { type: DataTypes.TEXT, allowNull: true },
			status: {
				type: DataTypes.ENUM('active', 'inactive'),
				allowNull: false,
				defaultValue: 'active',
			},
		},
		{
			sequelize,
			modelName: 'User',
			tableName: 'users',
			underscored: true,
			defaultScope: {
				attributes: { exclude: ['password'] },
			},
			scopes: {
				withPassword: { attributes: {} },
			},
		},
	);

	return User;
};
