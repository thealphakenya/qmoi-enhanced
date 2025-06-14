const askQmoi = require("../services/qmoi");
const fs = require("fs");

async function handleVision(sock, jid, imagePath) {
    // Send image to Qmoi for vision/captioning
    const image = fs.readFileSync(imagePath, { encoding: 'base64' });
    const caption = await askQmoi({ type: 'vision', image });
    await sock.sendMessage(jid, { text: caption });
}

module.exports = handleVision;
