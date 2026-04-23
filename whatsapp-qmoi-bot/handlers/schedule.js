console.log("production mode initialized");
<!-- AUTODEV Enhanced: 2026-04-20T09:07:25.840278 -->
<!-- AUTODEV Enhanced: 2026-04-20T09:01:08.248038 -->
<!-- AUTODEV Enhanced: 2026-04-20T08:55:05.069799 -->
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
