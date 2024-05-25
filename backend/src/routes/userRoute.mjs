import express from 'express';
import { getUserDetails, updateUserDetails, changeEmail, suspendAccount, deleteAccount } from '../controller/userCtrl.mjs';
import isAuthenticated from '../middlewares/userStatus.mjs';

const userRouter = express.Router();

userRouter.get('/', isAuthenticated, getUserDetails);
userRouter.patch('/update', isAuthenticated, updateUserDetails);
userRouter.post('/change-email', isAuthenticated, changeEmail);
userRouter.post('/suspend', isAuthenticated, suspendAccount);
userRouter.delete('/delete', isAuthenticated, deleteAccount);

export default userRouter;
