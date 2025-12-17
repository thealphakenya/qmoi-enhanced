// scripts/qmoi-autofixer.js
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

console.log("🛠️ [QMOI AUTOFIXER] Starting full-platform check...");

// Define expected applications with platform and size thresholds (MB)
const APPS = [
  {
    name: "QMOI Android APK",
    file: "Qmoi_apps/android/qmoi ai.apk",
    minSizeMB: 30,
  },
  {
    name: "QMOI Windows EXE",
    file: "Qmoi_apps/windows/qmoi_ai.exe",
    minSizeMB: 45,
  },
  {
    name: "QMOI macOS (Intel)",
    file: "Qmoi_apps/macos/qmoi_mac_intel.app",
    minSizeMB: 60,
  },
  {
    name: "QMOI macOS (ARM)",
    file: "Qmoi_apps/macos/qmoi_mac_arm.app",
    minSizeMB: 60,
  },
  { name: "QMOI iOS IPA", file: "Qmoi_apps/ios/qmoi_ai.ipa", minSizeMB: 50 },
  {
    name: "QMOI Linux x64",
    file: "Qmoi_apps/linux/qmoi_linux_x64.AppImage",
    minSizeMB: 40,
  },
  {
    name: "QMOI RaspberryPi",
    file: "Qmoi_apps/pi/qmoi_pi_armv7l",
    minSizeMB: 35,
  },
  {
    name: "QMOI Chromebook",
    file: "Qmoi_apps/chromebook/qmoi_chrome.crx",
    minSizeMB: 15,
  },
  {
    name: "QMOI QCity OS",
    file: "Qmoi_apps/qcity/qmoi_qcity.pkg",
    minSizeMB: 50,
  },
];

// Repair a missing file via git (if under version control)
function repairMissingFile(file) {
  try {
    console.warn(`⚠️ Attempting to recover missing file: ${file}`);
    execSync(`git checkout -- "${file}"`, { stdio: "inherit" });
  } catch (err) {
    console.error(`❌ Recovery failed for: ${file}`);
  }
}

// Validate file presence and size
function validateApp(app) {
  const filePath = path.resolve(app.file);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ MISSING: ${app.name} (${app.file})`);
    repairMissingFile(app.file);
    return;
  }

  const sizeMB = fs.statSync(filePath).size / (1024 * 1024);
  if (sizeMB < app.minSizeMB * 0.9) {
    console.warn(
      `⚠️ SIZE WARNING: ${app.name} is too small (${sizeMB.toFixed(2)} MB, expected ≥ ${app.minSizeMB} MB)`,
    );
  } else {
    console.log(`✅ ${app.name}: ${sizeMB.toFixed(2)} MB`);
  }
}

// Validate all apps
APPS.forEach(validateApp);

console.log("✅ [QMOI AUTOFIXER] Platform validation completed.");
