const { default: makeWASocket, useSingleFileAuthState } = require("@whiskeysockets/baileys");
const { Boom } = require("@hapi/boom");
const fs = require("fs");
const path = require("path");
const { state, saveState } = useSingleFileAuthState("./auth.json");
const handleText = require("./handlers/text");
const handleMedia = require("./handlers/media");
const handleGroup = require("./handlers/group");
const { getMasterJid } = require("./handlers/user");

async function startBot() {
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true
    });
    sock.ev.on('creds.update', saveState);
    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'open') {
            // Send welcome message to master immediately after login
            const masterJid = getMasterJid();
            await sock.sendMessage(masterJid, { text: '🤖 Qmoi WhatsApp bot is now online and ready!' });
        }
    });
    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        const msg = messages[0];
        if (!msg.message || msg.key.fromMe) return;
        const jid = msg.key.remoteJid;
        const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text;
        if (text) {
            await handleText(sock, jid, text);
        }
        // Media and group handlers can be added here
    });
    console.log("🤖 Qmoi WhatsApp bot is running...");
}

startBot();
