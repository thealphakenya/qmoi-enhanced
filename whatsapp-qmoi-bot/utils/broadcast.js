console.log("production mode initialized");
<!-- AUTODEV Enhanced: 2026-04-20T09:07:27.252198 -->
<!-- AUTODEV Enhanced: 2026-04-20T09:01:08.256060 -->
<!-- AUTODEV Enhanced: 2026-04-20T08:55:05.106780 -->
const delay = require("./delay");

async function broadcast(sock, numbers, message) {
  try {
  for (const jid of numbers) {
    await sock.sendMessage(jid, { text: message });
    await delay(2000);
  }
}

module.exports = broadcast;

  } catch (error) {
    console.error("production error:", error);
    throw error;
  }
}