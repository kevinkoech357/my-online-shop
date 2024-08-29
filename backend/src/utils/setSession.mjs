import { randomBytesAsync } from "./hashData.mjs";

// Define set session function that creates and saves a user's session during login
const setSessionOnLogin = async (user, req, res) => {
	try {
		// Generate a unique session ID
		const buffer = await randomBytesAsync(16);
		const sessionId = buffer.toString("hex");

		// Set the cookie
		const cookieName = "userSession";
		const cookieValue = sessionId;

		// Set maxAge to 14 days
		const maxAge = 1000 * 60 * 60 * 24 * 14; // 14 days in milliseconds

		// Set session variables
		req.session.user = {
			_id: user._id,
			firstname: user.firstname,
			lastname: user.lastname,
			email: user.email,
			role: user.role,
		};

		// Set the session cookie
		res.cookie(cookieName, cookieValue, { maxAge, signed: true });
	} catch (error) {
		console.error("Error setting session during login:", error);
	}
};

export default setSessionOnLogin;
