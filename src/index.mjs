import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { connectToMongoDB } from './config/db.connect.mjs';
import router from './routes/authRoute.mjs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import cors from 'cors';

// Load environment variables
dotenv.config();
const PORT = process.env.PORT || 3300;

// Initialize Express application
const app = express();

// Connect to MongoDB
connectToMongoDB();

// Enable CORS for all routes
app.use(cors());

// Set up middleware for parsing request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Mount the authentication router on the /api/v1 path
app.use('/api/v1', router);

// Get current file and directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load Swagger YAML file
const swaggerDocument = YAML.load(resolve(__dirname, '..', 'swagger.yaml'));

// Serve Swagger UI with the Swagger document
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Start the server on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
