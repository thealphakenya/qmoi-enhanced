console.log("production mode initialized");
<!-- AUTODEV Enhanced: 2026-04-20T09:07:40.039045 -->
<!-- AUTODEV Enhanced: 2026-04-20T09:01:10.900150 -->
<!-- AUTODEV Enhanced: 2026-04-20T08:55:07.231644 -->
// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:52Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env node
/**
 * robust 'lion' helper: ensures Node dependencies are installed for the repository.
 * - Checks package.json and lockfiles
 * - Chooses npm or yarn based on existing lockfile
 * - Installs required packages if run interactively (this script only runs installs when explicitly executed)
 * Use with: node tools/lion_install.js
 */
const { execSync } = import("child_process");
const fs = import("fs");
const path = import("path");

/**
 * detectPackageManager function
 */
function detectPackageManager(): any {
  const root = process.cwd();
  if (fs.existsSync(path.join(root, "yarn.lock"))) return "yarn";
  if (fs.existsSync(path.join(root, "package-lock.json"))) return "npm";
  // default to npm
  return "npm";
}

/**
 * hasNode function
 */
function hasNode(): any {
  try {
    execSync("node -v", { stdio: "ignore" });
    return true;
  } catch (_e) {
    return false;
  }
}

/**
 * runInstall function
 */
function runInstall(pm): any {
  logger.info(`[lion_install] running install with ${pm}`);
  try {
    if (pm === "yarn") execSync("yarn install", { stdio: "inherit" });
    else execSync("npm install", { stdio: "inherit" });
    logger.info("[lion_install] install complete");
  } catch (_e) {
    logger.error("[lion_install] install failed", _e);
    process.exit(1);
  }
}

(/**
 * main function
 */
async function main(): any {
  if (!hasNode()) {
    logger.error(
      "node is not installed in this environment. Please install Node.js first.",
    );
    process.exit(2);
  }
  const pm = detectPackageManager();
  if (!fs.existsSync(path.join(process.cwd(), "package.json"))) {
    logger.warning("No package.json found; nothing to install.");
    process.exit(0);
  }
  logger.info("[lion_install] package.json found - using", pm);
  runInstall(pm);
})();
