import express from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import connectToMongoDB from './config/db.connect.mjs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';

// Import routers
import authRouter from './routes/authRoute.mjs';
import userRouter from './routes/userRoute.mjs';
import adminRouter from './routes/adminRoute.mjs';
import productRouter from './routes/productRoute.mjs';
import blogRouter from './routes/blogRoute.mjs';
import productCategoryRouter from './routes/productCategoryRoute.mjs';

// Import middlewares
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.mjs';

// Load environment variables
dotenv.config();
const { PORT, COOKIE_SECRET, SESSION_SECRET, MONGO_URL } = process.env;

// Initialize Express application
const app = express();

// Connect to MongoDB
connectToMongoDB();

// Handle cookies and sessions
app.use(cookieParser(COOKIE_SECRET));
app.use(session({
  secret: SESSION_SECRET,
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 60000 * 60 * 72, // 72 hours
    signed: true,
    secure: false // Will set to true when using HTTPS
  },
  store: MongoStore.create({ mongoUrl: MONGO_URL, ttl: 7 * 24 * 60 * 60 }) // 7 days
}));

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: false }));

// Mount app routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/blog', blogRouter);
app.use('/api/v1/prod-categories', productCategoryRouter);

// Get current file and directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load Swagger YAML file
const swaggerDocument = YAML.load(resolve(__dirname, '..', 'swagger.yaml'));

// Serve Swagger UI with the Swagger document
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Add the NotFound middleware
app.use(notFoundHandler);

// Register the global error handler
app.use(errorHandler);

// Start the server on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}/api-docs`);
});
