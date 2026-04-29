console.log("production mode initialized");
const fs = require("fs");
const path = require("path");
const askQmoi = require("../services/qmoi");
const logger = require("../logger");

// User preferences storage path
const PREFERENCES_PATH = path.join(__dirname, "../data/user_preferences.json");
const VOICE_PROFILES_PATH = path.join(__dirname, "../data/voice_profiles.json");

// Ensure data directory exists
const DATA_DIR = path.dirname(PREFERENCES_PATH);
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

/**
 * Load all user preferences from storage
 */
function loadAllPreferences() {
  try {
    if (fs.existsSync(PREFERENCES_PATH)) {
      return JSON.parse(fs.readFileSync(PREFERENCES_PATH, "utf8"));
    }
  } catch (error) {
    logger.error("Error loading preferences", error);
  }
  return {};
}

/**
 * Load specific user preferences
 */
function getUserPreferences(jid) {
  const allPrefs = loadAllPreferences();
  return (
    allPrefs[jid] || {
      avatar: "default_qmoi",
      voiceType: "neutral",
      handsFreeEnabled: false,
      language: "en",
      responseMode: "professional",
      autoRespond: false,
      showPreview: true,
      videoCallPreferences: {
        avatarVisible: true,
        previewPanelPosition: "right",
        gestrueRecognition: true,
        autonomousDisplay: true,
      },
      voicePreferences: {
        accent: "neutral",
        speed: "normal",
        pitch: "medium",
        tone: "helpful",
      },
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    }
  );
}

/**
 * Save user preferences
 */
function saveUserPreferences(jid, preferences) {
  try {
    const allPrefs = loadAllPreferences();
    allPrefs[jid] = {
      ...preferences,
      lastUpdated: new Date().toISOString(),
    };
    fs.writeFileSync(PREFERENCES_PATH, JSON.stringify(allPrefs, null, 2));
    logger.info(`User preferences saved for ${jid}`);
    return true;
  } catch (error) {
    logger.error("Error saving preferences", error);
    return false;
  }
}

/**
 * Update specific preference
 */
