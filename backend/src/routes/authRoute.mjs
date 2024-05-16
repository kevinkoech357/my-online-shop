import express from 'express';
import { registerUser, loginUser, setSession } from '../controller/authCtrl.mjs';
import { regenerateOTP, verifyOTP } from '../controller/OTPCtrl.mjs';

const router = express.Router();

// Register a new user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

// Verify OTP
router.post('/verify', verifyOTP);

// Regenerate OTP
router.post('/resend', regenerateOTP);

// Set session
router.get('/', setSession);

export default router;
