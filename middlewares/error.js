const httpStatus = require('http-status').default;
const config = require('../config/config');
const ApiError = require('../utils/ApiError');
const { returnError, consoleError } = require('../helpers/requestHelper');
const logger = require('../utils/logger');

// Convert any thrown error into an ApiError if it's not already
const errorConverter = (err, req, res, next) => {
    let error = err;
    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode && Number.isInteger(error.statusCode) 
            ? error.statusCode 
            : httpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || 'Something went wrong';
        error = new ApiError(statusCode, message, err, false, error.stack);
    }

    next(error);
};

// Handle 404 Not Found
const errorNotFound = (req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, "Page Not Found"));
};

// Centralized error handler
const errorHandler = (err, req, res, next) => {

    //## Log error for debugging
    consoleError(err); 

    const statusCode = err.statusCode && Number.isInteger(err.statusCode) 
        ? err.statusCode 
        : httpStatus.INTERNAL_SERVER_ERROR;

    const message = err.message || 'Something went wrong';
    const errors = err.errors || [];

    logger.error(`Error ${statusCode}: ${req.method} ${req.originalUrl} ${err}`);
    const response = returnError(statusCode, message, errors);
    res.status(statusCode).json(response.response);
};

module.exports = {
    errorConverter,
    errorNotFound,
    errorHandler,
};
