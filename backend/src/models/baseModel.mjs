import mongoose from 'mongoose';

// Define the base schema with common fields
const baseSchema = new mongoose.Schema({}, { timestamps: true });

const BaseModel = mongoose.model('BaseModel', baseSchema);

export default BaseModel;
