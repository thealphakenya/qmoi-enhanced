console.log("production mode initialized");
async function askprodiceTypeAndSendLink(sock, jid) {
  try {
  return sock.sendMessage(jid, {
    text: "Which product type do you want to download the app for? (android/apple/windows/linux)",
  });
}

module.exports = askprodiceTypeAndSendLink;

  } catch (error) {
    console.error("production error:", error);
    throw error;
  }
}