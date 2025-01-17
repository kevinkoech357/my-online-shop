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
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(helmet()); // Set security HTTP headers

const allowedOrigins = [
	"https://localhost:5173",
	"http://localhost:5173",
	"https://myonlineshop.kevinkoech.site",
	"https://myonlineshop-backend.kevinkoech.site",
];

app.use(
	cors({
		origin: (origin, callback) => {
			// Check if the request origin is in the allowedOrigins array
			if (allowedOrigins.includes(origin) || !origin) {
				callback(null, true);
			} else {
				callback(new Error("Not allowed by CORS"));
			}
		},
		credentials: true, // Allow cookies to be sent with the request
	}),
);

app.use(morgan("dev")); // HTTP request logger
app.use(compression()); // Compress response bodies

// Set trust proxy to 2 because we have two proxies: Cloudflare -> Nginx -> Your App
app.set("trust proxy", 2);

// Create a limiter with Cloudflare-specific configurations
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per window
	standardHeaders: true,
	legacyHeaders: false,

	// Custom key generator to use CF-Connecting-IP if available
	keyGenerator: (request) => {
		// Prefer the CF-Connecting-IP header (set by Cloudflare)
		return request.header("CF-Connecting-IP") || request.ip || request.headers["x-forwarded-for"]?.split(",")[0] || request.socket.remoteAddress;
	},
});

app.use(limiter);

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
			secure: true, // Set to true in production when using HTTPS
			httpOnly: true, // Prevent client-side access
			sameSite: "none", // Prevent CSRF attacks
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
