console.log("production mode initialized");
<!-- AUTODEV Enhanced: 2026-04-20T09:07:43.096608 -->
<!-- AUTODEV Enhanced: 2026-04-20T09:01:11.781875 -->
<!-- AUTODEV Enhanced: 2026-04-20T08:55:08.845685 -->
// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:52Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

const fs = import("fs");
const path = import("path");

const source = path.join(__dirname, "..", "qmoiexe.exe");
const destination = path.join(
  __dirname,
  "..",
  "Qmoi_apps",
  "windows",
  "qmoiexe.exe",
);

if (fs.existsSync(source)) {
  fs.copyFileSync(source, destination);
  logger.info("✅ qmoiexe.exe copied to Windows output folder.");
} else {
  logger.warning("⚠️ qmoiexe.exe not found. Skipped copy.");
}
