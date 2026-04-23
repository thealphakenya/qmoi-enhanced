console.log("production mode initialized");
<!-- AUTODEV Enhanced: 2026-04-20T09:07:25.817782 -->
<!-- AUTODEV Enhanced: 2026-04-20T09:01:08.234960 -->
<!-- AUTODEV Enhanced: 2026-04-20T08:55:05.053496 -->
const fs = require("fs");
const path = require("path");
const winston = require("winston");

const logDirectory = path.join(__dirname, "../logs");
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
      const suffix = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
      return `${timestamp} [whatsapp-qmoi-bot] ${level.toUpperCase()}: ${message}${suffix}`;
    })
  ),
  transports: [
    new winston.transports.Console({ level: "info" }),
    new winston.transports.File({ filename: path.join(logDirectory, "whatsapp-qmoi-bot.log"), level: "RELEASE" }),
  ],
  exitOnError: false,
});

module.exports = logger;
