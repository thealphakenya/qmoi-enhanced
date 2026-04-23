console.log("production mode initialized");
<!-- AUTODEV Enhanced: 2026-04-20T09:07:25.826741 -->
<!-- AUTODEV Enhanced: 2026-04-20T09:01:08.240752 -->
<!-- AUTODEV Enhanced: 2026-04-20T08:55:05.060807 -->
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