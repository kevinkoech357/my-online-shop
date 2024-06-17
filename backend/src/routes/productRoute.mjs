import express from 'express';
import { viewOneProduct, getAllProducts, addToWishlist, rateProduct, getProductRating } from '../controller/productCtrl.mjs';
import validateMongoID from '../middlewares/validateMongoID.mjs';
import { checkRequiredFields, validateProductID, validateRatingDetails } from '../middlewares/validateBody.mjs';
import isAuthenticated from '../middlewares/userStatus.mjs';

const productRouter = express.Router();

// Const wishlist body
const wishlistField = ['productID'];
const ratingField = ['star'];

// Product related open/public routes
productRouter.get('/', getAllProducts);
productRouter.get('/:id', validateMongoID, viewOneProduct);
productRouter.get('/:id/rating', validateMongoID, getProductRating);

// Wishlist related private routes
productRouter.patch('/wishlist', checkRequiredFields(wishlistField), validateProductID, isAuthenticated, addToWishlist);

// Rate product private route
productRouter.patch('/:id/rate', validateMongoID, checkRequiredFields(ratingField), validateRatingDetails, isAuthenticated, rateProduct);

export default productRouter;
