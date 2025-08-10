// scripts/log-errors.js
import fs from 'fs';
const logPath = 'logs/error.log';

if (!fs.existsSync('logs')) fs.mkdirSync('logs');

process.on('uncaughtException', (err) => {
  const logEntry = `\n[${new Date().toISOString()}] Uncaught Exception:\n${err.stack}\n`;
  fs.appendFileSync(logPath, logEntry);
  console.error('🚨 Error logged:', err.message);
});

console.log('📡 QMOI Error logger activated. Listening for crashes...');
