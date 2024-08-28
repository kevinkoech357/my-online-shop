import Newsletter from "../models/newsletterModel.mjs";
import validateEmail from "../utils/validateEmail.mjs";

// Define a subscibeToNewsletter function that will allows users
// to subscribe to Weekly or Monthly newsletters

const subscibeToNewsletter = async (req, res, next) => {
	// Get email from body
	const { email } = req.body;

	try {
		// Validate Email
		await validateEmail(email, res);

		// Check if email is already subscribed
		const existingSubscriber = await Newsletter.findOne({ email });

		if (existingSubscriber) {
			// Return a success
			return res.status(409).json({ success: false, message: "Already subscribed to Newsletter." });
		}

		const newSubsriber = new Newsletter({
			email,
		});

		// Save the new subscriber
		await newSubsriber.save();

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
		await validateEmail(email, res);

		// Find and delete email
		const emailToUnsubscribe = await Newsletter.deleteOne({ email });

		// Return 404 if email not found
		if (!emailToUnsubscribe) {
			return res.status(404).json({
				success: false,
				message: "Email Not Subscribed to Newsletter.",
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

export { subscibeToNewsletter, unsubscribeFromNewsletter };
