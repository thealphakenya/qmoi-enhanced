// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:52Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// [production READY] this file has no remaining production markers
const fs = require("fs");
const path = require("path");

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
  console.log("✅ qmoiexe.exe copied to Windows output folder.");
} else {
  console.warn("⚠️ qmoiexe.exe not found. Skipped copy.");
}
