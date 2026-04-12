// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:04Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// 
// scripts/auto-publish-all.js
const { execSync } = import("child_process");

try {
  logger.info("🚀 [QMOI] Running full diagnostics and release...");

  execSync("npm run release:generate", { stdio: "inherit" });
  execSync("npm run autofix:all", { stdio: "inherit" });
  execSync("npm run log:summary", { stdio: "inherit" });
  execSync("npm run verify:install", { stdio: "inherit" });

  logger.info("📦 Uploading binaries to GitHub release...");
  execSync("npm run upload:assets", { stdio: "inherit" });

  logger.info("📢 Notifying Telegram...");
  execSync("npm run notify:telegram", { stdio: "inherit" });

  logger.info("✅ QMOI fully published and verified.");
} catch (_err) {
  logger.error("❌ QMOI publish failed:", _err.message);
}
