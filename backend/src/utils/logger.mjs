import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import config from "../config.mjs";
import createDirectory from "./createDirectory.mjs";

// Get current file and directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set log directory path
const logDirPath = path.join(__dirname, "..", "logs");

// Create the logs directory asynchronously if it doesn't exist
await createDirectory(logDirPath);

// Configure Winston logger
const logger = createLogger({
	level: config.logLevel,
	format: format.combine(
		format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
		format.errors({ stack: true }), // Include stack traces for errors
		format.json(),
	),
	transports: [
		// Log to a file with daily rotation
		new DailyRotateFile({
			filename: `${logDirPath}/mos-%DATE%.log`,
			datePattern: "YYYY-MM-DD",
			zippedArchive: true,
			maxSize: "20m", // Maximum log file size (20MB)
			maxFiles: "7d", // Keep logs for a week
		}),
	],
	exceptionHandlers: [
		new transports.File({ filename: `${logDirPath}/exceptions.log` }), // Log exceptions to a separate file
	],
});

// If NOT in production then log to the `console` with the format:
if (config.nodeEnv !== "production") {
	logger.add(
		new transports.Console({
			format: format.combine(format.colorize(), format.simple()),
		}),
	);
}

// Handle unhandled exceptions and rejections
process.on("unhandledRejection", (reason, promise) => {
	logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
});

process.on("uncaughtException", (error) => {
	logger.error(`Uncaught Exception: ${error}`);
	process.exit(1); // Exit the process
});

export default logger;
