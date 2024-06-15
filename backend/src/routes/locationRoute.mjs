import express from 'express';
import validateMongoID from '../middlewares/validateMongoID.mjs';
import { getAllLocations, viewOneLocation } from '../controller/locationCtrl.mjs';

const locationRouter = express.Router();

// Location related open/public routes
locationRouter.get('/', getAllLocations);
locationRouter.get('/:id', validateMongoID, viewOneLocation);

export default locationRouter;
