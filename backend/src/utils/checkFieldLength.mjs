// Define a function that checks if names and password are of valid
// Length before registering user

const checkFieldLength = async (req, res) => {
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
};

export default checkFieldLength;
