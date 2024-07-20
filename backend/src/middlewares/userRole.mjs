// Middleware to check if the user has an admin role based on sessions
const isAdmin = async (req, res, next) => {
	const user = req.session?.user;

	if (!user || user.role !== "admin") {
		return res.status(403).json({
			success: false,
			message: "Forbidden. Only Admins can perform this action.",
		});
	}

	// User is Admin
	next();
};

export default isAdmin;
