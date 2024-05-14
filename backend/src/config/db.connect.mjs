import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const connectToMongoDB = async () => {
  const dbURL = process.env.MONGO_URL;

  if (!dbURL) {
    console.log('No DB_URL ENV VAR Set!!');
    return;
  }

  try {
    await mongoose.connect(dbURL);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

export default connectToMongoDB;
