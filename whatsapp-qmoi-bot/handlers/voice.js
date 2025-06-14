const fs = require("fs");

async function sendVoice(sock, jid, audioPath) {
    await sock.sendMessage(jid, {
        audio: fs.readFileSync(audioPath),
        mimetype: 'audio/ogg; codecs=opus',
        ptt: true
    });
}

module.exports = { sendVoice };
