// Function to generate a random OTP (One-Time Password)
const generateOTP = async () => {
  // Generate a random OTP between 1000 and 9999
  const otp = Math.floor(1000 + Math.random() * 9000);
  return otp;
};

export default generateOTP;
