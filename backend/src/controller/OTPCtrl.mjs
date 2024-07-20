import OTP from "../models/OTPModel.mjs";
import User from "../models/userModel.mjs";
import generateOTP from "../utils/generateOTP.mjs";
import { hashData, verifyData } from "../utils/hashData.mjs";
import sendEmail from "../utils/sendMail.mjs";

// Retrieve MAIL_USERNAME from environment variables
const mailAddress = process.env.MAIL_USERNAME;

/*
Define sendOTP async function that sends a generated OTP to the users email during registration.
*/
const sendOTP = async ({ email, subject, message, duration = 1 }) => {
	try {
		// Check if any required fields are missing
		if (!email || !subject || !message) {
			throw new Error("Email, subject, or message is empty");
		}

		// Delete any existing OTP records for the email
		await OTP.deleteOne({ email });

		// Generate OTP
		const otpValue = await generateOTP();
		const otpString = otpValue.toString();

		// Mail options for sending OTP
		const mailOptions = {
			from: mailAddress,
			to: email,
			subject: "Verify your Email",
			html: `<p>Welcome <strong style="color:blue;">${email}</strong></p>
            <p>${message}</p><p style="font-size:25px;letter-spacing:2px"><strong>${otpString}</strong></p>
            <p>This code <strong>expires in ${duration} hour.</strong></p>
            <p>Best Regards,</p>
            <p>My Online Shop Team</p>`,
		};

		// Send email with OTP
		await sendEmail(mailOptions);

		// Hash OTP
		const hashedOTP = await hashData(otpString);

		// Create new OTP record
		const newOTP = new OTP({
			email,
			otp: hashedOTP,
			createdAt: new Date(),
			expiresAt: new Date(Date.now() + 3600000 * duration),
		});

		// Save OTP record to database
		const createdOTPRecord = await newOTP.save();

		return createdOTPRecord;
	} catch (error) {
		throw new Error(`Error sending OTP: ${error.message}`);
	}
};

/*
Define verifyOTP async funtion that is used to verify the users email and account in general.
If users dont verify email, they wont be able to checkout.
*/
const verifyOTP = async (req, res, next) => {
	try {
		const { email, otp } = req.body;

		// Check if all required fields are provided
		const requiredFields = ["email", "otp"];
		for (const field of requiredFields) {
			if (!req.body[field]) {
				// Return a 400 Bad Request if any required field is missing
				return res.status(400).json({
					success: false,
					message: `Missing or invalid required field: ${field}`,
				});
			}
		}

		// Check if the provided email is registered
		const existingUser = await User.findOne({ email });
		if (!existingUser) {
			return res.status(404).json({
				success: false,
				message: "Invalid email. Recheck or create a new account.",
			});
		}

		// Check if user has already been verified
		if (existingUser.verified === true) {
			return res.status(400).json({
				success: false,
				message: "Provided email is already verified. Proceed to login.",
			});
		}

		// Find OTP record for the provided email
		const userEmail = await OTP.findOne({ email });
		if (!userEmail) {
			return res.status(404).json({
				success: false,
				message: "Invalid email.",
			});
		}

		// Compare provided OTP with hashed OTP from the record
		const hashedOTPRecord = userEmail.otp;
		const isValidOTP = await verifyData(hashedOTPRecord, otp);

		if (!isValidOTP) {
			return res.status(400).json({
				success: false,
				message: "Invalid OTP. Request a new one.",
			});
		}

		// Check if OTP has expired
		const expiresAt = userEmail.expiresAt;
		if (expiresAt < Date.now()) {
			// Delete expired OTP record
			await OTP.deleteOne({ email });
			return res.json({
				success: false,
				message: "OTP has already expired. Request a new one.",
			});
		}

		// If OTP is valid, mark user's email as verified
		existingUser.verified = true;
		existingUser.active = true;
		await existingUser.save();

		// Delete the OTP record since it's no longer needed
		await OTP.deleteOne({ email });

		// Return success message
		return res.status(200).json({
			success: true,
			message: "Email verification successful.",
		});
	} catch (error) {
		next(error);
	}
};

/*
Define regenerateOTP async function that allows a user to request for a new OTP
incase the provided OTP is invalid or expired or just because they want to.
*/
const regenerateOTP = async (req, res, next) => {
	try {
		const { email } = req.body;

		// If email is not provided
		if (!email) {
			return res.status(400).json({
				success: false,
				message: "Email is required.",
			});
		}

		// Check if the provided email is registered
		const existingUser = await User.findOne({ email });
		if (!existingUser) {
			return res.status(404).json({
				success: false,
				message: "Invalid email. Recheck or create a new account.",
			});
		}

		// Check if user has already been verified
		if (existingUser.verified === true) {
			return res.status(400).json({
				success: false,
				message: "Provided email is already verified. Proceed to login.",
			});
		}

		// Regenerate and send new OTP after successfully registering the user
		await sendOTP({
			email,
			subject: "Verify your Email",
			message: "Please use the following OTP to verify your email:",
		});

		return res.status(200).json({
			success: true,
			message: "New OTP successfully sent to your email.",
		});
	} catch (error) {
		next(error);
	}
};

export { sendOTP, verifyOTP, regenerateOTP };
