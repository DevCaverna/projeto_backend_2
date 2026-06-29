const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerSetup = require('./config/swagger');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/auth', require('./routes/auth'));
app.use('/books', require('./routes/books'));
app.use('/readers', require('./routes/readers'));
app.use('/loans', require('./routes/loans'));
app.use('/users', require('./routes/users'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/notifications', require('./routes/notifications'));

swaggerSetup(app);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use(errorHandler);

module.exports = app;
