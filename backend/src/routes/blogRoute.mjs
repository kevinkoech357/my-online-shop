import express from 'express';
import validateMongoID from '../middlewares/validateMongoID.mjs';
import { viewOneBlog, getAllBlogs } from '../controller/blogCtrl.mjs';

const blogRouter = express.Router();

// Blog related open/public routes
blogRouter.get('/', getAllBlogs);
blogRouter.get('/:id', validateMongoID, viewOneBlog);

export default blogRouter;
