import express from 'express';
import { registerUser, loginUser, logoutUser } from '../controller/authCtrl.mjs';
import { regenerateOTP, verifyOTP } from '../controller/OTPCtrl.mjs';
import { isAuthenticated } from '../middlewares/userStatus.mjs';
import { checkFieldLength, checkRequiredFields } from '../middlewares/validateBody.mjs';

const authrouter = express.Router();

// Define required fields
const registrationFields = ['firstname', 'lastname', 'email', 'phone', 'password'];
const loginFields = ['email', 'password'];

// Register a new user
authrouter.post('/register', checkRequiredFields(registrationFields), checkFieldLength, registerUser);

// Login user
authrouter.post('/login', checkRequiredFields(loginFields), loginUser);

// Verify OTP
authrouter.post('/verify', verifyOTP);

// Regenerate OTP
authrouter.post('/resend', regenerateOTP);

// Logout user
authrouter.post('/logout', isAuthenticated, logoutUser);

export default authrouter;
