const fs = require("fs");

async function sendVideo(sock, jid, videoPath, caption) {
    await sock.sendMessage(jid, {
        video: fs.readFileSync(videoPath),
        caption
    });
}

module.exports = { sendVideo };
