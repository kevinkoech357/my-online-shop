import logger from '../utils/logger.mjs';

// Global app error handler
const errorHandler = (err, req, res, next) => {
  // Log the error stack trace using Winston
  logger.error(err.stack);

  // Default to 500 Internal Server Error
  let statusCode = 500;
  let message = 'Internal Server Error. Please try again later.';

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error. Please check your input and try again.';
  } else if (err.code === 11000) { // MongoDB duplicate key error code
    statusCode = 409;
    message = 'Conflict Error. Duplicate key found.';
  }

  // Send a JSON response with the error status and message
  res.status(statusCode).json({
    success: false,
    message
  });
};

// Handle routes Not Found
const notFoundHandler = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    error: error.message
  });
};

export { errorHandler, notFoundHandler };
