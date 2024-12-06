import User from "../models/userModel.mjs";

// Middleware to check if user session is expired or if the user is authenticated
const isAuthenticated = async (req, res, next) => {
	try {
		// Check if user exists in session
		const sessionUser = req.session.user;

		if (!sessionUser) {
			return res.status(401).json({
				success: false,
				message: "Your session is invalid or has expired. Please log in again.",
			});
		}

		// Verify user exists in database
		const currentUser = await User.findById(sessionUser._id).lean();
		if (!currentUser) {
			// Clear session if user not found
			req.session.destroy();
			return res.status(401).json({
				success: false,
				message: "User not found. Create an account to proceed.",
			});
		}

		// Check if user is active
		if (currentUser.active === false) {
			return res.status(403).json({
				success: false,
				message: "Your account is inactive. Contact support.",
				details: {
					_id: currentUser._id,
					email: currentUser.email,
					active: currentUser.active,
				},
			});
		}

		// Check if user is verified
		if (currentUser.verified === false) {
			return res.status(403).json({
				success: false,
				message: "Your account is not verified. Please verify your email.",
				details: {
					_id: currentUser._id,
					email: currentUser.email,
					verified: currentUser.verified,
				},
			});
		}

		// Attach user to request
		req.user = currentUser;

		// Proceed to next middleware
		next();
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "An error occurred while checking authentication.",
			details: process.env.NODE_ENV === "development" ? error.message : null,
		});
	}
};

export default isAuthenticated;
