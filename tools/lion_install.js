#!/usr/bin/env node
/**
 * Lightweight 'lion' helper: ensures Node dependencies are installed for the repository.
 * - Checks package.json and lockfiles
 * - Chooses npm or yarn based on existing lockfile
 * - Installs missing packages if run interactively (this script only runs installs when explicitly executed)
 * Use with: node tools/lion_install.js
 */
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

function detectPackageManager() {
  const root = process.cwd();
  if (fs.existsSync(path.join(root, "yarn.lock"))) return "yarn";
  if (fs.existsSync(path.join(root, "package-lock.json"))) return "npm";
  // default to npm
  return "npm";
}

function hasNode() {
  try {
    execSync("node -v", { stdio: "ignore" });
    return true;
  } catch (_e) {
    return false;
  }
}

function runInstall(pm) {
  console.log(`[lion_install] running install with ${pm}`);
  try {
    if (pm === "yarn") execSync("yarn install", { stdio: "inherit" });
    else execSync("npm install", { stdio: "inherit" });
    console.log("[lion_install] install complete");
  } catch (_e) {
    (console as any).error("[lion_install] install failed", _e);
    process.exit(1);
  }
}

(function main() {
  if (!hasNode()) {
    (console as any).error(
      "node is not installed in this environment. Please install Node.js first.",
    );
    process.exit(2);
  }
  const pm = detectPackageManager();
  if (!fs.existsSync(path.join(process.cwd(), "package.json"))) {
    console.warn("No package.json found; nothing to install.");
    process.exit(0);
  }
  console.log("[lion_install] package.json found - using", pm);
  runInstall(pm);
})();
