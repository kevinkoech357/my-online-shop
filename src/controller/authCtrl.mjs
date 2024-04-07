import { hashPassword, verifyPassword } from '../utils.mjs';
import User from '../models/userModel.mjs';

const registerUser = async (req, res) => {
  try {
    const { email, password, firstname, lastname, phone } = req.body;

    // Validation for email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Validation for phone format
    if (!/^\d+$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number format'
      });
    }

    // Check if all required fields are provided and meet length requirements
    const requiredFields = ['email', 'password', 'firstname', 'lastname', 'phone'];
    const minFieldLengths = { firstname: 3, lastname: 3, password: 8 };

    for (const field of requiredFields) {
      if (!req.body[field] || req.body[field].length < minFieldLengths[field]) {
        return res.status(400).json({
          success: false,
          message: `Missing or invalid field: ${field}`
        });
      }
    }

    // Find user using email which must be unique for all users
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered. Proceed to login or choose a different email.'
      });
    }

    // Find user using phone which must be unique for all users
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(409).json({
        success: false,
        message: 'Phone number already registered. Proceed to login or choose a different phone number.'
      });
    }

    // Hash the password using the provided function
    const hashedPassword = await hashPassword(password);

    // Create new user
    const newUser = new User({
      firstname,
      lastname,
      email,
      phone,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: 'User successfully registered',
      details: {
        id: newUser.id,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ success: false, message: 'Internal server error. Please try again later.' });
  }
};

const loginUser = async (req, res) => {
  try {
    // Extract email and password from request body
    const { email, password } = req.body;

    // Check if all required fields are provided and are strings
    const requiredFields = ['email', 'password'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        // Return a 400 Bad Request if any required field is missing
        return res.status(400).json({
          success: false,
          message: `Missing or invalid required field: ${field}`
        });
      }
    }

    // Find user by email
    const user = await User.findOne({ email });

    // If user is not found, return 401 Unauthorized
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password!' });
    }

    // Verify password
    const passwordMatch = await verifyPassword(user.password, password);

    // If password doesn't match, return 401 Unauthorized
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password!' });
    } else {
      // Successful login
      return res.status(200).json({
        success: true,
        message: `Welcome back ${user.firstname} ${user.lastname}`,
        userDetails: {
          id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email
        }
      });
    }
  } catch (error) {
    // Handle any errors
    console.error('Error logging in user:', error);
    return res.status(500).json({ success: false, message: 'Internal server error. Please try again later.' });
  }
};

export { registerUser, loginUser };
