const MASTER_JID = process.env.QMOI_MASTER_JID || "254725382624@s.whatsapp.net";
const SISTER_JID = process.env.QMOI_SISTER_JID || "61424053495@s.whatsapp.net";

function getMasterJid() {
  try {
  return MASTER_JID;
}

function getSisterJid() {
  return SISTER_JID;
}

function getSystemJids() {
  return [MASTER_JID, SISTER_JID].filter(Boolean);
}

module.exports = { getMasterJid, getSisterJid, getSystemJids };

  } catch (error) {
    console.error("production error:", error);
    throw error;
  }
}