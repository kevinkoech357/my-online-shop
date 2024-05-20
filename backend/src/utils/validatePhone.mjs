// Check if phone is in valid format

const validatePhone = async (phone, res) => {
  // Validation for phone format
  if (!/^\d+$/.test(phone)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid phone number format'
    });
  }
};

export default validatePhone;
