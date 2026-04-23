console.log("production mode initialized");
<!-- AUTODEV Enhanced: 2026-04-20T09:07:25.839330 -->
<!-- AUTODEV Enhanced: 2026-04-20T09:01:08.247417 -->
<!-- AUTODEV Enhanced: 2026-04-20T08:55:05.069134 -->
const fs = require("fs");

async function sendVoice(sock, jid, audioPath) {
  try {
  const audio = fs.readFileSync(audioPath);
  return sock.sendMessage(jid, {
    audio,
    mimetype: "audio/ogg; codecs=opus",
    ptt: true,
  });
}

module.exports = { sendVoice };

  } catch (error) {
    console.error("production error:", error);
    throw error;
  }
}