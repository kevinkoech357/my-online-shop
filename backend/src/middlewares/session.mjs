// Middleware to check if user session is expired
const checkSessionExpiry = (req, res, next) => {
  if (!req.session || !req.session.user) {
    // Session data not available or invalid
    return res.status(401).json({ success: false, message: 'Your session has expired. Please log in again.' });
  }

  // Session is valid
  next();
};

export default checkSessionExpiry;
