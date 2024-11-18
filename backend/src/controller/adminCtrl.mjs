import User from "../models/userModel.mjs";
import { verifyData } from "../utils/hashData.mjs";

// Define adminLogin function that allows only admins
// to login in to admin dashboard

const adminLogin = async (req, res, next) => {
	// Extract email and password from request body
	const { email, password } = req.body;

	try {
		// Find admin user
		const user = await User.findOne({ email });

		// If admin is not found, return 401 Unauthorized
		if (!user) {
			return res.status(401).json({ success: false, message: "Invalid email or password!" });
		}

		// If user is not admin, return 401 Unauthorized
		if (user.role !== "admin") {
			return res.status(401).json({
				success: false,
				message: "Only registered admins can login.",
			});
		}

		// If user is not verified, return 401 Unauthorized
		if (user.verified === false) {
			return res.status(401).json({
				success: false,
				message: "Email not verified. Check email for OTP or ask for a new one.",
			});
		}

		// If user is inactive(suspended), return 401 Unauthorized
		if (user.active === false) {
			return res.status(401).json({
				success: false,
				message: "User account is suspended. Contact Admin to re-activate account.",
			});
		}

		// Verify password
		const passwordMatch = await verifyData(user.password, password);

		// If password doesn't match, return 401 Unauthorized
		if (!passwordMatch) {
			return res.status(401).json({ success: false, message: "Invalid email or password!" });
		}

		// If the user is verified and the password matches, create a session
		await setSessionOnLogin(user, req, res, next);

		// Successful login
		return res.status(200).json({
			success: true,
			message: `Welcome back ${user.firstname} ${user.lastname}`,
			details: user,
		});
	} catch (error) {
		next(error);
	}
};

// Define a adminGetUserDetails function that returns a JSON
// response with the specified user details

const adminGetUserDetails = async (req, res, next) => {
	const { id } = req.params;

	try {
		// Find user based on ID
		const user = await User.findById(id);

		if (!user) {
			// Return 404 response
			return res.status(404).json({ success: false, message: "User not found." });
		}

		// Return success response
		return res.status(200).json({
			success: true,
			message: "User details successfully retrieved.",
			details: user,
		});
	} catch (error) {
		next(error);
	}
};

// Define adminGetAllUsers functions that allows admin to get
// all registered users

const adminGetAllUsers = async (_req, res, next) => {
	try {
		// Retrieve all users
		const allUsers = await User.find();

		if (!allUsers) {
			// Return success with empty array
			return res.status(200).json({ success: true, message: "No users available.", users: [] });
		}
		// Return success response
		return res.status(200).json({
			success: true,
			message: "All users successfully retrieved",
			users: allUsers,
		});
	} catch (error) {
		next(error);
	}
};

// Define adminRecoverAccount function that allows the admin
// accounts to suspend/deactivate user accounts

const adminSuspendAccount = async (req, res, next) => {
	const { id } = req.params;
	try {
		// Find and update user.active field
		const user = await User.findByIdAndUpdate(id, { active: false }, { new: true });

		if (!user) {
			// Return 404 response
			return res.status(404).json({ success: false, message: "User not found." });
		}

		// Return success response
		return res.status(200).json({ success: true, message: "Account successfully suspended." });
	} catch (error) {
		next(error);
	}
};

// Define adminRecoverAccount function that allows the admin
// accounts to restore suspended/deactivated accounts

const adminRecoverAccount = async (req, res, next) => {
	const { id } = req.params;
	try {
		// Find and update user.active field
		const user = await User.findByIdAndUpdate(id, { active: true }, { new: true });

		if (!user) {
			// Return 404 response
			return res.status(404).json({ success: false, message: "User not found." });
		}

		// Return success response
		return res.status(200).json({ success: true, message: "Account successfully recovered." });
	} catch (error) {
		next(error);
	}
};

// Define adminDeleteAccount function that allows the admin
// to delete user accounts

const adminDeleteAccount = async (req, res, next) => {
	const { id } = req.params;

	try {
		// Find and delete user
		const user = await User.findByIdAndDelete(id);

		if (!user) {
			// Return 404 if user is Not found
			return res.status(404).json({ success: false, message: "User not found." });
		}

		// Return success response
		return res.status(200).json({ success: true, message: "Account successfully deleted." });
	} catch (error) {
		next(error);
	}
};

export { adminLogin, adminGetUserDetails, adminGetAllUsers, adminSuspendAccount, adminRecoverAccount, adminDeleteAccount };
