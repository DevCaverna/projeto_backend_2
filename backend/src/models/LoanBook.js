const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	class LoanBook extends Model {
		static associate(models) {
			LoanBook.belongsTo(models.Loan, {
				foreignKey: 'loan_id',
				as: 'loan',
			});
			LoanBook.belongsTo(models.Book, {
				foreignKey: 'book_id',
				as: 'book',
			});
		}
	}

	LoanBook.init(
		{
			loan_id: { type: DataTypes.INTEGER, allowNull: false },
			book_id: { type: DataTypes.INTEGER, allowNull: false },
			quantity: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 1,
			},
		},
		{
			sequelize,
			modelName: 'LoanBook',
			tableName: 'loan_books',
			underscored: true,
		},
	);

	return LoanBook;
};
