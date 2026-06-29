const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	class Loan extends Model {
		static associate(models) {
			Loan.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
			Loan.belongsTo(models.Book, { foreignKey: 'book_id', as: 'book' });
		}
	}

	Loan.init(
		{
			user_id: { type: DataTypes.INTEGER, allowNull: false },
			book_id: { type: DataTypes.INTEGER, allowNull: false },
			loan_date: { type: DataTypes.DATEONLY, allowNull: false },
			due_date: { type: DataTypes.DATEONLY, allowNull: false },
			return_date: { type: DataTypes.DATEONLY, allowNull: true },
			status: {
				type: DataTypes.ENUM('open', 'returned', 'late'),
				allowNull: false,
				defaultValue: 'open',
			},
		},
		{
			sequelize,
			modelName: 'Loan',
			tableName: 'loans',
			underscored: true,
		},
	);

	return Loan;
};
