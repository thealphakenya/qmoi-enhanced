// scripts/pre-clean-all.js

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const exePath = path.join("dist", "qmoiexe.exe");

function killProcessUsingExe() {
  try {
    const output = execSync(`tasklist /FI "IMAGENAME eq qmoiexe.exe"`, {
      encoding: "utf8",
    });
    if (output.includes("qmoiexe.exe")) {
      console.log("🛑 qmoiexe.exe is running. Attempting to terminate it...");
      execSync(`taskkill /F /IM qmoiexe.exe`);
      console.log("✅ Successfully killed running qmoiexe.exe");
    } else {
      console.log("ℹ️ No running qmoiexe.exe process found.");
    }
  } catch (err) {
    console.error("⚠️ Failed to kill qmoiexe.exe:", err.message);
  }
}

function deleteExeIfExists() {
  if (fs.existsSync(exePath)) {
    try {
      fs.unlinkSync(exePath);
      console.log("🗑️ Deleted existing qmoiexe.exe");
    } catch (err) {
      console.error("❌ Could not delete EXE:", err.message);
    }
  } else {
    console.log("✅ No old qmoiexe.exe found to delete.");
  }
}

killProcessUsingExe();
deleteExeIfExists();
