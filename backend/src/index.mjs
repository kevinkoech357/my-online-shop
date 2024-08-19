import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import compression from "compression";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import connectToMongoDB from "./config/db.connect.mjs";

// Import middlewares
import { JSONErrorHandler, errorHandler, notFoundHandler } from "./middlewares/errorHandler.mjs";

// Import routers
import adminRouter from "./routes/adminRoute.mjs";
import authRouter from "./routes/authRoute.mjs";
import blogRouter from "./routes/blogRoute.mjs";
import brandRouter from "./routes/brandRoute.mjs";
import locationRouter from "./routes/locationRoute.mjs";
import newsletterRouter from "./routes/newsletterRoute.mjs";
import orderRouter from "./routes/orderRoute.mjs";
import productCategoryRouter from "./routes/productCategoryRoute.mjs";
import productRouter from "./routes/productRoute.mjs";
import userRouter from "./routes/userRoute.mjs";

// Load environment variables
dotenv.config();
const { PORT, COOKIE_SECRET, SESSION_SECRET, MONGO_URL } = process.env;

// Initialize Express application
const app = express();

// Connect to MongoDB
connectToMongoDB();

// Security middlewares
app.use(helmet());

// Compression middleware
app.use(compression());

// Handle cookies and sessions
app.use(cookieParser(COOKIE_SECRET));
app.use(
	session({
		secret: SESSION_SECRET,
		saveUninitialized: false,
		resave: false,
		cookie: {
			maxAge: 60000 * 60 * 72, // 72 hours
			signed: true,
			secure: false, // Will set to true when using HTTPS
		},
		store: MongoStore.create({ mongoUrl: MONGO_URL, ttl: 7 * 24 * 60 * 60 }), // 7 days
	}),
);

// Enable CORS for all routes
app.use(cors({ credentials: true }));

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: false }));

// Mount app routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/blog", blogRouter);
app.use("/api/v1/prod-categories", productCategoryRouter);
app.use("/api/v1/brands", brandRouter);
app.use("/api/v1/locations", locationRouter);
app.use("/api/v1/newsletter", newsletterRouter);

// Get current file and directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load Swagger YAML file
const swaggerDocument = YAML.load(resolve(__dirname, "..", "swagger.yaml"));

// Serve Swagger UI with the Swagger document
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Add JSONError middleware
app.use(JSONErrorHandler);

// Add the NotFound middleware
app.use(notFoundHandler);

// Register the global error handler
app.use(errorHandler);

// Start the server on the specified port
app.listen(PORT, () => {
	console.log(`Server is running on http://127.0.0.1:${PORT}/api-docs`);
});
