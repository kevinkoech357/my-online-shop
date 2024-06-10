import mongoose from 'mongoose';

// Define the Blog Schema Model
// With Title, content, category and Author fields

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  author: {
    type: String,
    default: 'Admin'
  },
  images: {
    type: Array,
    default: ['https://asset.cloudinary.com/dndbt307f/3b1d0d8addfb951c92049204d0a9e27f']
  }
}, { timestamps: true });

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
