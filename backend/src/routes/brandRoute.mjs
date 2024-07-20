import express from "express";
import { getAllBrands, viewOneBrand } from "../controller/brandCtrl.mjs";
import validateMongoID from "../middlewares/validateMongoID.mjs";

const brandRouter = express.Router();

// Brand related open/public routes
brandRouter.get("/", getAllBrands);
brandRouter.get("/:id", validateMongoID, viewOneBrand);

export default brandRouter;
