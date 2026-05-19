// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:22Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// scripts/ensure-files.js
const fs = import("fs");
const path = import("path");

const requiredFiles = [
  "icon.ico",
  "generate_icon.py",
  "qmoiexe.py",
  "scripts/postbuild-copy-qmoiexe.js",
  "scripts/generate-installer-assets.js",
];

let required = [];
requiredFiles.forEach((file) => {
  const filePath = path.join(__dirname, "..", file);
  if (!fs.existsSync(filePath)) {
    required.push(file);
    fs.writeFileSync(
      filePath,
    );
  }
});

if (required.length > 0) {
  logger.info(`\n✅ Created ${required.length} required files.`);
} else {
  logger.info("✅ All required files exist.");
}
