// Middleware to check if user session is expired or if the user is authenticated
const isAuthenticated = (req, res, next) => {
  if (!req.session || !req.session.user) {
    // Session data not available or invalid
    return res.status(401).json({ success: false, message: 'Your session has expired. Please log in again.' });
  }

  // Session is valid
  next();
};

// Middleware to check if the user is accessing their own account
const isSelf = (req, res, next) => {
  const { id } = req.params;
  const user = req.session.user;

  if (user._id !== id) {
    return res.status(403).json({ success: false, message: 'Forbidden. You can only access your own account.' });
  }

  // User owns account
  next();
};

export { isAuthenticated, isSelf };
