import User from "../models/userModel.mjs";
import capitalizeFirstLetter from "../utils/capitalizeName.mjs";
import { hashData, verifyData } from "../utils/hashData.mjs";
import validateEmail from "../utils/validateEmail.mjs";
import validatePhone from "../utils/validatePhone.mjs";
import { sendOTP } from "./OTPCtrl.mjs";

// Define a getUserDetails function that returns a JSON
// response with the specified user details

const getUserDetails = async (req, res, next) => {
	const { _id } = req.user;

	try {
		// Find user based on ID
		const user = await User.findById(_id);

		if (!user) {
			// Return 404
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

// Define updateUserDetails function that allows registered and authenticated
// Users to update their details such as firstname, lastname, phone and/or password

const updateUserDetails = async (req, res, next) => {
	const { _id } = req.user;
	const { firstname, lastname, phone, previousPassword, password } = req.body;

	try {
		// Find user based on id
		const user = await User.findById(_id);

		if (!user) {
			// Return 404
			return res.status(404).json({ success: false, message: "User not found." });
		}

		if (previousPassword) {
			// Check if previous password is correct
			const passwordMatch = await verifyData(user.password, previousPassword);

			if (!passwordMatch) {
				return res.status(401).json({
					success: false,
					message: "Password mismatch. If you've forgotten your previous password, request a request link to your email account.",
				});
			}

			if (password) {
				user.password = await hashData(password);
			}
		}

		if (phone) {
			// Validate phone
			await validatePhone(phone);
			user.phone = phone;
		}

		if (firstname) {
			user.firstname = await capitalizeFirstLetter(firstname);
		}
		if (lastname) {
			user.lastname = await capitalizeFirstLetter(lastname);
		}

		await user.save();

		// Return success response
		return res.status(200).json({
			success: true,
			message: "User details successfully updated.",
			details: user,
		});
	} catch (error) {
		next(error);
	}
};

// Define changeEmail function that allows registered and authenticated
// Users to change their emails if need be

const changeEmail = async (req, res, next) => {
	const { _id } = req.user;
	const { email } = req.body;

	try {
		const user = await User.findById(_id);

		if (!user) {
			// Return 404
			return res.status(404).json({ success: false, message: "User not found." });
		}

		// Validate email
		await validateEmail(email);

		// Send OTP after successfully registering the user
		await sendOTP({
			email,
			subject: "Verify your New Email Addresss",
			message: "Please use the following OTP to verify your new email:",
		});

		// Update user's email and set verified to false
		user.email = email;
		user.verified = false;
		await user.save();

		return res.status(200).json({
			success: true,
			message: "Email successfully updated. Verify OTP.",
			details: user,
		});
	} catch (error) {
		next(error);
	}
};

// Define saveAddress function that allows registered and authenticated
// Users to save their address

const saveAddress = async (req, res, next) => {
	const { _id } = req.user;
	const { county, town, type } = req.body;

	try {
		// Capitalize county and town
		const capitalizedCounty = await capitalizeFirstLetter(county);
		const capitalizedTown = await capitalizeFirstLetter(town);

		// Find user by ID
		const user = await User.findById(_id);

		if (!user) {
			// Return 404 if user not found
			return res.status(404).json({ success: false, message: "User not found." });
		}

		// Update the user's primary or secondary address based on type
		if (type === "primary") {
			user.primaryAddress = {
				county: capitalizedCounty,
				town: capitalizedTown,
			};
		} else if (type === "secondary") {
			// Check if secondary address already exists
			const existingSecondary = user.secondaryAddresses.find((addr) => addr.county === capitalizedCounty && addr.town === capitalizedTown);

			if (existingSecondary) {
				return res.status(400).json({
					success: false,
					message: "Secondary address already exists.",
				});
			}

			// Add new secondary address
			user.secondaryAddresses.push({
				county: capitalizedCounty,
				town: capitalizedTown,
			});
		} else {
			return res.status(400).json({
				success: false,
				message: "Invalid address type. Must be primary or secondary.",
			});
		}

		// Save the user document
		await user.save();

		// Return success response
		return res.status(200).json({
			success: true,
			message: "Address saved successfully",
			details: user,
		});
	} catch (error) {
		next(error);
	}
};

// Define getWishlist function that allows authenticated users
// to view all products in their wishlist

const getWishlist = async (req, res, next) => {
	// Get _id from user session
	const { _id } = req.user;

	try {
		// Check if user exists based on ID
		const user = await User.findById(_id).populate("wishlist");

		if (!user) {
			// Return 404 if user not found
			return res.status(404).json({ success: false, message: "User Not Found." });
		}

		// Return response with wishlist details
		return res.status(200).json({
			success: true,
			message: user.wishlist.length > 0 ? "Wishlist retrieved successfully." : "Wishlist is empty.",
			details: user.wishlist,
			count: user.wishlist.length,
		});
	} catch (error) {
		next(error);
	}
};

// Define suspendAccount function that allows registered and authenticated
// Users to suspend/deactivate their accounts
// Can also be used by Admin

const suspendAccount = async (req, res, next) => {
	const { _id } = req.user;

	try {
		// Find and Update user
		const user = await User.findByIdAndUpdate(_id, { active: false }, { new: true });

		if (!user) {
			// Return 404
			return res.status(404).json({ success: false, message: "User not found." });
		}

		req.session.destroy(); // Destroy session after suspending account

		// Return success response
		return res.status(200).json({ success: true, message: "Account successfully deactivated." });
	} catch (error) {
		next(error);
	}
};

// Define deleteAccount function that allows registered and authenticated
// Users to delete their accounts
// Can also be used by Admin

const deleteAccount = async (req, res, next) => {
	const { _id } = req.user;

	try {
		// Find and Delete user
		const user = await User.findByIdAndDelete(_id);

		if (!user) {
			// Return 404
			return res.status(404).json({ success: false, message: "User not found." });
		}

		req.session.destroy(); // Destroy session after deleting account

		// Return success response
		return res.status(200).json({ success: true, message: "Account successfully deleted." });
	} catch (error) {
		next(error);
	}
};

export { getUserDetails, updateUserDetails, changeEmail, suspendAccount, deleteAccount, saveAddress, getWishlist };
