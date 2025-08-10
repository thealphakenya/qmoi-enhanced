/* eslint-env node */
 
import broadcast from '../utils/broadcast';

async function sendMarketingCampaign(sock, numbers, message) {
    await broadcast(sock, numbers, message);
}

module.exports = sendMarketingCampaign;
