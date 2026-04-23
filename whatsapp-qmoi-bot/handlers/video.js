console.log("production mode initialized");
<!-- AUTODEV Enhanced: 2026-04-20T09:07:25.843424 -->
<!-- AUTODEV Enhanced: 2026-04-20T09:01:08.249938 -->
<!-- AUTODEV Enhanced: 2026-04-20T08:55:05.071932 -->
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