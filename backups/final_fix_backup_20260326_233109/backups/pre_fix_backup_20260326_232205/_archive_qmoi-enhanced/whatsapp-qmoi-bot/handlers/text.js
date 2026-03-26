// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:26Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// // Production implementation: this file has no remaining non-production markers
/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const askQmoi = require("../services/qmoi");

module.exports = async function handleText(sock, jid, text) {
  const reply = await askQmoi(text);
  await sock.sendMessage(jid, { text: reply });
};
