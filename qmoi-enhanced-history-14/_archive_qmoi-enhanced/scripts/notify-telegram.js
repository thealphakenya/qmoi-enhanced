// scripts/notify-telegram.js
require("dotenv").config();
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_IDS = (process.env.TELEGRAM_CHAT_IDS || "")
  .split(",")
  .map((id) => id.trim())
  .filter(Boolean);
const RELEASE_JSON_PATH = path.resolve("release.json");
const FILES_DIR = path.resolve("Qmoi_apps");

if (!TELEGRAM_BOT_TOKEN || CHAT_IDS.length === 0) {
  console.warn(
    "⚠️ Telegram notification skipped: missing TELEGRAM_BOT_TOKEN or CHAT_IDS",
  );
  process.exit(0);
}

// Prepare release info
let changelog = "*QMOI AI auto-release complete.*";
let releaseTitle = "QMOI Auto Release";
if (fs.existsSync(RELEASE_JSON_PATH)) {
  const release = JSON.parse(fs.readFileSync(RELEASE_JSON_PATH, "utf-8"));
  releaseTitle = release.title || release.version || releaseTitle;
  changelog = `*${release.title}*\n\n${release.changelog || ""}`;
}

const timestamp = new Date().toLocaleString();
const releaseURL = `https://github.com/thealphakenya/Alpha-Q-ai/releases`;

const message = `
🚀 *QMOI AI Release*
🗓️ ${timestamp}

${changelog}

📎 _Builds ready for all platforms:_
✅ Android, iOS, Windows, macOS, Linux, Pi, QCity

🔗 [View Release](${releaseURL})
`;

// Send message to each chat
async function sendMessageToAll() {
  for (const chat_id of CHAT_IDS) {
    try {
      await axios.post(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          chat_id,
          text: message,
          parse_mode: "Markdown",
        },
      );
      console.log(`✅ Message sent to chat ${chat_id}`);
    } catch (err) {
      console.warn(
        `❌ Failed to send message to ${chat_id}:`,
        err?.response?.data || err.message,
      );
    }
  }
}

// Attach files (zip, exe, apk, ipa, etc.)
async function sendFilesToAll() {
  const allowedExts = [".zip", ".apk", ".exe", ".ipa", ".appimage", ".dmg"];
  const platforms = fs.readdirSync(FILES_DIR);

  for (const platform of platforms) {
    const files = fs.readdirSync(path.join(FILES_DIR, platform));
    for (const file of files) {
      const fullPath = path.join(FILES_DIR, platform, file);
      const ext = path.extname(file).toLowerCase();
      if (!allowedExts.includes(ext)) continue;

      const form = new FormData();
      form.append("chat_id", CHAT_IDS[0]); // Send to first chat only for now
      form.append("document", fs.createReadStream(fullPath));

      try {
        await axios.post(
          `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`,
          form,
          {
            headers: form.getHeaders(),
          },
        );
        console.log(`📦 Sent: ${file}`);
      } catch (err) {
        console.warn(
          `❌ Error uploading ${file}:`,
          err?.response?.data || err.message,
        );
      }
    }
  }
}

// Image preview (optional): Send a default logo or banner
async function sendImagePreview() {
  const previewImage = path.resolve("assets/qmoi-preview.jpg"); // Optional banner
  if (!fs.existsSync(previewImage)) return;

  const form = new FormData();
  form.append("chat_id", CHAT_IDS[0]);
  form.append("photo", fs.createReadStream(previewImage));
  form.append("caption", `🚀 *QMOI Preview*\nAuto-release completed.`, "utf-8");

  try {
    await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`,
      form,
      {
        headers: form.getHeaders(),
      },
    );
    console.log(`🖼️ Preview image sent.`);
  } catch (err) {
    console.warn(
      `⚠️ Failed to send preview image:`,
      err?.response?.data || err.message,
    );
  }
}

// Run full sequence
(async () => {
  await sendMessageToAll();
  await sendImagePreview();
  await sendFilesToAll();
})();
