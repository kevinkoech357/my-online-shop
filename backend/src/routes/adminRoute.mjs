import express from 'express';
import { getUserDetails, updateUserDetails, changeEmail, suspendAccount, recoverAccount, deleteAccount } from '../controller/userCtrl.mjs';
import { isAuthenticated } from '../middlewares/userStatus.mjs';
import isAdmin from '../middlewares/userRole.mjs';

const adminRouter = express.Router();

adminRouter.get('users/:id', isAuthenticated, isAdmin, getUserDetails);
adminRouter.patch('/update/:id', isAuthenticated, isAdmin, updateUserDetails);
adminRouter.post('/change-email/:id', isAuthenticated, isAdmin, changeEmail);
adminRouter.post('/suspend/:id', isAuthenticated, isAdmin, suspendAccount);
adminRouter.post('/recover/:id', isAuthenticated, isAdmin, recoverAccount);
adminRouter.delete('/delete/:id', isAuthenticated, isAdmin, deleteAccount);

export default adminRouter;
