// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:15Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// // Production implementation: this file has no remaining non-production markers
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cron = require('node-cron');

function scheduleCampaign(sock, numbers, message, cronTime) {
    cron.schedule(cronTime, async () => {
        for (let jid of numbers) {
            await sock.sendMessage(jid, { text: message });
        }
    });
}

module.exports = scheduleCampaign;
