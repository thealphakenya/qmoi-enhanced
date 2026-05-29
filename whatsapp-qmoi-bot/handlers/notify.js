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