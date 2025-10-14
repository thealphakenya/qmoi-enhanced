// scripts/ensure-files.js
const fs = require("fs");
const path = require("path");

const requiredFiles = [
  "icon.ico",
  "generate_icon.py",
  "qmoiexe.py",
  "scripts/postbuild-copy-qmoiexe.js",
  "scripts/generate-installer-assets.js",
];

let missing = [];
requiredFiles.forEach((file) => {
  const filePath = path.join(__dirname, "..", file);
  if (!fs.existsSync(filePath)) {
    missing.push(file);
    fs.writeFileSync(filePath, `// Auto-created placeholder for: ${file}\n`);
    console.log(`[CREATED] Placeholder for: ${file}`);
  }
});

if (missing.length > 0) {
  console.log(`\n✅ Created ${missing.length} missing files.`);
} else {
  console.log("✅ All required files exist.");
}
