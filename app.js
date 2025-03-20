const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const routes = require('./routes');
const docs = require('./routes/docsRoutes');
const { errorConverter, errorNotFound, errorHandler } = require('./middlewares/error');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', docs);
app.use('/api/v1', routes);

// Catch 404 and forward to error handler
app.use(errorNotFound);
// Convert and handle errors
app.use(errorConverter);
// return error 
app.use(errorHandler);

module.exports = app;
