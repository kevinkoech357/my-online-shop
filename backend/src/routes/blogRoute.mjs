import express from "express";
import { getAllBlogs, viewOneBlog } from "../controller/blogCtrl.mjs";
import validateMongoID from "../middlewares/validateMongoID.mjs";

const blogRouter = express.Router();

// Blog related open/public routes
blogRouter.get("/", getAllBlogs);
blogRouter.get("/:id", validateMongoID, viewOneBlog);

export default blogRouter;
