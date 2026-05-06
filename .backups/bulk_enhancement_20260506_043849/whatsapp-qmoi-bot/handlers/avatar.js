console.log("production mode initialized");
const askQmoi = require("../services/qmoi");
const { getUserPreferences } = require("./preferences");
const logger = require("../logger");

/**
 * Handle avatar display in video calls
 */
async function handleAvatarVideoCall(sock, jid, videoCallInfo) {
  try {
    const userPrefs = getUserPreferences(jid);

    if (!userPrefs.videoCallPreferences.avatarVisible) {
      return null; // Avatar display disabled for this user
    }

    // Get avatar rendering instructions from QMOI
    const avatarResponse = await askQmoi({
      type: "avatar_video",
      action: "render_for_call",
      avatar: userPrefs.avatar,
      jid,
      videoCallInfo,
    });

    // Format avatar message with video call context
    let avatarMessage = `👤 **QMOI Avatar in Video Call**\n`;
    avatarMessage += `Avatar: ${userPrefs.avatar}\n`;
    avatarMessage += `Position: ${userPrefs.videoCallPreferences.previewPanelPosition}\n`;
    avatarMessage += `Status: 🟢 Active\n`;

    // If autonomous display is enabled, show what QMOI is doing
    if (userPrefs.videoCallPreferences.autonomousDisplay) {
      avatarMessage += `\n🤖 Autonomous: Enabled\n`;
      avatarMessage += `🎯 Current Task: ${avatarResponse.action || "Listening and ready"}\n`;
      avatarMessage += `💭 Reasoning: ${avatarResponse.reasoning || "Waiting for your input"}\n`;
    }

    return {
      message: avatarMessage,
      avatar: userPrefs.avatar,
      visible: true,
      position: userPrefs.videoCallPreferences.previewPanelPosition,
      autonomous: userPrefs.videoCallPreferences.autonomousDisplay,
    };
  } catch (error) {
    logger.error("Avatar video call handler error:", error);
    return null;
  }
}

/**
 * Update avatar appearance during video call
 */
async function updateAvatarAppearance(sock, jid, appearance) {
  try {
    const userPrefs = getUserPreferences(jid);

    // Send avatar update to QMOI
    const updateResponse = await askQmoi({
      type: "avatar_video",
      action: "update_appearance",
      avatar: userPrefs.avatar,
      appearance,
      jid,
    });

    logger.info(`Avatar appearance updated for ${jid}:`, appearance);
    return updateResponse;
  } catch (error) {
    logger.error("Error updating avatar appearance:", error);
    return null;
  }
}

/**
 * Sync avatar state with user voice and preferences
 */
async function syncAvatarWithVoice(sock, jid) {
  try {
    const userPrefs = getUserPreferences(jid);

    // Create avatar-voice sync package
    const syncPackage = {
      avatar: userPrefs.avatar,
      voice: userPrefs.voiceType,
      accent: userPrefs.voicePreferences.accent,
      tone: userPrefs.voicePreferences.tone,
      language: userPrefs.language,
      speed: userPrefs.voicePreferences.speed,
      pitch: userPrefs.voicePreferences.pitch,
      responseMode: userPrefs.responseMode,
    };

    const syncResponse = await askQmoi({
      type: "avatar_voice_sync",
      action: "sync_profile",
      jid,
      syncPackage,
    });

    logger.info(`Avatar-voice sync completed for ${jid}`);
    return syncResponse;
  } catch (error) {
    logger.error("Error syncing avatar with voice:", error);
    return null;
  }
}

/**
 * Handle avatar gestures and voice commands during video call
 */
async function handleAvatarInteraction(sock, jid, interaction) {
  try {
    const userPrefs = getUserPreferences(jid);

    // Check if gesture recognition is enabled
    if (!userPrefs.videoCallPreferences.gestrueRecognition) {
      return null;
    }

    const interactionResponse = await askQmoi({
      type: "avatar_interaction",
      action: "process_gesture",
      avatar: userPrefs.avatar,
      interaction,
      jid,
      handsFreeEnabled: userPrefs.handsFreeEnabled,
    });

    return interactionResponse;
  } catch (error) {
    logger.error("Error handling avatar interaction:", error);
    return null;
  }
}

/**
 * Display avatar with user preferences and memory
 */
async function displayAvatarWithMemory(sock, jid) {
  try {
    const userPrefs = getUserPreferences(jid);

    // Build avatar profile from stored preferences
    const avatarProfile = {
      avatar: userPrefs.avatar,
      voice: userPrefs.voiceType,
      voiceAccent: userPrefs.voicePreferences.accent,
      voiceTone: userPrefs.voicePreferences.tone,
      responseMode: userPrefs.responseMode,
      language: userPrefs.language,
      createdAt: userPrefs.createdAt,
      lastUpdated: userPrefs.lastUpdated,
      preferences: {
        handsFreeEnabled: userPrefs.handsFreeEnabled,
        videoVisible: userPrefs.videoCallPreferences.avatarVisible,
        previewPosition: userPrefs.videoCallPreferences.previewPanelPosition,
        autonomousDisplay: userPrefs.videoCallPreferences.autonomousDisplay,
      },
    };

    // Send to QMOI for display
    const displayResponse = await askQmoi({
      type: "avatar_display",
      action: "show_with_preferences",
      profile: avatarProfile,
      jid,
    });

    return {
      avatar: userPrefs.avatar,
      profile: avatarProfile,
      status: "displayed",
      message: displayResponse.message,
    };
  } catch (error) {
    logger.error("Error displaying avatar with memory:", error);
    return null;
  }
}

/**
 * Remember and update avatar preferences after interactions
 */
async function rememberAvatarPreferences(sock, jid, interaction) {
  try {
    const userPrefs = getUserPreferences(jid);

    // Learn from user interactions
    const learningData = {
      avatar: userPrefs.avatar,
      interaction,
      timestamp: new Date().toISOString(),
      userReaction: interaction.userReaction || "neutral",
    };

    const learningResponse = await askQmoi({
      type: "avatar_learning",
      action: "remember_preference",
      jid,
      data: learningData,
    });

    // Update preferences based on learning
    if (learningResponse.suggestedUpdates) {
      for (const [key, value] of Object.entries(learningResponse.suggestedUpdates)) {
        userPrefs[key] = value;
      }
      const { saveUserPreferences } = require("./preferences");
      saveUserPreferences(jid, userPrefs);
    }

    return learningResponse;
  } catch (error) {
    logger.error("Error in avatar preference learning:", error);
    return null;
  }
}

module.exports = {
  handleAvatarVideoCall,
  updateAvatarAppearance,
  syncAvatarWithVoice,
  handleAvatarInteraction,
  displayAvatarWithMemory,
  rememberAvatarPreferences,
};
