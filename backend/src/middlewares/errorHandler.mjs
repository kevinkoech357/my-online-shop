import logger from "../utils/logger.mjs";

// Global app error handler
const errorHandler = (err, _req, res, _next) => {
	// Log the error stack trace using Winston
	logger.error(err.stack);

	// Default to 500 Internal Server Error
	let statusCode = 500;
	let message = "Internal Server Error. Please try again later.";

	// Handle specific error types
	if (err.name === "ValidationError") {
		statusCode = 400;
		message = "Validation Error. Please check your input and try again.";
	} else if (err.code === 11000) {
		// MongoDB duplicate key error code
		statusCode = 409;
		message = "Conflict Error. Duplicate key found.";
	}

	// Send a JSON response with the error status and message
	res.status(statusCode).json({
		success: false,
		message,
	});
};

// Handle routes Not Found
const notFoundHandler = (req, res, _next) => {
	// Create a new Error instance with a message indicating the requested URL
	const error = new Error(`Not Found - ${req.originalUrl}`);
	// Return a 404
	return res.status(404).json({
		success: false,
		error: error.message,
	});
	// Since the response is sent, there's no need to continue to the next middleware
};

// JSON Error Handler
const JSONErrorHandler = (err, _req, res, next) => {
	// Check if the error is a SyntaxError, has status 400, and if the error occurred in the request body
	if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
		// Return a 400 response
		return res.status(400).json({ success: false, message: "Invalid JSON format." });
	}
	// If the error doesn't match the conditions above, proceed to the next middleware
	next();
};

export { errorHandler, notFoundHandler, JSONErrorHandler };
