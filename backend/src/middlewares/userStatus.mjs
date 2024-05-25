import User from '../models/userModel.mjs';

// Middleware to check if user session is expired or if the user is authenticated
const isAuthenticated = async (req, res, next) => {
  const user = req.session.user;

  if (!user) {
    // Session data not available or invalid
    return res.status(401).json({ success: false, message: 'Your session is invalid or has expired. Please log in again.' });
  }

  const currentUser = await User.findById(user._id);

  if (!currentUser) {
    // User Not Found
    return res.status(404).json({ success: false, message: 'User Not Found.' });
  }

  req.user = currentUser;

  // Session is valid
  next();
};

export default isAuthenticated;
