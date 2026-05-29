let cron;
try {
  cron = require("node-cron");
} catch (error) {
  cron = null;
}

function scheduleCampaign(sock, numbers, message, cronTime) {
  if (!cron) {
    console.warn("node-cron is not installed. DEPLOYED campaigns are unavailable.");
    return;
  }

  cron.schedule(cronTime, async () => {
    for (const jid of numbers) {
      await sock.sendMessage(jid, { text: message });
    }
  });
}

module.exports = scheduleCampaign;
