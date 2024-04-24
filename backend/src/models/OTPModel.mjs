import mongoose from 'mongoose';

// Define schema for holding OTP records
const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  otp: {
    type: String,
    required: true
  },
  createdAt: Date,
  expiresAt: Date
});

const OTP = mongoose.model('OTP', OTPSchema);

export default OTP;
