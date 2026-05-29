const fs = require("fs");
const path = require("path");
const logger = require("../logger");
const { downloadContentFromMessage } = require("@whiskeysockets/baileys");

const mediaTypeMapping = {
  imageMessage: "image",
  videoMessage: "video",
  audioMessage: "audio",
  documentMessage: "document",
  stickerMessage: "sticker",
};

function ensureDirectory(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function downloadMedia(message, mediaType) {
  const stream = await downloadContentFromMessage(message, mediaType);
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

function inferExtension(message, defaultExt = ".bin") {
  const mimetype = message.mimetype || "";
  const extFromMime = mimetype.split("/")[1];
  if (extFromMime) {
    return `.${extFromMime.split(";")[0]}`;
  }
  if (message.fileName) {
    return path.extname(message.fileName) || defaultExt;
  }
  return defaultExt;
}

module.exports = async function handleMedia(sock, msg) {
  const messageType = Object.keys(msg.message)[0];
  const mediaType = mediaTypeMapping[messageType];
  if (!mediaType) {
    logger.warn("Unsupported media message type", { messageType });
    return;
  }

  try {
    const messagePayload = msg.message[messageType];
    const mediaBuffer = await downloadMedia(messagePayload, mediaType);
    const caption = messagePayload.caption || "";
    const extension = inferExtension(messagePayload, ".dat");

    const archiveDir = path.join(__dirname, "../data/whatsapp/media");
    ensureDirectory(archiveDir);

    const filename = `${Date.now()}-${mediaType}${extension}`;
    const filepath = path.join(archiveDir, filename);
    fs.writeFileSync(filepath, mediaBuffer);

    const summary = `✅ Received ${mediaType} and stored it as ${filename}.`;
    logger.info("Media received", { jid: msg.key.remoteJid, mediaType, filename, caption });

    await sock.sendMessage(msg.key.remoteJid, {
      text: `${summary}${caption ? `\nCaption: ${caption}` : ""}`,
    });
  } catch (error) {
    logger.error("handleMedia failed", { error: error?.message || error });
    await sock.sendMessage(msg.key.remoteJid, {
      text: "⚠️ I could not process that media file. Please try again or send a different format.",
    });
  }
};
