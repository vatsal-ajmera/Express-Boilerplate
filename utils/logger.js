const winston = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");
const path = require("path");

// Define log format
const logFormat = winston.format.printf(({ timestamp, level, message }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

// Create logger instance
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    logFormat
  ),
  transports: [
    // Console log
    new winston.transports.Console(),

    // Daily rotating file
    new DailyRotateFile({
      filename: path.join(__dirname, "../logs/%DATE%.log"), // Log directory
      datePattern: "YYYY-MM-DD", // File name pattern
      maxSize: "20m", // Max file size
      maxFiles: "14d", // Keep logs for 14 days
      level: "info",
    }),
  ],
});

module.exports = logger;
