const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const config =
	require('../config/database')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(config);

const models = {};

fs.readdirSync(__dirname)
	.filter((file) => file !== 'index.js' && file.endsWith('.js'))
	.forEach((file) => {
		const model = require(path.join(__dirname, file))(
			sequelize,
			Sequelize.DataTypes,
		);
		models[model.name] = model;
	});

Object.values(models).forEach((model) => {
	if (model.associate) model.associate(models);
});

module.exports = { sequelize, Sequelize, ...models };
