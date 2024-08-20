import express from "express";

import isAuthenticated from "../middlewares/userStatus.mjs";
import { checkRequiredFields } from "../middlewares/validateBody.mjs";
import validateMongoID from "../middlewares/validateMongoID.mjs";

import { cancelMyOrder, createNewOrder, myOrders, viewOneOrder } from "../controller/orderCtrl.mjs";

const orderRouter = express.Router();

// Required field to create a new order
const newOrderField = ["paymentMethod", "deliveryAddress", "county", "town", "deliveryNotes"];

// Authenticated user routes
orderRouter.post("/create", checkRequiredFields(newOrderField), isAuthenticated, createNewOrder);
orderRouter.get("/", isAuthenticated, myOrders);
orderRouter.get("/:id", isAuthenticated, validateMongoID, viewOneOrder);
orderRouter.patch("/cancel/:id", isAuthenticated, validateMongoID, cancelMyOrder);

export default orderRouter;
