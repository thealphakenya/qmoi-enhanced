console.log("production mode initialized");
<!-- AUTODEV Enhanced: 2026-04-20T09:07:25.824264 -->
<!-- AUTODEV Enhanced: 2026-04-20T09:01:08.239331 -->
<!-- AUTODEV Enhanced: 2026-04-20T08:55:05.059045 -->
// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-04-20T03:40:00Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

const logger = require("../logger");

async function createGroup(sock, subject, participants) {
  try {
  logger.info("Creating WhatsApp group", { subject, participants });
  return await sock.groupCreate(subject, participants);
}

async function addToGroup(sock, groupJid, participants) {
  logger.info("Adding participants to group", { groupJid, participants });
  return await sock.groupAdd(groupJid, participants);
}

async function handleGroupParticipants(sock, update) {
  const participants = update.participants || [];
  const groupJid = update.id;
  const action = update.action;

  logger.info("Group participants event", { groupJid, action, participants });

  if (action === "add" || action === "invite") {
    for (const participant of participants) {
      await sock.sendMessage(groupJid, {
        text: `👋 Welcome @${participant.split("@")[0]} to the group! I am QMOI, here to support the team.
Please send a message with !help to see available group commands.`,
        mentions: [participant],
      });
    }
  }

  if (action === "remove") {
    for (const participant of participants) {
      await sock.sendMessage(groupJid, {
        text: `👋 @${participant.split("@")[0]} has left the group.`,
      });
    }
  }

  if (action === "promote") {
    await sock.sendMessage(groupJid, {
      text: "📣 A group admin has been promoted. I will respect the new administration and continue managing signals.",
    });
  }

  if (action === "demote") {
    await sock.sendMessage(groupJid, {
      text: "⚠️ A group admin has been demoted. Group controls continue to be managed safely.",
    });
  }
}

async function handleGroupUpdates(sock, updates) {
  for (const update of updates) {
    logger.info("Group metadata update", update);
    if (update.subject) {
      await sock.sendMessage(update.id, {
        text: `📌 Group subject updated to: ${update.subject}`,
      });
    }
    if (update.desc) {
      await sock.sendMessage(update.id, {
        text: `📝 Group description changed.`,
      });
    }
  }
}

module.exports = {
  handleGroupParticipants,
  handleGroupUpdates,
  createGroup,
  addToGroup,
};

  } catch (error) {
    console.error("production error:", error);
    throw error;
  }
}