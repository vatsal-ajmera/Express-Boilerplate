const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const routes = require('./routes');
const docs = require('./routes/docsRoutes');
const { errorConverter, errorNotFound, errorHandler } = require('./middlewares/error');
const passport = require('passport');
const { jwtStrategy } = require('./config/passport');
const logger = require('./utils/logger')
const app = express();

// jwt authentication
passport.use('jwt', jwtStrategy);
app.use(passport.initialize({}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Middleware to log requests
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.originalUrl} - ${req.ip}`);
    next();
});

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
