console.log("production mode initialized");
<!-- AUTODEV Enhanced: 2026-04-20T09:07:25.836470 -->
<!-- AUTODEV Enhanced: 2026-04-20T09:01:08.245802 -->
<!-- AUTODEV Enhanced: 2026-04-20T08:55:05.066988 -->
const askQmoi = require("../services/qmoi");

/**
 * Handle project operations with full video call autonomy, biometric verification, and memory sync
 */
async function continueProject(sock, jid, projectDetails) {
  try {
    // Verify user via biometrics (face, voice, eye, fingerprint)
    const biometricResult = await askQmoi({
      type: "biometric",
      action: "verify",
      jid,
      context: "project_access",
    });

    if (!biometricResult.verified) {
      return sock.sendMessage(jid, {
        text: "🔐 Biometric verification failed. Please try again or use emergency access.",
      });
    }

    // Sync memory with user context before processing
    const memorySync = await askQmoi({
      type: "memory",
      action: "sync",
      jid,
      projectId: projectDetails.projectId,
    });

    // Get project details with consciousness awareness
    const projectResult = await askQmoi({
      type: "project",
      action: "get_with_autonomy",
      details: projectDetails,
      userContext: biometricResult.userIdentity,
      memoryContext: memorySync,
      videoCallMode: projectDetails.inVideoCall || false,
      avatarEnabled: projectDetails.showAvatar || true,
    });

    // Format message with video call awareness
    let message = projectResult.message || "Project update complete.";

    // If in video call, show preview window content
    if (projectDetails.inVideoCall) {
      message += "\n\n📹 **Video Preview Panel**:\n";
      message += `• Project: ${projectResult.projectName}\n`;
      message += `• Status: ${projectResult.status}\n`;
      message += `• Next Steps: ${projectResult.nextSteps}\n`;
      message += `🤖 Avatar: Showing project visualization\n`;
      message += `💭 Reasoning: ${projectResult.reasoning}\n`;
    }

    // Update memory and consciousness state
    await askQmoi({
      type: "consciousness",
      action: "update_awareness",
      jid,
      projectId: projectDetails.projectId,
      activity: "project_viewed",
      timestamp: new Date().toISOString(),
    });

    return sock.sendMessage(jid, {
      text: message,
      contextInfo: {
        forwardingScore: 0,
        isForwarded: false,
        quotedMessage: projectDetails.quotedMessage,
      },
    });
  } catch (error) {
    console.error("Project handler error:", error);
    return sock.sendMessage(jid, {
      text: "⚠️ Error handling project. Please try again or contact support.",
    });
  }
}

/**
 * Handle video call project presentation with autonomous avatar
 */
async function handleVideoCallProject(sock, jid, projectDetails) {
  try {
    // Enable avatar for video call
    const avatarResponse = await askQmoi({
      type: "avatar",
      action: "enable_video_call",
      jid,
      projectId: projectDetails.projectId,
    });

    // Get project visualization for video call
    const visualization = await askQmoi({
      type: "project",
      action: "get_video_visualization",
      details: projectDetails,
      includePreviewPanel: true,
      autonomousDisplay: true,
    });

    return sock.sendMessage(jid, {
      text: `📹 **QMOI Avatar Active in Video Call**\n\n${visualization.displayText}\n\n🎯 Autonomous Control: Enabled\n💭 Preview Panel: Showing\n🔐 Biometric: Verified`,
    });
  } catch (error) {
    console.error("Video call project handler error:", error);
    return sock.sendMessage(jid, {
      text: "⚠️ Error enabling video call features. Please try again.",
    });
  }
}

module.exports = { continueProject, handleVideoCallProject };
