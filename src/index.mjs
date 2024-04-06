import express from 'express';
import dotenv from 'dotenv';
import swagger from './swagger.mjs';

// Load environment variables
// If not existent, use port 3300
dotenv.config();
const PORT = process.env.PORT || 3300;

// Load Express
const app = express();

// Generate API documentation
swagger(app);

// Start server on specified port
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
