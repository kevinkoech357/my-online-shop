import express from 'express';

import isAuthenticated from '../middlewares/userStatus.mjs';
import { checkRequiredFields } from '../middlewares/validateBody.mjs';

import { getUserDetails, updateUserDetails, changeEmail, suspendAccount, deleteAccount, saveAddress, getWishlist } from '../controller/userCtrl.mjs';
import { clearCart, getUserCart, removeProductFromCart, userCart } from '../controller/cartCtrl.mjs';

const userRouter = express.Router();

// Required field for saving address
const addressField = ['county', 'town', 'type'];
const cartField = ['productID'];

// User account details
userRouter.get('/', isAuthenticated, getUserDetails);
userRouter.patch('/update', isAuthenticated, updateUserDetails);
userRouter.put('/change-email', isAuthenticated, changeEmail);
userRouter.patch('/save-address', checkRequiredFields(addressField), isAuthenticated, saveAddress);

// Users wishlist
userRouter.get('/wishlist', isAuthenticated, getWishlist);

// Cart functionality
userRouter.post('/cart/create', isAuthenticated, userCart);
userRouter.get('/my-cart', isAuthenticated, getUserCart);
userRouter.delete('/cart/clear', isAuthenticated, clearCart);
userRouter.delete('/cart/remove-product', checkRequiredFields(cartField), isAuthenticated, removeProductFromCart);

// Suspend or delete account
userRouter.post('/suspend', isAuthenticated, suspendAccount);
userRouter.delete('/delete', isAuthenticated, deleteAccount);

export default userRouter;
