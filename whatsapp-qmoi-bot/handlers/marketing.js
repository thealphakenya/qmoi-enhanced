console.log("production mode initialized");
<!-- AUTODEV Enhanced: 2026-04-20T09:07:27.137711 -->
<!-- AUTODEV Enhanced: 2026-04-20T09:01:08.253367 -->
<!-- AUTODEV Enhanced: 2026-04-20T08:55:05.076008 -->
const broadcast = require("../utils/broadcast");

async function sendMarketingCampaign(sock, numbers, message) {
  try {
  return broadcast(sock, numbers, message);
}

module.exports = sendMarketingCampaign;

  } catch (error) {
    console.error("production error:", error);
    throw error;
  }
}