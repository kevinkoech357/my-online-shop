import mongoose from 'mongoose';

// Define productSchema for the Product Model

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    lowercase: true,
    unique: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  sold: {
    type: Number,
    default: 0
  },
  images: {
    type: Array
  },
  color: {
    type: String,
    required: true
  },
  rating: [
    {
      star: Number,
      postedby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }
  ]

}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

export default Product;
