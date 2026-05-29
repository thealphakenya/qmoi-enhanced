const askQmoi = require("../services/qmoi");
const { createGroup, addToGroup } = require("./group");
const { getSystemJids } = require("./user");
const logger = require("../logger");
const {
  handleShowPreferences,
  handleAvatarSelection,
  handleVoiceCustomization,
  handleHandsFreeToggle,
  handleVideoPreferences,
  handleLanguagePreference,
  handleResponseMode,
  applyUserPreferences,
} = require("./preferences");

function parsePhoneTargets(raw) {
  return raw
    .split(",")
    .map((phone) => phone.replace(/[^0-9]/g, "").trim())
    .filter(Boolean)
    .map((phone) => `${phone}@s.whatsapp.net`);
}

function parseGroupCommand(command, normalized) {
  const payload = normalized.slice(command.length).trim();
  if (!payload) return null;

  const [subject, participantsLine] = payload.split(";");
  if (!subject || !participantsLine) return null;

  const participants = parsePhoneTargets(participantsLine);
  return { subject: subject.trim(), participants };
}

module.exports = async function handleText(sock, jid, text) {
  const normalized = (text || "").trim();
  if (!normalized) {
    return sock.sendMessage(jid, {
      text: "⚠️ I received an empty message. Please send a text command, question, or media message.",
    });
  }

  const command = normalized.split(" ")[0].toLowerCase();

  if (["!help", "!commands", "!h"].includes(command)) {
    return sock.sendMessage(jid, {
      text:
        "🤖 QMOI Bot Commands:\n\n" +
        "**Basic Commands**\n" +
        "- !help: Show this help message\n" +
        "- !status: Show bot status\n" +
        "- !about: Learn about the QMOI WhatsApp bot\n\n" +
        "**Preferences & Customization**\n" +
        "- !prefs: Show your current preferences\n" +
        "- !avatar <name>: Change avatar (default_qmoi, professional, casual, animated, minimal, realistic, cartoon)\n" +
        "- !voice <type>:<accent>:<speed>:<pitch>:<tone>: Customize voice\n" +
        "- !handsfree on/off: Enable/disable hands-free mode\n" +
        "- !videosettings <setting>:<value>: Configure video call settings\n" +
        "- !language <code>: Change language (en, es, fr, de, sw, ar, zh)\n" +
        "- !responsemode <mode>: Change response style (professional, casual, technical, friendly)\n\n" +
        "**Advanced Features**\n" +
        "- !autoPRODUCTION <command>: Run autonomous production\n" +
        "- !project <name>: Handle projects with video autonomy\n" +
        "- !video <action>: Control video autonomy\n" +
        "- !memory: Check consciousness state\n" +
        "- !biometric: Verify user identity\n\n" +
        "**Group & Broadcast**\n" +
        "- !createGroup <name>;<phone1,phone2>: Create a group\n" +
        "- !addToGroup <groupJid>;<phone1,phone2>: Add members to group\n" +
        "- !broadcast <message>: Send notification to system contacts\n" +
        "- !groupinfo: Learn about group commands\n",
    });
  }

  if (command === "!status") {
    return sock.sendMessage(jid, {
      text: "✅ QMOI WhatsApp bot is online and ready. I can accept text, media, and group commands.",
    });
  }

  if (command === "!about") {
    return sock.sendMessage(jid, {
      text: "🤖 QMOI WhatsApp bot is a production-ready assistant that handles messages, media, and group events with AI enhancement, logging, and recovery.",
    });
  }

  if (command === "!broadcast") {
    const messageBody = normalized.slice(command.length).trim();
    if (!messageBody) {
      return sock.sendMessage(jid, {
        text: "⚠️ Invalid broadcast command. Use: !broadcast <message>",
      });
    }

    const systemJids = getSystemJids();
    await Promise.allSettled(
      systemJids.map((targetJid) =>
        sock.sendMessage(targetJid, {
          text: `📢 Broadcast from QMOI Bot:\n${messageBody}`,
        })
      )
    );

    return sock.sendMessage(jid, {
      text: `✅ Broadcast delivered to ${systemJids.length} system contact(s).`,
    });
  }

  if (command === "!groupinfo") {
    return sock.sendMessage(jid, {
      text:
        "📘 Group commands:\n" +
        "- !createGroup <name>;<phone1,phone2>: Create a new group\n" +
        "- !addToGroup <groupJid>;<phone1,phone2>: Add new members to an existing group\n" +
        "- In groups, I welcome new participants and announce updates.",
    });
  }

  // Autonomous production Framework
  if (command === "!autoPRODUCTION") {
    const autoPRODUCTIONCommand = normalized.slice(command.length).trim();
    const result = await askQmoi({
      type: "autoPRODUCTION",
      action: autoPRODUCTIONCommand || "all",
      jid,
    });
    return sock.sendMessage(jid, {
      text: `⚙️ **AUTOPRODUCTION Execution Started**\n\n${result.message}\n\nCheck resumefromhere.txt and autoPRODUCTIONtracks.md for detailed progress.`,
    });
  }

  // Project handling with video autonomy
  if (command === "!project") {
    const projectName = normalized.slice(command.length).trim();
    if (!projectName) {
      return sock.sendMessage(jid, {
        text: "📋 Usage: !project <project_name or ID>",
      });
    }

    const { handleVideoCallProject } = require("./project");
    return handleVideoCallProject(sock, jid, { projectId: projectName, inVideoCall: false });
  }

  // Video call autonomy
  if (command === "!video") {
    const videoAction = normalized.slice(command.length).trim();
    const videoResponse = await askQmoi({
      type: "video",
      action: videoAction || "status",
      jid,
    });
    return sock.sendMessage(jid, {
      text: `📹 **Video Autonomy**\n${videoResponse.message || "Video features ready"}`,
    });
  }

  // Memory and consciousness check
  if (command === "!memory") {
    const memoryState = await askQmoi({
      type: "memory",
      action: "get_state",
      jid,
    });
    return sock.sendMessage(jid, {
      text: `🧠 **Consciousness & Memory State**\n${memoryState.message || "Memory sync active"}`,
    });
  }

  // Biometric verification
  if (command === "!biometric") {
    const biometricAction = normalized.slice(command.length).trim();
    const biometricResult = await askQmoi({
      type: "biometric",
      action: biometricAction || "verify",
      jid,
    });
    return sock.sendMessage(jid, {
      text: `🔐 **Biometric Verification**\n${biometricResult.message || "Verification available"}`,
    });
  }

  if (command === "!creategroup") {
    const parsed = parseGroupCommand(command, normalized);
    if (!parsed || parsed.participants.length === 0) {
      return sock.sendMessage(jid, {
        text: "⚠️ Invalid command format. Use: !createGroup <group name>;<phone1,phone2>",
      });
    }

    try {
      const group = await createGroup(sock, parsed.subject, parsed.participants);
      return sock.sendMessage(jid, {
        text: `✅ Group created successfully: ${group.gid || group.groupJid || group.id}`,
      });
    } catch (error) {
      logger.error("createGroup command failed", error);
      return sock.sendMessage(jid, {
        text: "⚠️ Unable to create the group. Please ensure the phone numbers are valid and try again.",
      });
    }
  }

  if (command === "!addtogroup") {
    const payload = normalized.slice(command.length).trim();
    const [groupJid, participantsLine] = payload.split(";");
    if (!groupJid || !participantsLine) {
      return sock.sendMessage(jid, {
        text: "⚠️ Invalid command format. Use: !addToGroup <groupJid>;<phone1,phone2>",
      });
    }

    const participants = parsePhoneTargets(participantsLine);
    try {
      await addToGroup(sock, groupJid.trim(), participants);
      return sock.sendMessage(jid, {
        text: `✅ Added ${participants.length} participants to the group.`,
      });
    } catch (error) {
      logger.error("addToGroup command failed", error);
      return sock.sendMessage(jid, {
        text: "⚠️ Unable to add participants to the group. Please verify the group JID and member numbers.",
      });
    }
  }

  // User Preferences & Customization
  if (command === "!prefs" || command === "!preferences") {
    return handleShowPreferences(sock, jid);
  }

  if (command === "!avatar") {
    const avatarName = normalized.slice(command.length).trim();
    if (!avatarName) {
      return sock.sendMessage(jid, {
        text: "👤 Usage: !avatar <avatar_name>\nAvailable: default_qmoi, professional, casual, animated, minimal, realistic, cartoon",
      });
    }
    return handleAvatarSelection(sock, jid, avatarName);
  }

  if (command === "!voice") {
    const voiceConfig = normalized.slice(command.length).trim();
    if (!voiceConfig) {
      return sock.sendMessage(jid, {
        text: "🎤 Usage: !voice <type>:<accent>:<speed>:<pitch>:<tone>\nExample: !voice neutral:american:normal:medium:helpful",
      });
    }
    return handleVoiceCustomization(sock, jid, voiceConfig);
  }

  if (command === "!handsfree") {
    const action = normalized.slice(command.length).trim().toLowerCase();
    if (!action || !["on", "off"].includes(action)) {
      return sock.sendMessage(jid, {
        text: "🎧 Usage: !handsfree on/off\n\nEnable or disable hands-free mode",
      });
    }
    return handleHandsFreeToggle(sock, jid, action);
  }

  if (command === "!videosettings") {
    const args = normalized.slice(command.length).trim().split(":");
    if (args.length < 2) {
      return sock.sendMessage(jid, {
        text: "📹 Usage: !videosettings <setting>:<value>\nSettings: avatarVisible, previewPanelPosition, gestureRecognition, autonomousDisplay",
      });
    }
    return handleVideoPreferences(sock, jid, args[0], args[1]);
  }

  if (command === "!language") {
    const lang = normalized.slice(command.length).trim();
    if (!lang) {
      return sock.sendMessage(jid, {
        text: "🌐 Usage: !language <code>\nAvailable: en, es, fr, de, sw, ar, zh",
      });
    }
    return handleLanguagePreference(sock, jid, lang);
  }

  if (command === "!responsemode") {
    const mode = normalized.slice(command.length).trim();
    if (!mode) {
      return sock.sendMessage(jid, {
        text: "💬 Usage: !responsemode <mode>\nAvailable: professional, casual, technical, friendly",
      });
    }
    return handleResponseMode(sock, jid, mode);
  }

  try {
    // Apply user preferences to the query
    const queryWithPrefs = applyUserPreferences(jid, { text: normalized });
    const reply = await askQmoi(queryWithPrefs);
    await sock.sendMessage(jid, { text: reply });
    return reply;
  } catch (error) {
    logger.error("handleText failed", { jid, error: error?.message || error });
    await sock.sendMessage(jid, {
      text: "⚠️ Sorry, I could not process your request right now. Please try again later.",
    });
  }
};
