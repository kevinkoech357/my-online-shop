import express from 'express';
import { getUserDetails, updateUserDetails, changeEmail, suspendAccount, deleteAccount, saveAddress, getWishlist } from '../controller/userCtrl.mjs';
import isAuthenticated from '../middlewares/userStatus.mjs';
import { checkRequiredFields } from '../middlewares/validateBody.mjs';

const userRouter = express.Router();

// Required field for saving address
const addressField = ['county', 'town', 'type'];

userRouter.get('/', isAuthenticated, getUserDetails);
userRouter.patch('/update', isAuthenticated, updateUserDetails);
userRouter.put('/change-email', isAuthenticated, changeEmail);
userRouter.patch('/save-address', checkRequiredFields(addressField), isAuthenticated, saveAddress);
userRouter.get('/wishlist', isAuthenticated, getWishlist);

userRouter.post('/suspend', isAuthenticated, suspendAccount);
userRouter.delete('/delete', isAuthenticated, deleteAccount);

export default userRouter;
