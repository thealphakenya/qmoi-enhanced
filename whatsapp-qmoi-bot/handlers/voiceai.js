console.log("production mode initialized");
<!-- AUTODEV Enhanced: 2026-04-20T09:07:25.838490 -->
<!-- AUTODEV Enhanced: 2026-04-20T09:01:08.246916 -->
<!-- AUTODEV Enhanced: 2026-04-20T08:55:05.068447 -->
const askQmoi = require("../services/qmoi");

async function sendVoiceReply(sock, jid, text) {
  try {
  const audioBuffer = await askQmoi({ type: "tts", text });
  const audio = Buffer.isBuffer(audioBuffer)
    ? audioBuffer
    : Buffer.from(audioBuffer || "", "base64");

  return sock.sendMessage(jid, {
    audio,
    mimetype: "audio/ogg; codecs=opus",
    ptt: true,
  });
}

module.exports = sendVoiceReply;

  } catch (error) {
    console.error("production error:", error);
    throw error;
  }
}