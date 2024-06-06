import express from 'express';
import { viewOneProduct, getAllProducts, addToWishlist, getWishlist, rateProduct } from '../controller/productCtrl.mjs';
import validateMongoID from '../middlewares/validateMongoID.mjs';
import { checkRequiredFields, validateProductID, validateRatingDetails } from '../middlewares/validateBody.mjs';
import isAuthenticated from '../middlewares/userStatus.mjs';

const productRouter = express.Router();

// Const wishlist body
const requiredField = ['productID'];

// Product related open/public routes
productRouter.get('/', getAllProducts);
productRouter.get('/:id', validateMongoID, viewOneProduct);

// Wishlist related private routes
productRouter.get('/wishlist/me', isAuthenticated, getWishlist);
productRouter.patch('/wishlist', checkRequiredFields(requiredField), validateProductID, isAuthenticated, addToWishlist);

// Rate product private route
productRouter.patch('/rate', checkRequiredFields(requiredField), validateProductID, validateRatingDetails, isAuthenticated, rateProduct);

export default productRouter;
