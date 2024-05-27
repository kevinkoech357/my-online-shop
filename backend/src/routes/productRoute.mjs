import express from 'express';
import { viewOneProduct, getAllProducts } from '../controller/productCtrl.mjs';

const productRouter = express.Router();

// Product related open/public routes
productRouter.get('/:id', viewOneProduct);
productRouter.get('/', getAllProducts);

export default productRouter;
