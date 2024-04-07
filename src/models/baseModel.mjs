import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

// Define the base schema with common fields
const baseSchema = new mongoose.Schema({
  // Use nanoid for generating IDs
  _id: {
    type: String,
    default: () => nanoid()
  }
}, {
  timestamps: true
});

const BaseModel = mongoose.model('BaseModel', baseSchema);

export default BaseModel;
