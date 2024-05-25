import express from 'express';
import isAdmin from '../middlewares/userRole.mjs';
import isAuthenticated from '../middlewares/userStatus.mjs';
import { adminGetUserDetails, adminGetAllUsers, adminSuspendAccount, adminRecoverAccount, adminDeleteAccount } from '../controller/adminCtrl.mjs';

const adminRouter = express.Router();

adminRouter.get('/users/:id', isAuthenticated, isAdmin, adminGetUserDetails);
adminRouter.get('/users', isAuthenticated, isAdmin, adminGetAllUsers);
adminRouter.post('/users/suspend/:id', isAuthenticated, isAdmin, adminSuspendAccount);
adminRouter.post('/users/recover/:id', isAuthenticated, isAdmin, adminRecoverAccount);
adminRouter.delete('/users/delete/:id', isAuthenticated, isAdmin, adminDeleteAccount);

export default adminRouter;
