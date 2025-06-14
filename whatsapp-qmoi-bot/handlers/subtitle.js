const askQmoi = require("../services/qmoi");

async function generateSubtitles(mediaPath) {
    // Send media to Qmoi for subtitle generation
    return await askQmoi({ type: 'subtitle', mediaPath });
}

module.exports = generateSubtitles;
