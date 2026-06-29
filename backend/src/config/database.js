require('dotenv').config();

const baseConfig = {
	username: process.env.DB_USER || 'postgres',
	password: process.env.DB_PASS || 'postgres',
	database: process.env.DB_NAME || 'biblioteca',
	host: process.env.DB_HOST || 'localhost',
	port: parseInt(process.env.DB_PORT, 10) || 5432,
	dialect: 'postgres',
	define: { timestamps: true, underscored: true },
	logging: process.env.NODE_ENV === 'test' ? false : console.log,
};

module.exports = {
	development: { ...baseConfig },
	test: {
		...baseConfig,
		database: (process.env.DB_NAME || 'biblioteca') + '_test',
	},
	production: { ...baseConfig },
};
