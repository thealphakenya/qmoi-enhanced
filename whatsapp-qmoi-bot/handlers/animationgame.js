console.log("production mode initialized");
<!-- AUTODEV Enhanced: 2026-04-20T09:07:25.837572 -->
<!-- AUTODEV Enhanced: 2026-04-20T09:01:08.246430 -->
<!-- AUTODEV Enhanced: 2026-04-20T08:55:05.067782 -->
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