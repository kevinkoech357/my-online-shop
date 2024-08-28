import express from "express";
import { subscibeToNewsletter, unsubscribeFromNewsletter } from "../controller/newsletterCtrl.mjs";
import { checkRequiredFields } from "../middlewares/validateBody.mjs";

const newsletterRouter = express.Router();

const newsletterField = ["email"];

// Register path
newsletterRouter.post("/subscribe", checkRequiredFields(newsletterField), subscibeToNewsletter);
newsletterRouter.delete("/unsubscribe", checkRequiredFields(newsletterField), unsubscribeFromNewsletter);

export default newsletterRouter;
