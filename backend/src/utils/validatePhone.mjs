// Check if phone is in valid format

const validatePhone = (phone) => {
	// Validation for phone format
	if (/^\d+$/.test(phone)) {
		return true; // Phone is valid
	}
	return false; // Phone is invalid
};

export default validatePhone;
