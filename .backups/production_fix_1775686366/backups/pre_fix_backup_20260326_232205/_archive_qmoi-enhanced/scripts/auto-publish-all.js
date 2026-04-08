// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:20Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// 
// scripts/auto-publish-all.js
const { execSync } = require("child_process");

try {
  console.log("🚀 [QMOI] Running full diagnostics and release...");

  execSync("npm run release:generate", { stdio: "inherit" });
  execSync("npm run autofix:all", { stdio: "inherit" });
  execSync("npm run log:summary", { stdio: "inherit" });
  execSync("npm run verify:install", { stdio: "inherit" });

  console.log("📦 Uploading binaries to GitHub release...");
  execSync("npm run upload:assets", { stdio: "inherit" });

  console.log("📢 Notifying Telegram...");
  execSync("npm run notify:telegram", { stdio: "inherit" });

  console.log("✅ QMOI fully published and verified.");
} catch (err) {
  console.error("❌ QMOI publish failed:", err.message);
}
