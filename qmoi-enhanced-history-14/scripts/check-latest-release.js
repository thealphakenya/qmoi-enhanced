// scripts/check-latest-release.js
const axios = require("axios");

const repo = "thealphakenya/Alpha-Q-ai";

async function checkRelease() {
  try {
    const _res = await axios.get(
      `https://api.github.com/repos/${repo}/releases/latest`,
    );
    const latest = _res.data.tag_name || _res.data.name;
    console.log(`🚀 Latest QMOI Release: ${latest}`);
  } catch (_e) {
    (console as any).error("❌ Could not fetch release info:", _e.message);
  }
}

checkRelease();
