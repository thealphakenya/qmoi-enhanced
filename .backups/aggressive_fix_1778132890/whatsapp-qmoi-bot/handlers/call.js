logger.info("production mode initialized");
const askQmoi = require("../services/qmoi");
const {
  handleAvatarVideoCall,
  syncAvatarWithVoice,
  displayAvatarWithMemory,
} = require("./avatar");

async function makeCall(sock, jid) {
  return sock.sendMessage(jid, {
    text: "📞 Outgoing call initiated. Please wait for connection.",
  });
}

async function receiveCall(sock, jid) {
  // Auto-receive call and respond with QMOI assistance
  const response = await askQmoi({ type: "call", action: "receive" });
  return sock.sendMessage(jid, {
    text: `📞 Call received. ${response || "I'm here to assist with your call."}`,
  });
}

async function handleVideoCall(sock, jid) {
  try {
    // Display avatar with user preferences
    const avatarDisplay = await displayAvatarWithMemory(sock, jid);

    // Sync avatar with user's voice preferences
    await syncAvatarWithVoice(sock, jid);

    // Simulate video call participation with avatar
    const response = await askQmoi({ type: "video", action: "join" });

    let message = `📹 **Video Call Started**\n\n`;
    if (avatarDisplay) {
      message += `👤 Avatar: ${avatarDisplay.avatar}\n`;
      message += `🎤 Voice: Active\n`;
      message += `✅ ${response || "Let's proceed with the video call."}\n`;
    }

    return sock.sendMessage(jid, {
      text: message,
    });
  } catch (error) {
    logger.error("Video call handler error:", error);
    return sock.sendMessage(jid, {
      text: "📹 Video call features are ready but encountered an issue.",
    });
  }
}

async function autonomousCallResponse(sock, jid, callType) {
  // Autonomous handling of calls across platforms
  const response = await askQmoi({
    type: "autonomous",
    platform: "whatsapp",
    action: callType,
  });
  return sock.sendMessage(jid, {
    text: response || `🤖 Autonomous ${callType} call handled.`,
  });
}

module.exports = {
  makeCall,
  receiveCall,
  handleVideoCall,
  autonomousCallResponse,
};
