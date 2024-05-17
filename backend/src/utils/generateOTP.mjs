// Function to generate a random OTP (One-Time Password)
const generateOTP = async () => {
  // Generate a random OTP between 100000 and 999999 (six digits)
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp;
};

export default generateOTP;
