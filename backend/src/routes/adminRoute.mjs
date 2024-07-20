import express from "express";

import isAdmin from "../middlewares/userRole.mjs";
import isAuthenticated from "../middlewares/userStatus.mjs";
import {
	checkRequiredFields,
	validateIntegerFields,
} from "../middlewares/validateBody.mjs";
import validateMongoID from "../middlewares/validateMongoID.mjs";

import {
	adminDeleteAccount,
	adminGetAllUsers,
	adminGetUserDetails,
	adminRecoverAccount,
	adminSuspendAccount,
} from "../controller/adminCtrl.mjs";
import {
	adminDeleteBlog,
	adminDeleteBlogImage,
	adminModifyBlog,
	adminUploadBlogImages,
	adminWriteBlog,
} from "../controller/blogCtrl.mjs";
import {
	adminCreateBrand,
	adminDeleteBrand,
	adminModifyBrand,
} from "../controller/brandCtrl.mjs";
import {
	adminCreateLocation,
	adminDeleteLocation,
	adminModifyLocation,
} from "../controller/locationCtrl.mjs";
import {
	adminCreateProductCategory,
	adminDeleteProductCategory,
	adminModifyProductCategory,
} from "../controller/productCategoryCtrl.mjs";
import {
	adminCreateProduct,
	adminDeleteProduct,
	adminDeleteProductImage,
	adminModifyProduct,
	adminUploadProductImages,
} from "../controller/productCtrl.mjs";
import {
	blogImageResize,
	productImageResize,
	uploadPhoto,
} from "../middlewares/imageUploads.mjs";

const adminRouter = express.Router();

// Define required fields
const productFields = [
	"name",
	"description",
	"price",
	"brand",
	"color",
	"quantity",
	"category",
];
const blogFields = ["title", "content", "category"];
const titleField = ["title"];
const locationField = ["name", "county", "town"];
const deleteImageField = ["imageID"];

// Routes for performing User Account Actions
adminRouter.get(
	"/users/:id",
	validateMongoID,
	isAuthenticated,
	isAdmin,
	adminGetUserDetails,
);
adminRouter.get("/users", isAuthenticated, isAdmin, adminGetAllUsers);
adminRouter.post(
	"/users/suspend/:id",
	validateMongoID,
	isAuthenticated,
	isAdmin,
	adminSuspendAccount,
);
adminRouter.post(
	"/users/recover/:id",
	validateMongoID,
	isAuthenticated,
	isAdmin,
	adminRecoverAccount,
);
adminRouter.delete(
	"/users/delete/:id",
	validateMongoID,
	isAuthenticated,
	isAdmin,
	adminDeleteAccount,
);

// Routes for performing Product related actions
adminRouter.post(
	"/products/create",
	checkRequiredFields(productFields),
	validateIntegerFields,
	isAuthenticated,
	isAdmin,
	adminCreateProduct,
);
adminRouter.put(
	"/products/upload/:id/images",
	validateMongoID,
	isAuthenticated,
	isAdmin,
	uploadPhoto.array("images", 5),
	productImageResize,
	adminUploadProductImages,
);
adminRouter.put(
	"/products/delete/:id/images",
	validateMongoID,
	checkRequiredFields(deleteImageField),
	isAuthenticated,
	isAdmin,
	adminDeleteProductImage,
);
adminRouter.patch(
	"/products/update/:id",
	validateMongoID,
	isAuthenticated,
	isAdmin,
	adminModifyProduct,
);
adminRouter.delete(
	"/products/delete/:id",
	validateMongoID,
	isAuthenticated,
	isAdmin,
	adminDeleteProduct,
);

// Routes for performing Blog related actions
adminRouter.post(
	"/blog/create",
	checkRequiredFields(blogFields),
	isAuthenticated,
	isAdmin,
	adminWriteBlog,
);
adminRouter.put(
	"/blog/upload/:id/images",
	validateMongoID,
	isAuthenticated,
	isAdmin,
	uploadPhoto.array("images", 2),
	blogImageResize,
	adminUploadBlogImages,
);
adminRouter.put(
	"/blog/delete/:id/images",
	validateMongoID,
	checkRequiredFields(deleteImageField),
	isAuthenticated,
	isAdmin,
	adminDeleteBlogImage,
);
adminRouter.patch(
	"/blog/edit/:id",
	validateMongoID,
	isAuthenticated,
	isAdmin,
	adminModifyBlog,
);

adminRouter.delete(
	"/blog/delete/:id",
	validateMongoID,
	isAuthenticated,
	isAdmin,
	adminDeleteBlog,
);

// Routes for performing Product Category related actions
adminRouter.post(
	"/product/category/create",
	checkRequiredFields(titleField),
	isAuthenticated,
	isAdmin,
	adminCreateProductCategory,
);
adminRouter.patch(
	"/product/category/update/:id",
	validateMongoID,
	checkRequiredFields(titleField),
	isAuthenticated,
	isAdmin,
	adminModifyProductCategory,
);
adminRouter.delete(
	"/product/category/delete/:id",
	validateMongoID,
	isAuthenticated,
	isAdmin,
	adminDeleteProductCategory,
);

// Routes for performing Brand related actions
adminRouter.post(
	"/brand/create",
	checkRequiredFields(titleField),
	isAuthenticated,
	isAdmin,
	adminCreateBrand,
);
adminRouter.patch(
	"/brand/update/:id",
	validateMongoID,
	checkRequiredFields(titleField),
	isAuthenticated,
	isAdmin,
	adminModifyBrand,
);
adminRouter.delete(
	"/brand/delete/:id",
	validateMongoID,
	isAuthenticated,
	isAdmin,
	adminDeleteBrand,
);

// Routes for performing Location related actions
adminRouter.post(
	"/location/create",
	checkRequiredFields(locationField),
	isAuthenticated,
	isAdmin,
	adminCreateLocation,
);
adminRouter.patch(
	"/location/update/:id",
	validateMongoID,
	isAuthenticated,
	isAdmin,
	adminModifyLocation,
);
adminRouter.delete(
	"/location/delete/:id",
	validateMongoID,
	isAuthenticated,
	isAdmin,
	adminDeleteLocation,
);

export default adminRouter;
