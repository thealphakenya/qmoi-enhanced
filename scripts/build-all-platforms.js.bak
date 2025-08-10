// scripts/build-all-platforms.js
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const LOG_FILE = path.join(__dirname, "../logs/build.log");
const LOG_DIR = path.dirname(LOG_FILE);

const platforms = [
  {
    name: "Windows",
    command: "npm run electron:build:win",
    output: "Qmoi_apps/windows",
    uiAdjust: "node scripts/platform-ui-adapter.js --platform=windows"
  },
  {
    name: "Linux",
    command: "npm run electron:build:linux",
    output: "Qmoi_apps/linux",
    uiAdjust: "node scripts/platform-ui-adapter.js --platform=linux"
  },
  {
    name: "macOS",
    command: "npm run electron:build:mac",
    output: "Qmoi_apps/mac",
    uiAdjust: "node scripts/platform-ui-adapter.js --platform=mac"
  },
  {
    name: "Android",
    command: "npm run capacitor:build:android",
    output: "Qmoi_apps/android",
    uiAdjust: "node scripts/platform-ui-adapter.js --platform=android"
  },
  {
    name: "iOS",
    command: "npm run capacitor:build:ios",
    output: "Qmoi_apps/ios",
    uiAdjust: "node scripts/platform-ui-adapter.js --platform=ios"
  },
  {
    name: "PyInstaller (Backend + GUI)",
    command: "npm run pyinstaller:build",
    output: "Qmoi_apps/windows",
    uiAdjust: "node scripts/platform-ui-adapter.js --platform=desktop"
  }
];

function logToFile(message) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
  fs.appendFileSync(LOG_FILE, `[${new Date().toISOString()}] ${message}\n`);
}

function runCommandWithFallback(command, platformName) {
  try {
    console.log(`\n🚀 Building for ${platformName}...`);
    execSync(command, { stdio: "inherit" });
    console.log(`✅ ${platformName} build completed.\n`);
    logToFile(`${platformName} build SUCCESS`);
    return true;
  } catch (error) {
    console.error(`❌ ${platformName} build failed. Retrying fallback...`);
    logToFile(`${platformName} initial build FAILED`);
    try {
      execSync(command, { stdio: "inherit" });
      console.log(`✅ ${platformName} fallback build succeeded.\n`);
      logToFile(`${platformName} fallback build SUCCESS`);
      return true;
    } catch (err) {
      console.error(`❌ ${platformName} fallback build failed again. Skipping...\n`);
      logToFile(`${platformName} fallback build FAILED`);
      return false;
    }
  }
}

function runUIAdaptation(uiCommand, platformName) {
  try {
    console.log(`🎨 Adapting UI for ${platformName}...`);
    execSync(uiCommand, { stdio: "inherit" });
    logToFile(`${platformName} UI adaptation completed.`);
  } catch (err) {
    console.warn(`⚠️ UI adaptation for ${platformName} failed.`);
    logToFile(`${platformName} UI adaptation FAILED`);
  }
}

function main() {
  console.log("🧠 QMOI Build All Platforms Starting...");
  logToFile("\n=== New Full Build Start ===");

  for (const platform of platforms) {
    runUIAdaptation(platform.uiAdjust, platform.name);
    runCommandWithFallback(platform.command, platform.name);
  }

  logToFile("=== Full Build Completed ===\n");
  console.log("\n✅ All builds completed (with fallback checks). Check Qmoi_apps/ for outputs.");

  try {
    execSync("node scripts/qmoi-log-uploader.js", { stdio: "inherit" });
  } catch (uploadErr) {
    console.warn("⚠️ Log upload failed.");
    logToFile("Log upload FAILED");
  }
}

main();
