import User from "../models/userModel.mjs";
import capitalizeFirstLetter from "../utils/capitalizeName.mjs";
import { hashData, verifyData } from "../utils/hashData.mjs";
import setSessionOnLogin from "../utils/setSession.mjs";
import validateEmail from "../utils/validateEmail.mjs";
import validatePhone from "../utils/validatePhone.mjs";
import { sendOTP } from "./OTPCtrl.mjs";

// Define registerUser async function that takes the users firstname, lastname, email, phone, and password.
// All the above are required. If not provided, registration won't be successful.
// Also sends OTP to the user's email which needs to be verified before a user is verified thus allowed to login and checkout products.

const registerUser = async (req, res, next) => {
	try {
		// Extracting user data from the request body
		const { email, password, firstname, lastname, phone } = req.body;
		// Validation for email format
		if (!validateEmail(email)) {
			return res.status(400).json({
				success: false,
				message: "Invalid email format",
			});
		}

		// Validation for phone format
		if (!validatePhone(phone)) {
			return res.status(400).json({
				success: false,
				message: "Invalid phone number format",
			});
		}

		// Find user using email which must be unique for all users
		const existingEmail = await User.findOne({ email });
		if (existingEmail) {
			return res.status(409).json({
				success: false,
				message: "Email already registered. Proceed to login or choose a different email.",
			});
		}

		// Find user using phone which must be unique for all users
		const existingPhone = await User.findOne({ phone });
		if (existingPhone) {
			return res.status(409).json({
				success: false,
				message: "Phone number already registered. Proceed to login or choose a different phone number.",
			});
		}

		// Capitalize first letter of first and last names
		const capitalizedFirstname = await capitalizeFirstLetter(firstname);
		const capitalizedLastname = await capitalizeFirstLetter(lastname);

		// Hash the password using the provided function
		const hashedPassword = await hashData(password);

		// Create new user
		const newUser = new User({
			firstname: capitalizedFirstname,
			lastname: capitalizedLastname,
			email,
			phone,
			password: hashedPassword,
		});

		// Save the new user to the database
		await newUser.save();

		// Send OTP after successfully registering the user
		await sendOTP({
			email: newUser.email,
			subject: "Verify your Email",
			message: "Please use the following OTP to verify your email:",
		});

		// Return success response with user details and message
		return res.status(201).json({
			success: true,
			message: "User successfully registered, OTP sent for email verification",
			details: {
				id: newUser.id,
				firstname: newUser.firstname,
				lastname: newUser.lastname,
				email: newUser.email,
				verified: newUser.verified,
				role: newUser.role,
			},
		});
	} catch (error) {
		next(error);
	}
};

// Define loginUser async function that takes user's email and password and verifies if both are valid.
// Additionally, checks if the user with the specified email is verified, if not, the user is asked
// to check email for OTP or ask for a new OTP.
// If not, the user is denied logging in.

const loginUser = async (req, res, next) => {
	try {
		// Extract email and password from request body
		const { email, password } = req.body;

		// Find user by email
		const user = await User.findOne({ email });

		// If user is not found, return 401 Unauthorized
		if (!user) {
			return res.status(401).json({ success: false, message: "Invalid email or password!" });
		}

		// If user is not verified, return 401 Unauthorized
		if (user.verified === false) {
			return res.status(401.0).json({
				success: false,
				message: "Email not verified. Check email for OTP or ask for a new one.",
			});
		}

		// If user is inactive(suspended), return 401 Unauthorized
		if (user.active === false) {
			return res.status(401.0).json({
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

// Define logout function
// Destroys users session and clears cookies

const logoutUser = async (req, res, next) => {
	try {
		// Clear session data
		req.session.destroy((err) => {
			if (err) {
				console.error("Error destroying session:", err);
				return res.status(500).json({
					success: false,
					message: "Internal server error. Please try again later.",
				});
			}

			// Clear session cookie
			res.clearCookie("userSession");

			// Successful logout
			return res.status(200).json({ success: true, message: "Logout successful." });
		});
	} catch (error) {
		next(error);
	}
};

export { registerUser, loginUser, logoutUser };
