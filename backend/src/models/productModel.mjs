import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

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
    type: Array,
    default: ['https://asset.cloudinary.com/dndbt307f/50e6884448b201deb55c4fd0160f4b84']
  },
  color: {
    type: String,
    required: true
  },
  ratings: [
    {
      star: Number,
      comment: String,
      postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }
  ],
  totalRating: {
    type: String,
    default: 0
  }

}, { timestamps: true });

// Apply the mongoose-paginate-v2 plugin to the product schema
productSchema.plugin(mongoosePaginate);

const Product = mongoose.model('Product', productSchema);

export default Product;
