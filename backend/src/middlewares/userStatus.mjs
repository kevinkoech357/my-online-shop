import User from "../models/userModel.mjs";

// Middleware to check if user session is expired or if the user is authenticated
const isAuthenticated = async (req, res, next) => {
	const user = req.session.user;

	if (!user) {
		// Session data not available or invalid
		return res.status(401).json({
			success: false,
			message: "Your session is invalid or has expired. Please log in again.",
		});
	}

	try {
		const currentUser = await User.findById(user._id);

		if (!currentUser) {
			return res.status(401).json({
				success: false,
				message: "User not found. Please log in again.",
			});
		}

		req.user = currentUser;

		// Session is valid
		next();
	} catch (error) {
		console.error("Error finding user:", error);
		return res.status(500).json({
			success: false,
			message: "Internal server error. Please try again later.",
		});
	}
};

export default isAuthenticated;
