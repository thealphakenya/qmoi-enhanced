logger.info("production mode initialized");
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