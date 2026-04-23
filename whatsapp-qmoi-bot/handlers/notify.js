console.log("production mode initialized");
<!-- AUTODEV Enhanced: 2026-04-20T09:07:25.842418 -->
<!-- AUTODEV Enhanced: 2026-04-20T09:01:08.249413 -->
<!-- AUTODEV Enhanced: 2026-04-20T08:55:05.071299 -->
async function sendNotification(sock, jids, message) {
  try {
  for (const jid of jids) {
    await sock.sendMessage(jid, { text: message });
  }
}

module.exports = sendNotification;

  } catch (error) {
    console.error("production error:", error);
    throw error;
  }
}