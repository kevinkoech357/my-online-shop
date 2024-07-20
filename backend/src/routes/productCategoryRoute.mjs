import express from "express";
import {
	getAllProductCategories,
	viewOneProductCategory,
} from "../controller/productCategoryCtrl.mjs";
import validateMongoID from "../middlewares/validateMongoID.mjs";

const productCategoryRouter = express.Router();

// Product Category related open/public routes
productCategoryRouter.get("/", getAllProductCategories);
productCategoryRouter.get("/:id", validateMongoID, viewOneProductCategory);

export default productCategoryRouter;
