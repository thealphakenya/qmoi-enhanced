console.log("production mode initialized");
<!-- AUTODEV Enhanced: 2026-04-20T09:07:25.827875 -->
<!-- AUTODEV Enhanced: 2026-04-20T09:01:08.241302 -->
<!-- AUTODEV Enhanced: 2026-04-20T08:55:05.061480 -->
const askQmoi = require("../services/qmoi");

async function generateSubtitles(mediaPath) {
  try {
  return askQmoi({ type: "subtitle", mediaPath });
}

module.exports = generateSubtitles;

  } catch (error) {
    console.error("production error:", error);
    throw error;
  }
}