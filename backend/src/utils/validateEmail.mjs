// Check if email is in valid format

const validateEmail = async (email, res) => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) {
		return res.status(400).json({
			success: false,
			message: "Invalid email format",
		});
	}
};

export default validateEmail;
