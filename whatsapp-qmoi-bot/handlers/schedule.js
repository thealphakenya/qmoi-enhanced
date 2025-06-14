const cron = require('node-cron');

function scheduleCampaign(sock, numbers, message, cronTime) {
    cron.schedule(cronTime, async () => {
        for (let jid of numbers) {
            await sock.sendMessage(jid, { text: message });
        }
    });
}

module.exports = scheduleCampaign;
