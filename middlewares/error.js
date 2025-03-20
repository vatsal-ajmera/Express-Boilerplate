const httpStatus = require('http-status').default;
const config = require('../config/config');
const ApiError = require('../utils/ApiError');
const { returnError, consoleError } = require('../helpers/requestHandler');

// Convert any thrown error into an ApiError if it's not already
const errorConverter = (err, req, res, next) => {
    let error = err;
    
    if (!(error instanceof ApiError)) {
        const statusCode = err.statusCode && Number.isInteger(err.statusCode) ? err.statusCode : httpStatus.INTERNAL_SERVER_ERROR;
        const message = err.message || 'Something went wrong';
        error = new ApiError(statusCode, message, [], false, err.stack);
    }

    next(error);
};

// Handle 404 Not Found
const errorNotFound = (req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, "Page Not Found"));
};

// Centralized error handler
const errorHandler = (err, req, res, next) => {
    // Ensure the status code is a valid HTTP status
    const statusCode = err.statusCode && Number.isInteger(err.statusCode) ? err.statusCode : httpStatus.INTERNAL_SERVER_ERROR;
    const message = err.message || 'Something went wrong';
    const response = returnError(statusCode, message);
    res.status(statusCode).json(response.response);
};

module.exports = {
    errorConverter,
    errorNotFound,
    errorHandler,
};
