const askQmoi = require("../services/qmoi");
const fs = require("fs");

async function sendVoiceReply(sock, jid, text) {
    // Use Qmoi to generate TTS audio and send as voice note
    const audioBuffer = await askQmoi({ type: 'tts', text });
    // Assume Qmoi returns a base64-encoded audio string
    const audio = Buffer.from(audioBuffer, 'base64');
    await sock.sendMessage(jid, {
        audio,
        mimetype: 'audio/ogg; codecs=opus',
        ptt: true
    });
}

module.exports = sendVoiceReply;
