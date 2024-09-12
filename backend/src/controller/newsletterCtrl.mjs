import Newsletter from "../models/newsletterModel.mjs";
import validateEmail from "../utils/validateEmail.mjs";

// Define a subscribeToNewsletter function that will allow users
// to subscribe to Weekly or Monthly newsletters

const subscribeToNewsletter = async (req, res, next) => {
	// Get email from body
	const { email } = req.body;

	try {
		// Validate Email
		if (!email || !validateEmail(email)) {
			return res.status(400).json({
				success: false,
				message: "Invalid email format",
			});
		}

		// Check if email is already subscribed
		const existingSubscriber = await Newsletter.findOne({ email });

		if (existingSubscriber) {
			// Return a conflict status
			return res.status(409).json({ success: false, message: "Already subscribed to Newsletter." });
		}

		const newSubscriber = new Newsletter({
			email,
		});

		// Save the new subscriber
		await newSubscriber.save();

		return res.status(201).json({
			success: true,
			message: "Successfully subscribed to Newsletter",
		});
	} catch (error) {
		next(error);
	}
};

const unsubscribeFromNewsletter = async (req, res, next) => {
	// Get email from body
	const { email } = req.body;

	try {
		// Validate Email
		if (!validateEmail(email)) {
			return res.status(400).json({
				success: false,
				message: "Invalid email format",
			});
		}

		// Find and delete email
		const result = await Newsletter.deleteOne({ email });

		// Return 404 if email not found
		if (result.deletedCount === 0) {
			return res.status(404).json({
				success: false,
				message: "Email not subscribed to Newsletter.",
			});
		}

		// Return success response
		return res.status(200).json({
			success: true,
			message: "Successfully unsubscribed from Newsletter.",
		});
	} catch (error) {
		next(error);
	}
};

export { subscribeToNewsletter, unsubscribeFromNewsletter };
