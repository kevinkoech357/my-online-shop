import express from 'express';
import { registerUser, loginUser, logoutUser } from '../controller/authCtrl.mjs';
import { regenerateOTP, verifyOTP } from '../controller/OTPCtrl.mjs';
import checkSessionExpiry from '../middlewares/session.mjs';

const router = express.Router();

// Register a new user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

// Verify OTP
router.post('/verify', verifyOTP);

// Regenerate OTP
router.post('/resend', regenerateOTP);

// Logout user
router.post('/logout', checkSessionExpiry, logoutUser);

export default router;
