import express from "express";

import isAuthenticated from "../middlewares/userStatus.mjs";
import { checkRequiredFields } from "../middlewares/validateBody.mjs";

import { changeEmail, deleteAccount, getUserDetails, getWishlist, saveAddress, suspendAccount, updateUserDetails } from "../controller/userCtrl.mjs";

const userRouter = express.Router();

// Required field for saving address
const addressField = ["county", "town", "type"];

// User account details
userRouter.get("/", isAuthenticated, getUserDetails);
userRouter.patch("/update", isAuthenticated, updateUserDetails);
userRouter.put("/change-email", isAuthenticated, changeEmail);
userRouter.patch("/save-address", checkRequiredFields(addressField), isAuthenticated, saveAddress);

// Users wishlist
userRouter.get("/wishlist", isAuthenticated, getWishlist);

// Suspend or delete account
userRouter.patch("/suspend", isAuthenticated, suspendAccount);
userRouter.delete("/delete", isAuthenticated, deleteAccount);

export default userRouter;
