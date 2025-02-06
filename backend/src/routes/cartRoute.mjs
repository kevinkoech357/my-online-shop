import express from "express";

import isAuthenticated from "../middlewares/userStatus.mjs";
import validateMongoID from "../middlewares/validateMongoID.mjs";

import { clearCart, createOrUpdateCart, getUserCart, removeProductFromCart } from "../controller/cartCtrl.mjs";

const cartRouter = express.Router();

cartRouter.post("/create", isAuthenticated, createOrUpdateCart);
cartRouter.get("/", isAuthenticated, getUserCart);
cartRouter.delete("/clear", isAuthenticated, clearCart);
cartRouter.patch("/remove/:id", validateMongoID, isAuthenticated, removeProductFromCart);

export default cartRouter;
