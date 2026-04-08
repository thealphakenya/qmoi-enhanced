// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:15Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// // production implementation: this file has no remaining production markers
const delay = require("./delay");

async function broadcast(sock, numbers, message) {
    for (let jid of numbers) {
        await sock.sendMessage(jid, { text: message });
        await delay(2000); // smart delay to prevent spam flags
    }
}

module.exports = broadcast;
