import express from "express";

import isAuthenticated from "../middlewares/userStatus.mjs";
import { checkRequiredFields } from "../middlewares/validateBody.mjs";

import { clearCart, createOrUpdateCart, getUserCart, removeProductFromCart } from "../controller/cartCtrl.mjs";
import { changeEmail, deleteAccount, getUserDetails, getWishlist, saveAddress, suspendAccount, updateUserDetails } from "../controller/userCtrl.mjs";
import validateMongoID from "../middlewares/validateMongoID.mjs";

const userRouter = express.Router();

// Required field for saving address
const addressField = ["county", "town", "type"];
const cartField = ["productID"];

// User account details
userRouter.get("/", isAuthenticated, getUserDetails);
userRouter.patch("/update", isAuthenticated, updateUserDetails);
userRouter.put("/change-email", isAuthenticated, changeEmail);
userRouter.patch("/save-address", checkRequiredFields(addressField), isAuthenticated, saveAddress);

// Users wishlist
userRouter.get("/wishlist", isAuthenticated, getWishlist);

// Cart functionality
userRouter.post("/cart/create", isAuthenticated, createOrUpdateCart);
userRouter.get("/cart", isAuthenticated, getUserCart);
userRouter.delete("/cart/clear", isAuthenticated, clearCart);
userRouter.patch("/cart/remove/:id", validateMongoID, isAuthenticated, removeProductFromCart);

// Suspend or delete account
userRouter.patch("/suspend", isAuthenticated, suspendAccount);
userRouter.delete("/delete", isAuthenticated, deleteAccount);

export default userRouter;
