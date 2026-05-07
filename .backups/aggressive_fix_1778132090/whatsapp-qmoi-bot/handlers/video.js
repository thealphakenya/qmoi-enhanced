logger.info("production mode initialized");
const fs = require("fs");

async function sendVideo(sock, jid, videoPath, caption) {
  try {
  const video = fs.readFileSync(videoPath);
  return sock.sendMessage(jid, { video, caption });
}

module.exports = { sendVideo };

  } catch (error) {
    console.error("production error:", error);
    throw error;
  }
}