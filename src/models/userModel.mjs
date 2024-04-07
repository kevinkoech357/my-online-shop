import mongoose from 'mongoose';
import BaseModel from './baseModel.mjs';

// Define schema for the user model, inheriting from the base model
const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: Number,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

// Inherit from BaseModel
const User = BaseModel.discriminator('User', userSchema);

export default User;
