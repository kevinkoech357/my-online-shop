import express from 'express';
import { registerUser, loginUser } from '../controller/authCtrl.mjs';
import { verifyOTP } from '../controller/OTPCtrl.mjs';

const router = express.Router();

// Register a new user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

// Verify OTP
router.post('/verify', verifyOTP);

export default router;
