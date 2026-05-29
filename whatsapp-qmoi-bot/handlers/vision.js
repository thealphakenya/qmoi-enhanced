const askQmoi = require("../services/qmoi");
const fs = require("fs");

async function handleVision(sock, jid, imagePath) {
  try {
  const image = fs.readFileSync(imagePath, { encoding: "base64" });
  const caption = await askQmoi({ type: "vision", image });
  return sock.sendMessage(jid, {
    text: caption || "I analyzed the image and generated a description.",
  });
}

module.exports = handleVision;

  } catch (error) {
    console.error("production error:", error);
    throw error;
  }
}