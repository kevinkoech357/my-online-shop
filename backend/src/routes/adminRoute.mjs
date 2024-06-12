import express from 'express';

import isAdmin from '../middlewares/userRole.mjs';
import isAuthenticated from '../middlewares/userStatus.mjs';
import { checkRequiredFields, validateIntegerFields } from '../middlewares/validateBody.mjs';
import validateMongoID from '../middlewares/validateMongoID.mjs';

import { adminGetUserDetails, adminGetAllUsers, adminSuspendAccount, adminRecoverAccount, adminDeleteAccount } from '../controller/adminCtrl.mjs';
import { adminCreateProduct, adminModifyProduct, adminDeleteProduct, adminUploadProductImages, adminDeleteProductImage } from '../controller/productCtrl.mjs';
import { adminWriteBlog, adminModifyBlog, adminDeleteBlog, adminUploadBlogImages, adminDeleteBlogImage } from '../controller/blogCtrl.mjs';
import { adminCreateProductCategory, adminModifyProductCategory, adminDeleteProductCategory } from '../controller/productCategoryCtrl.mjs';
import { productImageResize, uploadPhoto, blogImageResize } from '../middlewares/imageUploads.mjs';

const adminRouter = express.Router();

// Define required fields
const productFields = ['name', 'description', 'price', 'brand', 'color', 'quantity', 'category'];
const blogFields = ['title', 'content', 'category'];
const productCategoryField = ['title'];
const deleteImageField = ['imageID'];

// Routes for performing User Account Actions
adminRouter.get('/users/:id', validateMongoID, isAuthenticated, isAdmin, adminGetUserDetails);
adminRouter.get('/users', isAuthenticated, isAdmin, adminGetAllUsers);
adminRouter.post('/users/suspend/:id', validateMongoID, isAuthenticated, isAdmin, adminSuspendAccount);
adminRouter.post('/users/recover/:id', validateMongoID, isAuthenticated, isAdmin, adminRecoverAccount);
adminRouter.delete('/users/delete/:id', validateMongoID, isAuthenticated, isAdmin, adminDeleteAccount);

// Routes for performing Product related actions
adminRouter.post('/products/create', checkRequiredFields(productFields), validateIntegerFields, isAuthenticated, isAdmin, adminCreateProduct);
adminRouter.put('/products/upload/image/:id', validateMongoID, isAuthenticated, isAdmin, uploadPhoto.array('images', 5), productImageResize, adminUploadProductImages);
adminRouter.put('/products/delete/image/:id', validateMongoID, checkRequiredFields(deleteImageField), isAuthenticated, isAdmin, adminDeleteProductImage);
adminRouter.patch('/products/update/:id', validateMongoID, isAuthenticated, isAdmin, adminModifyProduct);
adminRouter.delete('/products/delete/:id', validateMongoID, isAuthenticated, isAdmin, adminDeleteProduct);

// Routes for performing Blog related actions
adminRouter.post('/blog/create', checkRequiredFields(blogFields), isAuthenticated, isAdmin, adminWriteBlog);
adminRouter.put('/blog/upload/image/:id', validateMongoID, isAuthenticated, isAdmin, uploadPhoto.array('images', 2), blogImageResize, adminUploadBlogImages);
adminRouter.put('/blog/delete/image/:id', validateMongoID, checkRequiredFields(deleteImageField), isAuthenticated, isAdmin, adminDeleteBlogImage);
adminRouter.patch('/blog/edit/:id', validateMongoID, isAuthenticated, isAdmin, adminModifyBlog);

adminRouter.delete('/blog/delete/:id', validateMongoID, isAuthenticated, isAdmin, adminDeleteBlog);

// Routes for performing Product Category related actions
adminRouter.post('/prod-category/create', checkRequiredFields(productCategoryField), isAuthenticated, isAdmin, adminCreateProductCategory);
adminRouter.patch('/prod-category/update/:id', validateMongoID, checkRequiredFields(productCategoryField), isAuthenticated, isAdmin, adminModifyProductCategory);
adminRouter.delete('/prod-category/delete/:id', validateMongoID, isAuthenticated, isAdmin, adminDeleteProductCategory);

export default adminRouter;
