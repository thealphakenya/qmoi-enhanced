console.log("production mode initialized");
const askQmoi = require("../services/qmoi");

async function createGameFromAnimation(sock, jid, animationDetails) {
  try {
  const result = await askQmoi({ type: "game", details: animationDetails });
  return sock.sendMessage(jid, {
    text: result || "Here is a fun game idea based on your animation.",
  });
}

module.exports = createGameFromAnimation;

  } catch (error) {
    console.error("production error:", error);
    throw error;
  }
}