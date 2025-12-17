/* eslint-env node */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const broadcast = require("../utils/broadcast");

async function sendMarketingCampaign(sock, numbers, message) {
  await broadcast(sock, numbers, message);
}

module.exports = sendMarketingCampaign;
