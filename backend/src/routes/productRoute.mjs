import express from 'express';
import { viewOneProduct, getAllProducts, addToWishlist, getWishlist } from '../controller/productCtrl.mjs';
import validateMongoID from '../middlewares/validateMongoID.mjs';
import { checkRequiredFields } from '../middlewares/validateBody.mjs';
import isAuthenticated from '../middlewares/userStatus.mjs';

const productRouter = express.Router();

// Const wishlist body
const wishlistField = ['productID'];

// Product related open/public routes
productRouter.get('/', getAllProducts);
productRouter.get('/:id', validateMongoID, viewOneProduct);

// Wishlist related private routes
productRouter.get('/wishlist/me', isAuthenticated, getWishlist);
productRouter.put('/wishlist', checkRequiredFields(wishlistField), isAuthenticated, addToWishlist);

export default productRouter;
