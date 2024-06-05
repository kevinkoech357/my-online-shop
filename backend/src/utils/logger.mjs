import { createLogger, transports, format } from 'winston';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import 'winston-daily-rotate-file';
import fs from 'fs/promises'; // Import fs.promises for async file system operations

// Get current file and directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set log directory path
const logDirPath = path.join(__dirname, '..', 'logs');

// Create the logs directory asynchronously if it doesn't exist
async function createLogsDirectory () {
  try {
    await fs.mkdir(logDirPath, { recursive: true });
  } catch (error) {
    console.error(`Error creating logs directory: ${error}`);
  }
}

createLogsDirectory(); // Call the function to create logs directory

// Configure Winston logger
const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }), // Include stack traces for errors
    format.json()
  ),
  transports: [
    // Log to a file with daily rotation
    new transports.DailyRotateFile({
      filename: `${logDirPath}/mos-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m', // Maximum log file size (20MB)
      maxFiles: '7d' // Keep logs for a week
    })
  ],
  exceptionHandlers: [
    new transports.File({ filename: `${logDirPath}/exceptions.log` }) // Log exceptions to a separate file
  ]
});

// If NOT in production then log to the `console` with the format:
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.combine(
      format.colorize(),
      format.simple()
    )
  }));
}

// Handle unhandled exceptions and rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
});

process.on('uncaughtException', (error) => {
  logger.error(`Uncaught Exception: ${error}`);
  process.exit(1); // Exit the process
});

export default logger;
