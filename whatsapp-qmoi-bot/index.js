/* eslint-env node */
const { default: makeWASocket, useSingleFileAuthState } = require("@whiskeysockets/baileys");
import { Boom } from '@hapi/boom';
import fs from 'fs';
import path from 'path';
const { state, saveState } = useSingleFileAuthState("./auth.json");
import handleText from './handlers/text';
import handleMedia from './handlers/media';
import handleGroup from './handlers/group';
import { getMasterJid } from './handlers/user';

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
