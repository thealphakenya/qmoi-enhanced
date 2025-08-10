// scripts/pre-clean-all.js
import fs from 'fs';
import path from 'path';
import os from 'os';
import { execSync } from 'child_process';

const processesToKill = [
  "qmoiexe.exe",
  "qmoiexe",
  "electron.exe",
  "electron",
  "QMOI Setup.exe",
];

const filesToDelete = [
  "dist/qmoiexe.exe",
  "dist/QMOI Setup.exe",
  "dist/qmoi-alpha-ai.dmg",
  "dist/qmoi-alpha-ai.AppImage",
  "dist/qmoi-alpha-ai.deb",
  "android/app/build/outputs/apk/debug/app-debug.apk",
  "public/qmoiai_qrcode.png",
];

const foldersToDelete = [
  "build",
  "dist",
  "out",
  "public/i18n",
  "public/icons",
  "public/splash",
  "build-logs",
];

function killProcess(name) {
  try {
    if (os.platform() === "win32") {
      execSync(`taskkill /f /im ${name}`, { stdio: "ignore" });
    } else {
      const pid = execSync(`pgrep -f ${name}`).toString().trim();
      if (pid) execSync(`kill -9 ${pid}`);
    }
    console.log(`✅ Killed process: ${name}`);
  } catch {
    console.log(`ℹ️ Process not running or could not kill: ${name}`);
  }
}

function deleteFile(filePath) {
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      console.log(`✅ Deleted file: ${filePath}`);
    } catch {
      console.warn(`⚠️ Failed to delete file: ${filePath}`);
    }
  }
}

function deleteFolder(folderPath) {
  if (fs.existsSync(folderPath)) {
    try {
      fs.rmSync(folderPath, { recursive: true, force: true });
      console.log(`✅ Deleted folder: ${folderPath}`);
    } catch {
      console.warn(`⚠️ Failed to delete folder: ${folderPath}`);
    }
  }
}

function run() {
  console.log("🧹 Starting cleanup...");

  processesToKill.forEach(killProcess);
  filesToDelete.map(path.normalize).forEach(deleteFile);
  foldersToDelete.map(path.normalize).forEach(deleteFolder);

  console.log("✅ All clean. Ready for fresh build.");
}

run();
