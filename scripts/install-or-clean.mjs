#!/usr/bin/env node
/**
 * install-or-clean.mjs
 * Robust installer with:
 * ✅ Detect npm/npx executable
 * ✅ Runs npm-force-resolutions if available
 * ✅ Exponential backoff retries (6 attempts)
 * ✅ Cleans node_modules & lockfiles if final retry fails
 * ✅ Supports --run-builds & --publish flags
 */

import fs from "fs";
import path from "path";
import { execSync, spawnSync } from "child_process";

const cwd = process.cwd();
const args = process.argv.slice(2);
const runBuilds = args.includes("--run-builds");
const runPublish = args.includes("--publish");

function log(...args) {
  console.log(...args);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function findExecutable(execName) {
  try {
    if (process.platform === "win32") {
      const output = execSync(`where ${execName}`, { encoding: "utf-8" }).trim();
      for (const line of output.split(/\r?\n/)) {
        if (
          fs.existsSync(line) &&
          (line.endsWith(".exe") || line.endsWith(".cmd") || line.endsWith(".bat")) &&
          !line.toLowerCase().startsWith(cwd.toLowerCase())
        ) {
          return line;
        }
      }
    } else {
      const output = execSync(`which ${execName}`, { encoding: "utf-8" }).trim();
      if (fs.existsSync(output) && !output.startsWith(cwd)) return output;
    }
  } catch {
    // Not found
  }
  return null;
}

async function runCommand(command, args, options = {}) {
  log("RUN =>", command, ...args);
  const result = spawnSync(command, args, { stdio: "inherit", shell: true, ...options });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`Command failed: ${command} ${args.join(" ")}`);
  return result.status;
}

async function main() {
  if (process.env.INSTALL_CLEAN_RUNNING) {
    log("install-or-clean already running, skipping to prevent recursion...");
    return;
  }
  process.env.INSTALL_CLEAN_RUNNING = "true";

  log("=== Starting install-or-clean process ===");

  // Ensure PATH includes Node.js bin path
  let envPath = process.env.PATH || process.env.Path || "";
  const nodeBin = process.platform === "win32" ? "C:\\Program Files\\nodejs" : "/usr/local/bin";
  if (!envPath.toLowerCase().includes(nodeBin.toLowerCase())) {
    envPath = `${nodeBin};${envPath}`;
    process.env.PATH = envPath;
    log(`Auto-fixed PATH by appending default Node.js bin path: ${nodeBin}`);
  }

  const npmPath = findExecutable("npm");
  const npxPath = findExecutable("npx");

  if (!npmPath) {
    log("ERROR: npm executable not found in PATH.");
    process.exit(1);
  }
  if (!npxPath) {
    log("WARNING: npx executable not found in PATH. npm-force-resolutions might fail.");
  }

  log("Detected npm executable at:", npmPath);
  log("Detected npx executable at:", npxPath);

  // Ensure minimal package-lock.json if missing
  const pkgLockPath = path.resolve(cwd, "package-lock.json");
  if (!fs.existsSync(pkgLockPath)) {
    log("Created minimal package-lock.json to allow npm-force-resolutions to run.");
    fs.writeFileSync(
      pkgLockPath,
      JSON.stringify({ name: "placeholder", lockfileVersion: 2, requires: true, packages: {} }, null, 2)
    );
  }

  // Run npm-force-resolutions if possible
  if (npxPath) {
    try {
      await runCommand(npxPath, ["npm-force-resolutions"]);
      log("npm-force-resolutions ran successfully.");
    } catch {
      log("npm-force-resolutions failed or not installed. Continuing without it.");
    }
  } else {
    log("Skipping npm-force-resolutions because npx is not found.");
  }

  // Retry npm install with exponential backoff
  const maxRetries = 6;
  let delay = 1000;
  let success = false;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await runCommand(npmPath, ["install", "--ignore-scripts"]);
      success = true;
      break;
    } catch (e) {
      log(`Install attempt ${attempt} failed. Waiting ${delay}ms before retry...`);
      await sleep(delay);
      delay *= 2;
    }
  }

  if (!success) {
    log("All install attempts failed. Cleaning up and retrying once more...");

    const nodeModulesPath = path.resolve(cwd, "node_modules");
    const yarnLockPath = path.resolve(cwd, "yarn.lock");

    try {
      if (fs.existsSync(nodeModulesPath)) {
        fs.rmSync(nodeModulesPath, { recursive: true, force: true });
        log("Deleted node_modules folder.");
      }
      if (fs.existsSync(pkgLockPath)) {
        fs.unlinkSync(pkgLockPath);
        log("Deleted package-lock.json.");
      }
      if (fs.existsSync(yarnLockPath)) {
        fs.unlinkSync(yarnLockPath);
        log("Deleted yarn.lock.");
      }

      log("Running 'npm cache clean --force'");
      await runCommand(npmPath, ["cache", "clean", "--force"]);

      await runCommand(npmPath, ["install", "--ignore-scripts"]);
      success = true;
    } catch (e) {
      log("Cleanup install attempt failed:", e);
      process.exit(1);
    }
  }

  if (!success) {
    log("Installation failed after cleanup retry. Exiting.");
    process.exit(1);
  }

  // Build if --run-builds
  if (runBuilds) {
    log("Running builds as --run-builds flag detected.");
    try {
      await runCommand(npmPath, ["run", "build:web"]);
      await runCommand(npmPath, ["run", "build:electron:all"]);
      await runCommand(npmPath, ["run", "build:android"]);
      await runCommand(npmPath, ["run", "build-windows-installer"]);
      log("Builds completed successfully.");
    } catch (e) {
      log("Build process failed:", e);
      process.exit(1);
    }
  }

  // Publish if --publish
  if (runPublish) {
    log("Running publish as --publish flag detected.");
    try {
      await runCommand(npmPath, ["run", "publish-release"]);
      log("Publish completed successfully.");
    } catch (e) {
      log("Publish process failed:", e);
      process.exit(1);
    }
  }

  log("=== install-or-clean process completed successfully ===");
}

main().catch((err) => {
  console.error("Fatal error in install-or-clean:", err);
  process.exit(1);
});
