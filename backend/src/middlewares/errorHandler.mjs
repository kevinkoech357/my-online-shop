// Global error handler
const errorHandler = (err, req, res, next) => {
  // Log the error stack trace for debugging
  console.error(err.stack);

  // Send a JSON response with the error status and message
  res.status(500).json({
    success: false,
    message: 'Internal Server Error. Please try again later.'
  });
};

export default errorHandler;
