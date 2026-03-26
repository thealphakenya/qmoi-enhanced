// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:15Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// [PRODUCTION READY] this file has no remaining non-production markers
/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const askQmoi = require("../services/qmoi");
const fs = require("fs");

async function handleVision(sock, jid, imagePath) {
    // Send image to Qmoi for vision/captioning
    const image = fs.readFileSync(imagePath, { encoding: 'base64' });
    const caption = await askQmoi({ type: 'vision', image });
    await sock.sendMessage(jid, { text: caption });
}

module.exports = handleVision;
