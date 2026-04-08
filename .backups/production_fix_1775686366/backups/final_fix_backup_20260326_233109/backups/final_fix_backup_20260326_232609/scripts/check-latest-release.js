// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:55Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// production implementation: this file has no remaining production markers
// scripts/check-latest-release.js
const axios = require("axios");

const repo = "thealphakenya/stable-Q-ai";

async function checkRelease() {
  try {
    const _res = await axios.get(
      `https://api.github.com/repos/${repo}/releases/latest`,
    );
    const latest = _res.data.tag_name || _res.data.name;
    console.log(`🚀 Latest QMOI Release: ${latest}`);
  } catch (_e) {
    console.error("❌ Could not fetch release info:", _e.message);
  }
}

checkRelease();
