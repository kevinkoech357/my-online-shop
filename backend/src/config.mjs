import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const config = {
	// General App Settings
	mongoDbUrl: process.env.MONGO_DB_URL,
	sessionSecret: process.env.SESSION_SECRET,
	cookieSecret: process.env.COOKIE_SECRET,
	port: process.env.PORT || 3000, // Default port if not specified
	nodeEnv: process.env.NODE_ENV || "development", // Default environment
	logLevel: process.env.LOG_LEVEL || "info", // Default log level

	// Admin Settings
	adminEmail: process.env.ADMIN_EMAIL,
	adminPassword: process.env.ADMIN_PASSWORD,
	adminPhone: process.env.ADMIN_PHONE,

	// Cloudinary Settings
	cloudinary: {
		name: process.env.CLOUDINARY_NAME,
		apiKey: process.env.CLOUDINARY_API_KEY,
		apiSecret: process.env.CLOUDINARY_API_SECRET,
		folder: process.env.CLOUDINARY_FOLDER,
	},

	// Mail Settings
	mail: {
		username: process.env.MAIL_USERNAME,
		password: process.env.MAIL_PASSWORD,
		server: process.env.MAIL_SERVER,
		defaultSender: process.env.MAIL_DEFAULT_SENDER,
	},

	// Company Settings
	companyEmail: process.env.COMPANY_EMAIL,
};

export default config;
