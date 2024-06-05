import express from 'express';

import isAdmin from '../middlewares/userRole.mjs';
import isAuthenticated from '../middlewares/userStatus.mjs';
import { checkRequiredFields } from '../middlewares/validateBody.mjs';
import validateMongoID from '../middlewares/validateMongoID.mjs';

import { adminGetUserDetails, adminGetAllUsers, adminSuspendAccount, adminRecoverAccount, adminDeleteAccount } from '../controller/adminCtrl.mjs';
import { adminCreateProduct, adminModifyProduct, adminDeleteProduct } from '../controller/productCtrl.mjs';
import { adminWriteBlog, adminModifyBlog, adminDeleteBlog } from '../controller/blogCtrl.mjs';
import { adminCreateProductCategory, adminModifyProductCategory, adminDeleteProductCategory } from '../controller/productCategoryCtrl.mjs';

const adminRouter = express.Router();

// Define required fields
const productFields = ['name', 'description', 'price', 'brand', 'color', 'quantity', 'category'];
const blogFields = ['title', 'content', 'category'];
const productCategoryField = ['title'];

// Routes for performing User Account Actions
adminRouter.get('/users/:id', validateMongoID, isAuthenticated, isAdmin, adminGetUserDetails);
adminRouter.get('/users', isAuthenticated, isAdmin, adminGetAllUsers);
adminRouter.post('/users/suspend/:id', validateMongoID, isAuthenticated, isAdmin, adminSuspendAccount);
adminRouter.post('/users/recover/:id', validateMongoID, isAuthenticated, isAdmin, adminRecoverAccount);
adminRouter.delete('/users/delete/:id', validateMongoID, isAuthenticated, isAdmin, adminDeleteAccount);

// Routes for performing Product related actions
adminRouter.post('/products/create', checkRequiredFields(productFields), isAuthenticated, isAdmin, adminCreateProduct);
adminRouter.patch('/products/update/:id', validateMongoID, isAuthenticated, isAdmin, adminModifyProduct);
adminRouter.delete('/products/delete/:id', validateMongoID, isAuthenticated, isAdmin, adminDeleteProduct);

// Routes for performing Blog related actions
adminRouter.post('/blog/create', checkRequiredFields(blogFields), isAuthenticated, isAdmin, adminWriteBlog);
adminRouter.patch('/blog/edit/:id', validateMongoID, isAuthenticated, isAdmin, adminModifyBlog);
adminRouter.delete('/blog/delete/:id', validateMongoID, isAuthenticated, isAdmin, adminDeleteBlog);

// Routes for performing Product Category related actions
adminRouter.post('/prod-category/create', checkRequiredFields(productCategoryField), isAuthenticated, isAdmin, adminCreateProductCategory);
adminRouter.patch('/prod-category/update/:id', validateMongoID, checkRequiredFields(productCategoryField), isAuthenticated, isAdmin, adminModifyProductCategory);
adminRouter.delete('/prod-category/delete/:id', validateMongoID, isAuthenticated, isAdmin, adminDeleteProductCategory);

export default adminRouter;
