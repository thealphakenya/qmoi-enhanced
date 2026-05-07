logger.info("production mode initialized");
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