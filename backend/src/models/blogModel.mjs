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
  }
}, { timestamps: true });

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
