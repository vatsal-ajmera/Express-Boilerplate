const Joi = require("joi");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");

/**
 * Validation middleware
 * @param {Object} schema - Joi validation schema
 * @returns {Function} Middleware function
 */
const validate = (schema) => (req, res, next) => {
  const validSchema = ["params", "query", "body"].reduce((acc, key) => {
    if (schema[key]) {
      acc[key] = schema[key];
    }
    return acc;
  }, {});

  const object = ["params", "query", "body"].reduce((acc, key) => {
    if (req[key]) {
      acc[key] = req[key];
    }
    return acc;
  }, {});

  const { error } = Joi.object(validSchema).validate(object, {
    abortEarly: false,
    allowUnknown: false,
  });

  if (error) {
    const errors = error.details
      .filter((err) => err.type === "any.required")
      .map((err) => ({
        field: err.path.join("."),
        message: `${err.context.label} is required`,
      }));

    if (errors.length === 0) {
      return next();
    }

    return next(new ApiError(httpStatus.BAD_REQUEST, "Validation Error", errors, true));
  }

  next();
};

module.exports = validate;
