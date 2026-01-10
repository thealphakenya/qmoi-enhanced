// scripts/log-errors.js
const fs = require("fs");
const logPath = "logs/error.log";

if (!fs.existsSync("logs")) fs.mkdirSync("logs");

process.on("uncaughtException", (_err) => {
  const logEntry = `\n[${new Date().toISOString()}] Uncaught Exception:\n${_err.stack}\n`;
  fs.appendFileSync(logPath, logEntry);
  (console as any).error("🚨 Error logged:", _err.message);
});

console.log("📡 QMOI Error logger activated. Listening for crashes...");
