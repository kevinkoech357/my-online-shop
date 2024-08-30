import nodemailer from "nodemailer";
import config from "../config.mjs";

// Create transporter for sending emails
const transporter = nodemailer.createTransport({
	host: config.mail.server,
	port: 587,
	auth: {
		user: config.mail.username,
		pass: config.mail.password,
	},
});

// Verify transporter
transporter.verify((error, success) => {
	if (error) {
		console.error("Error verifying transporter:", error);
	} else {
		console.log("Transport is ready.");
		console.log(success);
	}
});

// Function to send email
const sendEmail = async (mailOptions) => {
	try {
		await transporter.sendMail(mailOptions);
		console.log("Email sent successfully.");
	} catch (error) {
		console.error("Error sending email:", error);
		throw new Error("Failed to send email. Please try again later.");
	}
};

export default sendEmail;
