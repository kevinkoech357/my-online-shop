import express from 'express';
import { getUserDetails, suspendAccount, recoverAccount, deleteAccount, getAllUsers } from '../controller/userCtrl.mjs';
import { isAuthenticated } from '../middlewares/userStatus.mjs';
import isAdmin from '../middlewares/userRole.mjs';

const adminRouter = express.Router();

adminRouter.get('/users/:id', isAuthenticated, isAdmin, getUserDetails);
adminRouter.get('/users', isAuthenticated, isAdmin, getAllUsers);
adminRouter.post('/users/suspend/:id', isAuthenticated, isAdmin, suspendAccount);
adminRouter.post('/users/recover/:id', isAuthenticated, isAdmin, recoverAccount);
adminRouter.delete('/users/delete/:id', isAuthenticated, isAdmin, deleteAccount);

export default adminRouter;
