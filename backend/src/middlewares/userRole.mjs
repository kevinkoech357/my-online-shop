import User from "../models/userModel.mjs";

// Middleware to check if the user has an admin role based on sessions
const isAdmin = async (req, res, next) => {
	// Optional: Verify user in database for added security
	try {
		const user = req.session?.user;

		if (!user) {
			return res.status(401).json({
				success: false,
				message: "No active session. Please log in.",
			});
		}

		if (user.role !== "admin") {
			return res.status(403).json({
				success: false,
				message: "Forbidden. Only Admins can perform this action.",
			});
		}

		//  Additional database check for role verification
		const dbUser = await User.findById(user._id);
		if (!dbUser || dbUser.role !== "admin") {
			return res.status(403).json({
				success: false,
				message: "Forbidden. Only Admins can perform this action.",
			});
		}

		// User is Admin
		next();
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "An error occurred during authorization.",
			details: process.env.NODE_ENV === "development" ? error.message : null,
		});
	}
};

export default isAdmin;