function updatePreference(jid, key, value) {
  const prefs = getUserPreferences(jid);
  const keys = key.split(".");

  // Handle nested keys like "videoCallPreferences.avatarVisible"
  let current = prefs;
  for (let i = 0; i < keys.length - 1; i++) {
    current[keys[i]] = current[keys[i]] || {};
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = value;

  return saveUserPreferences(jid, prefs);
}

/**
 * Handle preference show command
 */
async function handleShowPreferences(sock, jid) {
  const prefs = getUserPreferences(jid);

  let message = "🎯 **Your QMOI Preferences**\n\n";
  message += `👤 **Avatar**: ${prefs.avatar}\n`;
  message += `🎤 **Voice**: ${prefs.voiceType} (${prefs.voicePreferences.accent})\n`;
  message += `🎧 **Hands-Free**: ${prefs.handsFreeEnabled ? "✅ Enabled" : "❌ Disabled"}\n`;
  message += `🌐 **Language**: ${prefs.language}\n`;
  message += `💬 **Response Mode**: ${prefs.responseMode}\n`;
  message += `📹 **Video Call Avatar**: ${prefs.videoCallPreferences.avatarVisible ? "✅ Visible" : "❌ Hidden"}\n`;
  message += `📋 **Preview Panel**: ${prefs.videoCallPreferences.previewPanelPosition}\n`;
  message += `🤖 **Autonomous Display**: ${prefs.videoCallPreferences.autonomousDisplay ? "✅ On" : "❌ Off"}\n`;

  return sock.sendMessage(jid, { text: message });
}

/**
 * Handle avatar selection
 */
async function handleAvatarSelection(sock, jid, avatarName) {
  const validAvatars = [
    "default_qmoi",
    "professional",
    "casual",
    "animated",
    "minimal",
    "realistic",
    "cartoon",
  ];

  if (!validAvatars.includes(avatarName)) {
    return sock.sendMessage(jid, {
      text: `❌ Invalid avatar. Available options:\n${validAvatars.join(
        ", "
      )}`,
    });
  }

  updatePreference(jid, "avatar", avatarName);

  return sock.sendMessage(jid, {
    text: `✅ Avatar changed to: ${avatarName}\n\n👤 Your new avatar will appear in all video calls and chats.`,
  });
}

/**
 * Handle voice customization
 */
async function handleVoiceCustomization(sock, jid, voiceConfig) {
  const prefs = getUserPreferences(jid);

  // Parse voice config: format - "type:accent:speed:pitch:tone"
  const parts = voiceConfig.split(":");
  const voiceType = parts[0] || prefs.voiceType;
  const accent = parts[1] || prefs.voicePreferences.accent;
  const speed = parts[2] || prefs.voicePreferences.speed;
  const pitch = parts[3] || prefs.voicePreferences.pitch;
  const tone = parts[4] || prefs.voicePreferences.tone;

  const validOptions = {
    type: ["neutral", "warm", "energetic", "calm", "professional"],
    accent: ["neutral", "american", "british", "african", "indian"],
    speed: ["slow", "normal", "fast"],
    pitch: ["low", "medium", "high"],
    tone: ["helpful", "direct", "friendly", "formal"],
  };

  if (!validOptions.type.includes(voiceType)) {
    return sock.sendMessage(jid, {
      text: `❌ Invalid voice type. Available: ${validOptions.type.join(", ")}`,
    });
  }

  prefs.voiceType = voiceType;
  prefs.voicePreferences = { accent, speed, pitch, tone };
  saveUserPreferences(jid, prefs);

  return sock.sendMessage(jid, {
    text: `✅ Voice customized!\n\n🎤 Type: ${voiceType}\n🌍 Accent: ${accent}\n⏱️ Speed: ${speed}\n📊 Pitch: ${pitch}\n💭 Tone: ${tone}`,
  });
}

/**
 * Handle hands-free mode toggle
 */
async function handleHandsFreeToggle(sock, jid, enable) {
  const prefs = getUserPreferences(jid);
  const isEnabled = enable === "on" || enable === "true" || enable === "1";

  updatePreference(jid, "handsFreeEnabled", isEnabled);

  return sock.sendMessage(jid, {
    text: `✅ Hands-Free Mode: ${isEnabled ? "🎤 ENABLED" : "🔇 DISABLED"}\n\n${
      isEnabled
        ? "Now you can control QMOI with voice commands and gestures!"
        : "Hands-Free mode is off. Use text commands."
    }`,
  });
}

/**
 * Handle video call preferences
 */
async function handleVideoPreferences(sock, jid, setting, value) {
  const prefs = getUserPreferences(jid);

  const validSettings = [
    "avatarVisible",
    "previewPanelPosition",
    "gestureRecognition",
    "autonomousDisplay",
  ];

  if (!validSettings.includes(setting)) {
    return sock.sendMessage(jid, {
      text: `❌ Invalid setting. Available: ${validSettings.join(", ")}`,
    });
  }

  if (
    setting === "previewPanelPosition" &&
    !["left", "right", "bottom"].includes(value)
  ) {
    return sock.sendMessage(jid, {
      text: "❌ Invalid position. Use: left, right, or bottom",
    });
  }

  const isBool = ["avatarVisible", "gestureRecognition", "autonomousDisplay"];
  if (isBool.includes(setting)) {
    value = value === "on" || value === "true" || value === "1";
  }

  updatePreference(jid, `videoCallPreferences.${setting}`, value);

  return sock.sendMessage(jid, {
    text: `✅ Video preference updated!\n\n${setting}: ${value}`,
  });
}

/**
 * Handle language preference
 */
async function handleLanguagePreference(sock, jid, language) {
  const validLanguages = ["en", "es", "fr", "de", "sw", "ar", "zh"];

  if (!validLanguages.includes(language)) {
    return sock.sendMessage(jid, {
      text: `❌ Invalid language. Available: ${validLanguages.join(", ")}`,
    });
  }

  updatePreference(jid, "language", language);

  return sock.sendMessage(jid, {
    text: `✅ Language changed to: ${language}\n\nAll responses will now be in ${language === "en" ? "English" : language}.`,
  });
}

/**
 * Handle response mode preference
 */
async function handleResponseMode(sock, jid, mode) {
  const validModes = ["professional", "casual", "technical", "friendly"];

  if (!validModes.includes(mode)) {
    return sock.sendMessage(jid, {
      text: `❌ Invalid mode. Available: ${validModes.join(", ")}`,
    });
  }

  updatePreference(jid, "responseMode", mode);

  return sock.sendMessage(jid, {
    text: `✅ Response mode changed to: ${mode}\n\nI'll adapt my responses to match this style.`,
  });
}

/**
 * Auto-apply preferences to QMOI API calls
 */
function applyUserPreferences(jid, payload) {
  const prefs = getUserPreferences(jid);
  return {
    ...payload,
    userPreferences: prefs,
    avatar: prefs.avatar,
    voice: prefs.voiceType,
    language: prefs.language,
    responseMode: prefs.responseMode,
    handsFreeEnabled: prefs.handsFreeEnabled,
  };
}

module.exports = {
  getUserPreferences,
  saveUserPreferences,
  updatePreference,
  loadAllPreferences,
  handleShowPreferences,
  handleAvatarSelection,
  handleVoiceCustomization,
  handleHandsFreeToggle,
  handleVideoPreferences,
  handleLanguagePreference,
  handleResponseMode,
  applyUserPreferences,
};
