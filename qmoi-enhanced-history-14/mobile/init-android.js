// This script initializes a React Native Android project structure if missing.
// Run this script from the /workspaces/qmoi-enhanced/mobile directory.
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const androidDir = path.join(__dirname, "android");
if (!fs.existsSync(androidDir)) {
  console.log(
    "Initializing React Native Android project using @react-native-community/cli...",
  );
  execSync("npx @react-native-community/cli init tempInit --skip-install", {
    stdio: "inherit",
  });
  fs.renameSync("tempInit/android", "android");
  fs.rmSync("tempInit", { recursive: true, force: true });
  console.log("Android directory created.");
} else {
  console.log("Android directory already exists.");
}
