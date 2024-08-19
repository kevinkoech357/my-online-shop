import express from "express";

import isAuthenticated from "../middlewares/userStatus.mjs";
import { checkRequiredFields } from "../middlewares/validateBody.mjs";

import { createNewOrder, myOrders } from "../controller/orderCtrl.mjs";

const orderRouter = express.Router();

// Required field to create a new order
const newOrderField = ["paymentMethod"];

// Authenticated user routes
orderRouter.post("/create", checkRequiredFields(newOrderField), isAuthenticated, createNewOrder);
orderRouter.get("/", isAuthenticated, myOrders);

export default orderRouter;
