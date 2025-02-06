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
import connectToMongoDB from "./config/db.connect.mjs";
import { JSONErrorHandler, errorHandler, notFoundHandler } from "./middlewares/errorHandler.mjs";
import routes from "./routes/routes.mjs";

const app = express();

// Connect to MongoDB
connectToMongoDB();

// Define allowed origins based on environment
const allowedOrigins = [
	"http://localhost:5173", // Vite dev server
	"http://127.0.0.1:5173", // Alternative local address
	"https://myonlineshop.kevinkoech.site",
	"https://myonlineshop-backend.kevinkoech.site",
	"http://127.0.0.1:7000",
].filter(Boolean);

// CORS configuration with proper error handling
const corsOptions = {
	origin: (origin, callback) => {
		// Allow requests with no origin (like mobile apps or curl requests)
		if (!origin || allowedOrigins.includes(origin)) {
			callback(null, true);
		} else {
			callback(new Error("CORS: Request origin is not allowed"));
		}
	},
	credentials: true, // Allow credentials
	methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
	exposedHeaders: ["set-cookie"],
	maxAge: 86400, // Cache preflight requests for 24 hours
};

// Security middleware configuration
const securityMiddleware = [
	// CORS config
	cors(corsOptions),

	// Helmet with CSP configuration
	helmet({
		contentSecurityPolicy: {
			directives: {
				defaultSrc: ["'self'"],
				scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
				styleSrc: ["'self'", "'unsafe-inline'"],
				imgSrc: ["'self'", "data:", "https:"],
				connectSrc: ["'self'", ...allowedOrigins],
				frameSrc: ["'none'"],
				objectSrc: ["'none'"],
				upgradeInsecureRequests: [],
			},
		},
		crossOriginEmbedderPolicy: false, // Might need to be false depending on your requirements
		crossOriginResourcePolicy: { policy: "cross-origin" },
		crossOriginOpenerPolicy: { policy: "same-origin" },
	}),

	// Logging
	morgan("dev"),

	// Parse JSON and URL-encoded bodies
	express.json({ limit: "10mb" }),
	express.urlencoded({ extended: true, limit: "10mb" }),

	// Compression
	compression(),
];

// Apply security middleware
for (const middleware of securityMiddleware) {
	app.use(middleware);
}

// Rate limiting configuration
const rateLimitConfig = {
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per window
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers

	// Use Cloudflare's IP if available
	keyGenerator: (request) => {
		return request.header("CF-Connecting-IP") || request.ip || request.headers["x-forwarded-for"]?.split(",")[0] || request.socket.remoteAddress;
	},

	// Custom error handler
	handler: (req, res) => {
		res.status(429).json({
			error: "Too many requests, please try again later.",
			retryAfter: Math.ceil(windowMs / 1000 / 60), // minutes
		});
	},
};

app.set("trust proxy", 2); // Trust Cloudflare -> Nginx -> App
app.use(rateLimit(rateLimitConfig));

// Session configuration
const sessionConfig = {
	secret: config.sessionSecret,
	name: "sessionId", // Custom cookie name
	saveUninitialized: false, // Don't create session until something stored
	resave: false, // Don't save session if unmodified
	rolling: true, // Reset maxAge on every response
	cookie: {
		maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
		httpOnly: true, // Prevent client-side access to the cookie
		secure: process.env.NODE_ENV === "production", // Require HTTPS in production
		sameSite: "none", // CSRF protection
		domain:
			process.env.NODE_ENV === "production"
				? ".kevinkoech.site" // Allow sharing between subdomains
				: undefined,
	},
	store: MongoStore.create({
		mongoUrl: config.mongoDbUrl,
		ttl: 14 * 24 * 60 * 60, // 14 days in seconds
		crypto: {
			secret: config.sessionSecret, // Encrypt session data
		},
		touchAfter: 24 * 3600, // Update only once in 24 hours
	}),
};

app.use(cookieParser(config.cookieSecret));
app.use(session(sessionConfig));

// API routes
const API_V1_PREFIX = "/api/v1";
for (const [name, router] of Object.entries(routes)) {
	app.use(`${API_V1_PREFIX}/${name}`, router);
}

// Swagger documentation
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const swaggerDocument = YAML.load(resolve(__dirname, "..", "swagger.yaml"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Error handling
app.use(JSONErrorHandler);
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const port = config.port || 7000;
app.listen(port, () => {
	console.log(`Server running at http://127.0.0.1:${port}/api-docs`);
	console.log(`Environment: ${process.env.NODE_ENV}`);
});
