import mongoose from 'mongoose';

// Define the Newsletter Schema Model
// With email field

const newsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Newsletter = mongoose.model('Newsletter', newsletterSchema);

export default Newsletter;
