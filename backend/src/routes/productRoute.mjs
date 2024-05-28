import express from 'express';
import { viewOneProduct, getAllProducts } from '../controller/productCtrl.mjs';
import validateMongoID from '../middlewares/validateMongoID.mjs';

const productRouter = express.Router();

// Product related open/public routes
productRouter.get('/:id', validateMongoID, viewOneProduct);
productRouter.get('/', getAllProducts);

export default productRouter;
