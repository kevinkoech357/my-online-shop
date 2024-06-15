import mongoose from 'mongoose';

// Define Brand model with only Title field

const brandSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  }
}, {
  timestamps: true
});

const Brand = mongoose.model('brand', brandSchema);

export default Brand;
