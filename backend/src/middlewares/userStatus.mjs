import User from "../models/userModel.mjs";

// Middleware to check if user session is expired or if the user is authenticated
const isAuthenticated = async (req, res, next) => {
	try {
		const user = req.session.user;

		if (!user) {
			// Session data not available or invalid
			return res.status(401).json({
				success: false,
				message: "Your session is invalid or has expired. Please log in again.",
			});
		}

		const currentUser = await User.findById(user._id);

		if (!currentUser) {
			return res.status(401).json({
				success: false,
				message: "User not found. Create an account to proceed.",
			});
		}

		req.user = currentUser;

		// Session is valid
		next();
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "An error occurred while checking authentication.",
			details: error,
		});
	}
};

export default isAuthenticated;
