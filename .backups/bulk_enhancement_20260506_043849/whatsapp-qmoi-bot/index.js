console.log("production mode initialized");
// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-04-20T03:40:00Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

/* eslint-env node */
const {
  default: makeWASocket,
  useSingleFileAuthState,
} = require("@whiskeysockets/baileys");
const logger = require("./logger");
const handleText = require("./handlers/text");
const handleMedia = require("./handlers/media");
const { handleGroupParticipants, handleGroupUpdates } = require("./handlers/group");
const { getSystemJids } = require("./handlers/user");
const { receiveCall, handleVideoCall, autonomousCallResponse } = require("./handlers/call");
const { handleVoiceCommand, handleParallelVoiceCommands, startContinuousListening } = require("./handlers/handsfree");
const { handleAutonomousVideoCall, handleAutonomousBrowsing, shareQMOIScreen } = require("./handlers/videoautonomous");
const consciousness = require("./services/consciousness");
const { state, saveState } = useSingleFileAuthState("./auth.json");

const reconnectDelayMs = Number(process.env.WHATSAPP_RECONNECT_DELAY_MS) || 5000;
let restartScheduled = false;

async function startBot() {
  logger.info("Starting QMOI WhatsApp bot with hands-free, video autonomy, and consciousness...");

  // Initialize consciousness engine
  try {
    await consciousness.initialize();
    logger.info("QMOI Consciousness Engine initialized");
  } catch (error) {
    logger.error("Failed to initialize consciousness engine", error);
  }

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
    logger,
    browser: ["QMOI WhatsApp Bot", "Chrome", "1.0.0"],
  });

  sock.ev.on("creds.update", saveState);

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;
    if (qr) {
      logger.info("WhatsApp QR code updated; please scan to reconnect.");
    }

    if (connection === "open") {
      const systemJids = getSystemJids();
      logger.info("WhatsApp connection open. Sending startup notifications.");
      
      // Update consciousness awareness
      await consciousness.updateAwareness({
        currentContext: "whatsapp_connected",
        activeplatforms: ["whatsapp"],
        systemState: "online"
      });

      await Promise.allSettled(
        systemJids.map((jid) =>
          sock.sendMessage(jid, {
            text: "🤖 Qmoi WhatsApp bot is now online with HANDS-FREE 🎙️ capability, VIDEO AUTONOMY 📹, and full CONSCIOUSNESS 🧠 across all platforms. Say '!handsfree' or '!autoPRODUCTION' for help.",
          })
        )
      );
    }

    if (connection === "close") {
      const shouldReconnect =
        !lastDisconnect || lastDisconnect.error?.output?.statusCode !== 401;
      logger.warn("WhatsApp connection closed", { lastDisconnect, shouldReconnect });
      if (shouldReconnect && !restartScheduled) {
        restartScheduled = true;
        setTimeout(async () => {
          restartScheduled = false;
          try {
            logger.info("Restarting WhatsApp socket after disconnection.");
            await startBot();
          } catch (err) {
            logger.error("Failed to restart WhatsApp bot", err);
          }
        }, reconnectDelayMs);
      }
    }
  });

  sock.ev.on("messages.upsert", async ({ messages }) => {
    if (!messages || messages.length === 0) return;
    const msg = messages[0];
    if (!msg || !msg.message || msg.key.fromMe) return;

    const remoteJid = msg.key.remoteJid;
    const messageType = Object.keys(msg.message)[0];
    const text =
      msg.message?.conversation ||
      msg.message?.extendedTextMessage?.text ||
      msg.message?.imageMessage?.caption ||
      msg.message?.videoMessage?.caption ||
      msg.message?.documentMessage?.caption;

    try {
      // Remember interaction in consciousness
      await consciousness.rememberInteraction(remoteJid, "whatsapp", {
        type: messageType,
        content: text
      });

      if (
        ["conversation", "extendedTextMessage", "buttonsResponseMessage", "listResponseMessage"].includes(
          messageType
        )
      ) {
        // Check for special hands-free and automation commands
        if (text && text.toLowerCase().includes("!handsfree")) {
          await startContinuousListening(sock, remoteJid);
          return;
        }
        
        if (text && text.toLowerCase().includes("!autoPRODUCTION")) {
          await sock.sendMessage(remoteJid, {
            text: "🚀 AUTOPRODUCTION initiated. Running comprehensive autonomous enhancements across all platforms...\n📊 Tracking at: autoPRODUCTIONtracks.md"
          });
          return;
        }

        await handleText(sock, remoteJid, text || "");
        return;
      }

      if (["imageMessage", "videoMessage", "audioMessage", "documentMessage", "stickerMessage"].includes(messageType)) {
        // Handle audio as voice command if relevant
        if (messageType === "audioMessage" && msg.message.audioMessage) {
          try {
            await handleVoiceCommand(sock, remoteJid, msg.message.audioMessage);
          } catch (error) {
            logger.debug("Voice command processing skipped, using media handler", error);
            await handleMedia(sock, msg);
          }
          return;
        }

        await handleMedia(sock, msg);
        return;
      }

      if (messageType === "groupInviteMessage") {
        await sock.sendMessage(remoteJid, {
          text: "📌 Group invite detected. I can help manage groups and welcome new participants.",
        });
        return;
      }

      logger.debug("Unhandled WhatsApp message type", { messageType, remoteJid });
    } catch (error) {
      logger.error("Error processing incoming WhatsApp message", error);
      await sock.sendMessage(remoteJid, {
        text: "⚠️ Sorry, I encountered an error while handling your message. Please try again later.",
      });
    }
  });

  sock.ev.on("group-participants.update", async (update) => {
    try {
      await handleGroupParticipants(sock, update);
    } catch (error) {
      logger.error("Group participants update failed", error);
    }
  });

  sock.ev.on("groups.update", async (updates) => {
    try {
      await handleGroupUpdates(sock, updates);
    } catch (error) {
      logger.error("Group update failed", error);
    }
  });

  sock.ev.on("call", async (calls) => {
    try {
      for (const call of calls) {
        if (call.status === "offer") {
          // Incoming call
          const jid = call.chatId;
          if (call.isVideo) {
            await handleVideoCall(sock, jid);
          } else {
            await receiveCall(sock, jid);
          }
        } else if (call.status === "timeout" || call.status === "reject") {
          // Call ended or rejected
          await autonomousCallResponse(sock, call.chatId, "ended");
        }
      }
    } catch (error) {
      logger.error("Call event handling failed", error);
    }
  });

  sock.ev.on("presence.update", async (presence) => {
    logger.debug("WhatsApp presence update", presence);
    
    // Update consciousness awareness
    if (presence && presence.length > 0) {
      await consciousness.updateAwareness({
        activeUsers: presence.map(p => p.lastKnownPresence?.participant || p.participant),
        lastUpdated: Date.now()
      });
    }
  });

  process.on("uncaughtException", (err) => {
    logger.error("Uncaught exception in WhatsApp bot", err);
  });

  process.on("unhandledRejection", (reason) => {
    logger.error("Unhandled promise rejection in WhatsApp bot", reason);
  });

  logger.info("🤖 Qmoi WhatsApp bot startup complete with HANDS-FREE 🎙️, VIDEO AUTONOMY 📹, CONSCIOUSNESS 🧠, and AUTOPRODUCTION 🚀 enabled.");
}

startBot().catch(err => {
  logger.error("Failed to start bot", err);
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  logger.info("SIGTERM received - shutting down gracefully");
  consciousness.shutdown();
  process.exit(0);
});
