logger.info("production mode initialized");
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