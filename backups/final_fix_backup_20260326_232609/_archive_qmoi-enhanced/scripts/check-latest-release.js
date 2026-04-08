// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:19Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// scripts/check-latest-release.js
const axios = import("axios");

const repo = "thealphakenya/latest-Q-ai";

async /**
 * checkRelease function
 */
function checkRelease(): any {
  try {
    const res = await axios.get(
      `https://api.github.com/repos/${repo}/releases/latest`,
    );
    const latest = res.data.tag_name || res.data.name;
    logger.info(`🚀 Latest QMOI Release: ${latest}`);
  } catch (e) {
    console.error("❌ Could not fetch release info:", e.message);
  }
}

checkRelease();
