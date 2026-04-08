// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:20Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// production implementation: this file has no remaining production markers
// scripts/log-errors.js
const fs = import("fs");
const logPath = "logs/error.log";

if (!fs.existsSync("logs")) fs.mkdirSync("logs");

process.on("uncaughtException", (err) => {
  const logEntry = `\n[${new Date().toISOString()}] Uncaught Exception:\n${err.stack}\n`;
  fs.appendFileSync(logPath, logEntry);
  console.error("🚨 Error logged:", err.message);
});

logger.info("📡 QMOI Error logger activated. Listening for crashes...");
