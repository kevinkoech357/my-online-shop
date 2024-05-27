import express from 'express';
import isAdmin from '../middlewares/userRole.mjs';
import isAuthenticated from '../middlewares/userStatus.mjs';
import { checkRequiredFields } from '../middlewares/validateBody.mjs';

import { adminGetUserDetails, adminGetAllUsers, adminSuspendAccount, adminRecoverAccount, adminDeleteAccount } from '../controller/adminCtrl.mjs';
import { adminCreateProduct, adminModifyProduct, adminDeleteProduct } from '../controller/productCtrl.mjs';

const adminRouter = express.Router();

// Define required fields
const productFields = ['name', 'slug', 'description', 'price', 'brand', 'color', 'quantity', 'category'];

// Routes for performing User Account Actions
adminRouter.get('/users/:id', isAuthenticated, isAdmin, adminGetUserDetails);
adminRouter.get('/users', isAuthenticated, isAdmin, adminGetAllUsers);
adminRouter.post('/users/suspend/:id', isAuthenticated, isAdmin, adminSuspendAccount);
adminRouter.post('/users/recover/:id', isAuthenticated, isAdmin, adminRecoverAccount);
adminRouter.delete('/users/delete/:id', isAuthenticated, isAdmin, adminDeleteAccount);

// Routes for performing Product related actions
adminRouter.post('/products/create', isAuthenticated, isAdmin, checkRequiredFields(productFields), adminCreateProduct);
adminRouter.patch('/products/update/:id', isAuthenticated, isAdmin, adminModifyProduct);
adminRouter.delete('/products/delete/:id', isAuthenticated, isAdmin, adminDeleteProduct);

export default adminRouter;
