import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import compression from "compression";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { rateLimit } from "express-rate-limit";
import session from "express-session";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

import config from "./config.mjs";
// Import db connection, app config and middlewares
import connectToMongoDB from "./config/db.connect.mjs";
import { JSONErrorHandler, errorHandler, notFoundHandler } from "./middlewares/errorHandler.mjs";

// Import all routes from a single file
import routes from "./routes/routes.mjs";

// Initialize Express application
const app = express();

// Connect to MongoDB
connectToMongoDB();

// Basic middleware setup
app.use(express.json()); // Parse JSON
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(helmet()); // Set security HTTP headers

const allowedOrigins = [
	"http://127.0.0.1:5173",
	"http://localhost:5173",
	"http://127.0.0.1:7000",
	"http://165.22.213.236:7000",
	"https://myonlineshop-backend.kevinkoech.tech",
];

// Custom CORS options delegate function
const corsOptionsDelegate = (req, callback) => {
	let corsOptions;
	if (allowedOrigins.indexOf(req.header("Origin")) !== -1) {
		corsOptions = {
			origin: true,
			methods: ["GET", "POST", "PUT", undefined, "PATCH", "DELETE"],
			allowedHeaders: ["Content-Type", "Authorization"],
			credentials: true,
		}; // reflect (enable) the requested origin in the CORS response
	} else {
		corsOptions = { origin: false }; // disable CORS for this request
	}
	callback(null, corsOptions);
};

// Use the custom CORS options delegate
app.use(cors(corsOptionsDelegate));

app.use(morgan("dev")); // HTTP request logger
app.use(compression()); // Compress response bodies

// // Rate limiting
// const limiter = rateLimit({
// 	windowMs: 15 * 60 * 1000, // 15 minutes
// 	max: 100, // Limit each IP to 100 requests per windowMs
// 	standardHeaders: true,
// 	legacyHeaders: false,
// });

// app.use(limiter);

// Handle cookies and sessions
app.use(cookieParser(config.cookieSecret));
app.use(
	session({
		secret: config.sessionSecret,
		saveUninitialized: false,
		resave: false,
		cookie: {
			maxAge: 1000 * 60 * 60 * 24 * 14, // 14 days in milliseconds
			signed: true,
			secure: false, // Set to true in production when using HTTPS
			httpOnly: true, // Prevent client-side access
			sameSite: "lax", // Prevent CSRF attacks
		},
		store: MongoStore.create({
			mongoUrl: config.mongoDbUrl,
			ttl: 14 * 24 * 60 * 60, // 14 days in seconds
		}),
	}),
);

// Mount app routes
const API_V1_PREFIX = "/api/v1";
for (const [name, router] of Object.entries(routes)) {
	app.use(`${API_V1_PREFIX}/${name}`, router);
}

// Set up Swagger UI
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const swaggerDocument = YAML.load(resolve(__dirname, "..", "swagger.yaml"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Error handling middlewares
app.use(JSONErrorHandler);
app.use(notFoundHandler);
app.use(errorHandler);

// Start the server
app.listen(config.port, () => {
	console.log(`Server is running on http://127.0.0.1:${config.port}/api-docs`);
});
