import express from 'express';
import { getUserDetails, updateUserDetails, changeEmail, suspendAccount, recoverAccount, deleteAccount } from '../controller/userCtrl.mjs';
import { isAuthenticated, isSelf } from '../middlewares/userStatus.mjs';

const userRouter = express.Router();

userRouter.get('/:id', isAuthenticated, isSelf, getUserDetails);
userRouter.patch('/update/:id', isAuthenticated, isSelf, updateUserDetails);
userRouter.post('/change-email/:id', isAuthenticated, isSelf, changeEmail);
userRouter.post('/suspend/:id', isAuthenticated, isSelf, suspendAccount);
userRouter.post('/recover/:id', isAuthenticated, isSelf, recoverAccount);
userRouter.delete('/delete/:id', isAuthenticated, isSelf, deleteAccount);

export default userRouter;
