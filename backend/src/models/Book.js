const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	class Book extends Model {
		static associate(models) {
			Book.hasMany(models.Loan, { foreignKey: 'book_id', as: 'loans' });
		}
	}

	Book.init(
		{
			title: { type: DataTypes.STRING, allowNull: false },
			author: { type: DataTypes.STRING, allowNull: false },
			publisher: { type: DataTypes.STRING, allowNull: false },
			year: { type: DataTypes.INTEGER, allowNull: false },
			category: { type: DataTypes.STRING, allowNull: false },
			isbn: { type: DataTypes.STRING, allowNull: false, unique: true },
			total_quantity: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 1,
			},
			available_quantity: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 1,
			},
			cover_image: { type: DataTypes.STRING, allowNull: true },
			status: {
				type: DataTypes.ENUM('available', 'unavailable'),
				allowNull: false,
				defaultValue: 'available',
			},
		},
		{
			sequelize,
			modelName: 'Book',
			tableName: 'books',
			underscored: true,
		},
	);

	return Book;
};
