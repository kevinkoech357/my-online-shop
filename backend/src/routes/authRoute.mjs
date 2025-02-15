import express from "express";
import { regenerateOTP, verifyOTP } from "../controller/OTPCtrl.mjs";
import { adminLogin } from "../controller/adminCtrl.mjs";
import { checkAdminAuthStatus, checkUserAuthStatus, loginUser, logoutUser, registerUser } from "../controller/authCtrl.mjs";
import isAuthenticated from "../middlewares/userStatus.mjs";
import { checkFieldLength, checkRequiredFields } from "../middlewares/validateBody.mjs";

const authRouter = express.Router();

// Define required fields
const registrationFields = ["firstname", "lastname", "email", "phone", "password"];
const loginFields = ["email", "password"];

// Register a new user
authRouter.post("/register", checkRequiredFields(registrationFields), checkFieldLength, registerUser);

// Login user
authRouter.post("/login", checkRequiredFields(loginFields), loginUser);

// Login admin
authRouter.post("/admin/login", checkRequiredFields(loginFields), adminLogin);

// Verify OTP
authRouter.post("/verify", verifyOTP);

// Regenerate OTP
authRouter.post("/resend", regenerateOTP);

// Logout user
authRouter.post("/logout", isAuthenticated, logoutUser);

// Check user and admin auth status
authRouter.get("/status", isAuthenticated, checkUserAuthStatus);
authRouter.get("/admin/status", isAuthenticated, checkAdminAuthStatus);

export default authRouter;
