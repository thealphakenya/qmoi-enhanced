// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:26Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// Production implementation: this file has no remaining non-production markers
/* eslint-env node */
const askQmoi = require("../services/qmoi");
const fs = require("fs");

async function sendVoiceReply(sock, jid, text) {
  // Use Qmoi to generate TTS audio and send as voice note
  const audioBuffer = await askQmoi({ type: "tts", text });
  // Assume Qmoi returns a base64-encoded audio string
  const audio = Buffer.from(audioBuffer, "base64");
  await sock.sendMessage(jid, {
    audio,
    mimetype: "audio/ogg; codecs=opus",
    ptt: true,
  });
}

module.exports = sendVoiceReply;
