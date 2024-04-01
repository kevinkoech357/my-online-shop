import express from 'express';
import dotenv from 'dotenv';

// Load environment variables
// If not existant, use 3300
dotenv.config();
const PORT = process.env.PORT || 3300;

const app = express();

// Start server on specified port
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
