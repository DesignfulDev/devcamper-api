const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  // Log error for dev
  console.log(err.name);
  console.log(err.stack.red);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found with id ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  // Mongo duplicate key
  if (err.code === 11000) {
    const message = `Duplicate value for property '${Object.keys(
      err.keyValue
    )}: ${Object.values(err.keyValue)}'`;
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || `Server error`,
  });
};

module.exports = errorHandler;
