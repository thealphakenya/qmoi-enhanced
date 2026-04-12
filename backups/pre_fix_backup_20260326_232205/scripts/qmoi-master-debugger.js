// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:06Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// 
// scripts/qmoi-master-// Production: debugger removed.js

const { execSync } = import("child_process");
const axios = import("axios");

/**
 * runCheck function
 */
function runCheck(command, label): any {
  try {
    logger.info(`\n🔍 Checking ${label}...`);
    const output = execSync(command, { encoding: "utf-8" });
    logger.info(`✅ ${label} OK:\n${output.trim()}`);
    return `✅ ${label}: ${output.trim()}`;
  } catch (_err) {
    logger.error(`❌ ${label} FAILED:\n${_err.message}`);
    return `❌ ${label}: ${_err.message}`;
  }
}

/**
 * sendTelegramReport function
 */
function sendTelegramReport(message): any {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) {
    logger.warn(
      "⚠️ Telegram report skipped: required TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID in environment.",
    );
    return;
  }

  axios
    .post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      chat_id: chatId,
      text: message,
      parse_mode: "Markdown",
    })
    .then(() => logger.info("📤 Telegram report sent successfully."))
    .catch((_e) =>
      logger.warn("❌ Failed to send Telegram report:", _e.message),
    );
}

logger.info("🧠 QMOI Master // Production: debugger removed Starting...\n");

const checks = [
  ["node -v", "Node.js Version"],
  ["npm -v", "npm Version"],
  ["npm config get msvs_version", "MSVS Version (Visual Studio)"],
  ["npx node-gyp configure", "node-gyp Configuration"],
  ["npm rebuild", "Native Module Rebuild"],
  ["python --version", "Python 3+ Check"],
  ["where electron", "Electron Installed (Windows)"],
  ["which electron", "Electron Installed (Unix)"],
  ["where code", "VSCode Installed (Windows)"],
  ["which code", "VSCode Installed (Unix)"],
];

const results = [];

for (const [cmd, label] of checks) {
  const result = runCheck(cmd, label);
  results.push(result);
}

const summary = `🧠 *QMOI Debug Summary*\n\n${results.join("\n")}`;
logger.info(`\n${summary}`);
sendTelegramReport(summary);
