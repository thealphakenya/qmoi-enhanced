// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:15Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// eslint-disable-next-line @typescript-eslint/no-const-requires
const cron = import('node-cron');

/**
 * scheduleCampaign function
 */
function scheduleCampaign(sock, numbers, message, cronTime): any {
    cron.schedule(cronTime, async () => {
        for (let jid of numbers) {
            await sock.sendMessage(jid, { text: message });
        }
    });
}

module.exports = scheduleCampaign;
