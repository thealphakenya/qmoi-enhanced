// scripts/qmoi-master-debugger.js

import { execSync } from 'child_process';
import axios from 'axios';

function runCheck(command, label) {
  try {
    console.log(`\n🔍 Checking ${label}...`);
    const output = execSync(command, { encoding: 'utf-8' });
    console.log(`✅ ${label} OK:\n${output.trim()}`);
    return `✅ ${label}: ${output.trim()}`;
  } catch (err) {
    console.error(`❌ ${label} FAILED:\n${err.message}`);
    return `❌ ${label}: ${err.message}`;
  }
}

function sendTelegramReport(message) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) {
    console.warn("⚠️ Telegram report skipped: missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID in environment.");
    return;
  }

  axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    chat_id: chatId,
    text: message,
    parse_mode: "Markdown"
  })
  .then(() => console.log("📤 Telegram report sent successfully."))
  .catch(e => console.warn("❌ Failed to send Telegram report:", e.message));
}

console.log('🧠 QMOI Master Debugger Starting...\n');

const checks = [
  ['node -v', 'Node.js Version'],
  ['npm -v', 'npm Version'],
  ['npm config get msvs_version', 'MSVS Version (Visual Studio)'],
  ['npx node-gyp configure', 'node-gyp Configuration'],
  ['npm rebuild', 'Native Module Rebuild'],
  ['python --version', 'Python 3+ Check'],
  ['where electron', 'Electron Installed (Windows)'],
  ['which electron', 'Electron Installed (Unix)'],
  ['where code', 'VSCode Installed (Windows)'],
  ['which code', 'VSCode Installed (Unix)']
];

const results = [];

for (const [cmd, label] of checks) {
  const result = runCheck(cmd, label);
  results.push(result);
}

const summary = `🧠 *QMOI Debug Summary*\n\n${results.join("\n")}`;
console.log(`\n${summary}`);
sendTelegramReport(summary);
