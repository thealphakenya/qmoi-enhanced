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