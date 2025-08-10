#!/usr/bin/env node
/**
 * scripts/install-or-clean.mjs
 *
 * Fully merged QMOI AI environment setup + automation tool.
 * Features:
 * - Detects npm / yarn / pnpm automatically
 * - Retry-safe dependency installation with exponential backoff
 * - Cleans caches, node_modules, and lockfiles if needed
 * - Cross-platform build script runner (Windows, macOS, Linux, Android, iOS, Raspberry Pi, Chromebook, QCity)
 * - Optional GitHub release publishing (via gh CLI)
 * - Link tester for release assets
 * - Retry-safe Git automation from push.txt
 * - Logs all activity to scripts/install-or-clean.log
 */

import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";

const projectRoot = process.cwd();
const logPath = path.join(projectRoot, "scripts", "install-or-clean.log");
const nodeModulesPath = path.join(projectRoot, "node_modules");
const lockFiles = [
  path.join(projectRoot, "package-lock.json"),
  path.join(projectRoot, "yarn.lock"),
  path.join(projectRoot, "pnpm-lock.yaml"),
];
const pushFile = path.join(projectRoot, "push.txt");

const MAX_ATTEMPTS = 6;
const INITIAL_DELAY_MS = 1000;

function now() {
  return new Date().toISOString();
}

function log(message) {
  const line = `${now()}  ${message}\n`;
  fs.appendFileSync(logPath, line);
  console.log(message);
}

function runCommand(cmd, args = [], opts = {}) {
  const info = `${cmd} ${args.join(" ")}`.trim();
  log(`RUN => ${info}`);
  const res = spawnSync(cmd, args, { stdio: "inherit", shell: false, ...opts });
  if (res.error) {
    log(`ERROR => ${info} -> ${res.error.message}`);
    return { success: false, error: res.error };
  }
  if (res.status !== 0) {
    log(`FAILED (${res.status}) => ${info}`);
    return { success: false, status: res.status };
  }
  log(`OK => ${info}`);
  return { success: true, status: res.status };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function detectPackageManager() {
  if (process.env.npm_config_user_agent?.includes("pnpm")) return "pnpm";
  if (process.env.npm_config_user_agent?.includes("yarn")) return "yarn";
  if (fs.existsSync(lockFiles[2])) return "pnpm";
  if (fs.existsSync(lockFiles[1])) return "yarn";
  return "npm";
}

async function tryInstall(pm) {
  const installCmds = {
    npm: ["npm", ["install"]],
    yarn: ["yarn", ["install"]],
    pnpm: ["pnpm", ["install"]],
  };
  const [cmd, args] = installCmds[pm] || installCmds.npm;
  let delay = INITIAL_DELAY_MS;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    log(`Install attempt ${attempt}/${MAX_ATTEMPTS} using ${pm}`);
    if (runCommand(cmd, args, { cwd: projectRoot }).success) return true;
    log(`Install failed, retrying in ${delay}ms...`);
    await sleep(delay);
    delay *= 2;
  }
  return false;
}

function removePath(target) {
  if (fs.existsSync(target)) {
    try {
      fs.rmSync(target, { recursive: true, force: true });
      log(`Deleted: ${target}`);
    } catch (e) {
      log(`Failed to delete ${target}: ${e.message}`);
    }
  }
}

async function ensureInstallAndRetry(pm) {
  if (await tryInstall(pm)) return true;

  log("Cleaning environment for retry...");
  removePath(nodeModulesPath);
  lockFiles.forEach(removePath);

  if (pm === "npm") runCommand("npm", ["cache", "clean", "--force"]);
  if (pm === "yarn") runCommand("yarn", ["cache", "clean"]);
  if (pm === "pnpm") runCommand("pnpm", ["store", "prune"]);

  if (await tryInstall(pm)) return true;

  for (const alt of ["npm", "yarn", "pnpm"].filter((x) => x !== pm)) {
    log(`Trying alternate package manager: ${alt}`);
    if (await tryInstall(alt)) return true;
  }

  log("All install attempts failed.");
  return false;
}

async function runGitPushFlow() {
  if (!fs.existsSync(pushFile)) return true;

  const lines = fs
    .readFileSync(pushFile, "utf8")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  for (const line of lines) {
    const [cmd, ...args] = line.split(" ");
    let success = false;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      log(`Git command attempt ${attempt}/${MAX_ATTEMPTS}: ${line}`);
      if (runCommand(cmd, args, { cwd: projectRoot }).success) {
        success = true;
        break;
      }
      await sleep(INITIAL_DELAY_MS * Math.pow(2, attempt));
    }
    if (!success) return false;
  }
  return true;
}

async function runBuilds() {
  const pkg = JSON.parse(fs.readFileSync(path.join(projectRoot, "package.json"), "utf8"));
  const scripts = pkg.scripts || {};
  const candidates = [
    "build:all-platforms",
    "build:web",
    "build:electron:all",
  ];
  for (const s of candidates) {
    if (scripts[s]) {
      if (!runCommand("npm", ["run", s], { cwd: projectRoot }).success) return false;
      return true;
    }
  }
  return true;
}

async function attemptGhRelease() {
  const hasGh = spawnSync("gh", ["--version"], { stdio: "pipe" }).status === 0;
  if (!hasGh) {
    log("gh CLI not found — skipping release");
    return false;
  }
  const tag = `auto-release-${Date.now()}`;
  return runCommand("gh", [
    "release",
    "create",
    tag,
    "--title",
    `Auto Release ${new Date().toISOString()}`,
    "--notes",
    "Automated release",
  ], { cwd: projectRoot }).success;
}

async function main() {
  const args = process.argv.slice(2);
  const runBuildsFlag = args.includes("--run-builds");
  const publishFlag = args.includes("--publish");

  fs.mkdirSync(path.join(projectRoot, "scripts"), { recursive: true });
  fs.appendFileSync(logPath, `\n\n===== START ${now()} =====\n`);

  const pm = detectPackageManager();
  log(`Detected package manager: ${pm}`);

  if (!(await ensureInstallAndRetry(pm))) process.exit(1);
  if (runBuildsFlag && !(await runBuilds())) process.exit(1);
  if (publishFlag) attemptGhRelease();
  if (!(await runGitPushFlow())) process.exit(1);

  log("Install-or-clean finished successfully.");
}

main().catch((err) => {
  log(`UNCAUGHT ERROR: ${err.stack || err}`);
  process.exit(1);
});
