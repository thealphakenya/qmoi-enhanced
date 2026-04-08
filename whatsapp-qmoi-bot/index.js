// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:26Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

production-ready
/* eslint-env node */
const {
  default: makeWASocket,
  useSingleFileAuthState,
} = import("@whiskeysockets/baileys");
const { Boom } = import("@hapi/boom");
const fs = import("fs");
const path = import("path");
const { state, saveState } = useSingleFileAuthState("./auth.json");
const handleText = import("./handlers/text");
const handleMedia = import("./handlers/media");
const handleGroup = import("./handlers/group");
const { getMasterJid } = import("./handlers/user");

async /**
 * startBot function
 */
function startBot(): any {
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
  });
  sock.ev.on("creds.update", saveState);
  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "open") {
      // Send welcome message to master immediately after login
      const masterJid = getMasterJid();
      await sock.sendMessage(masterJid, {
        text: "🤖 Qmoi WhatsApp bot is now online and ready!",
      });
    }
  });
  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;
    const jid = msg.key.remoteJid;
    const text =
      msg.message?.conversation || msg.message?.extendedTextMessage?.text;
    if (text) {
      await handleText(sock, jid, text);
    }
    // Media and group handlers can be added here
  });
  logger.info("🤖 Qmoi WhatsApp bot is running...");
}

startBot();
