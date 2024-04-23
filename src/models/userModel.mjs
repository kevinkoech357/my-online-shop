import mongoose from 'mongoose';
import BaseModel from './baseModel.mjs';

// Define schema for the user model, inheriting from the base model
const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    trim: true
  },
  lastname: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  phone: {
    type: Number,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  verified: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: false
  }
});

// Inherit from BaseModel
const User = BaseModel.discriminator('User', userSchema);

export default User;
