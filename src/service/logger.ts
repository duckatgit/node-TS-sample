import winston, { format, Logger } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";

// Logs directory
const logDir = "logs";

// Helper to get the filename from the call stack
const getFileName = (): string => {
  const stack = new Error().stack?.split("\n") || [];
  // stack[0] = Error
  // stack[1] = at getFileName (filename:line:col)
  // stack[2] = at caller (filename:line:col)
  const callerLine = stack[3] || stack[2] || "";
  const match = callerLine.match(/\(([^)]+)\)/);
  if (match && match[1]) {
    return path.basename(match[1].split(":")[0]);
  }
  return "unknown";
};

// Log format including timestamp, level, filename, and message
const logFormat = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.printf(({ timestamp, level, message }) => {
    const fileName = getFileName();
    return `${timestamp} [${level.toUpperCase()}] [${fileName}]: ${message}`;
  })
);

const transport = new DailyRotateFile({
  filename: path.join(logDir, "app-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
});

// Create logger
const logger: Logger = winston.createLogger({
  level: "info",
  format: logFormat,
  transports: [
    transport,
    new winston.transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
  ],
});

export default logger;
