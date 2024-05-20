// Middleware for validating if required body fields are present
const checkRequiredFields = (requiredFields) => (req, res, next) => {
  try {
    // Check if all required fields are present in req.body
    for (const field of requiredFields) {
      if (!req.body[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    // Handle error if any required field is missing
    console.error('Missing required fields:', error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Middleware for validating if firstname, lastname and password are of required length

const checkFieldLength = (req, res, next) => {
  const minFieldLengths = { firstname: 3, lastname: 3, password: 8 };

  // Check if any required field length is less than the minimum length
  for (const field in minFieldLengths) {
    if (req.body[field] && req.body[field].length < minFieldLengths[field]) {
      return res.status(400).json({
        success: false,
        message: `${field} must be at least ${minFieldLengths[field]} characters long.`
      });
    }
  }
  next();
};

export { checkFieldLength, checkRequiredFields };
