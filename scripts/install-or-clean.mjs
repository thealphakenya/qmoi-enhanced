#!/usr/bin/env node
/**
 * scripts/install-or-clean.mjs
 *
 * Robust installer:
 * - ensures package-lock.json exists (creates minimal if missing)
 * - runs npx npm-force-resolutions (only after lock exists)
 * - detects package manager (npm / yarn / pnpm)
 * - installs with exponential backoff + retries
 * - on repeated failure, removes node_modules + lockfiles + caches and retries
 * - optional flags: --run-builds, --publish
 * - runs optional git push flow reading push.txt
 * - logs everything to scripts/install-or-clean.log
 */

import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";

const projectRoot = process.cwd();
const scriptsDir = path.join(projectRoot, "scripts");
const logPath = path.join(scriptsDir, "install-or-clean.log");
const nodeModulesPath = path.join(projectRoot, "node_modules");
const packageLock = path.join(projectRoot, "package-lock.json");
const yarnLock = path.join(projectRoot, "yarn.lock");
const pnpmLock = path.join(projectRoot, "pnpm-lock.yaml");
const pushFile = path.join(projectRoot, "push.txt");
const MAX_ATTEMPTS = 6;
const INITIAL_DELAY_MS = 1000;

function now() {
  return new Date().toISOString();
}

function ensureLog() {
  try {
    fs.mkdirSync(scriptsDir, { recursive: true });
  } catch {}
  if (!fs.existsSync(logPath)) fs.writeFileSync(logPath, `=== install-or-clean log created ${now()} ===\n`);
}

function log(msg) {
  ensureLog();
  const line = `[${now()}] ${msg}\n`;
  fs.appendFileSync(logPath, line);
  console.log(msg);
}

function runCommand(cmd, args = [], opts = {}) {
  const commandString = `${cmd} ${args.join(" ")}`.trim();
  log(`RUN => ${commandString}`);
  try {
    const res = spawnSync(cmd, args, { stdio: "inherit", shell: false, ...opts });
    if (res.error) {
      log(`ERROR => ${commandString} -> ${res.error.message}`);
      return { success: false, error: res.error };
    }
    if (res.status !== 0) {
      log(`FAILED (${res.status}) => ${commandString}`);
      return { success: false, status: res.status };
    }
    log(`OK => ${commandString}`);
    return { success: true, status: res.status };
  } catch (err) {
    log(`EXCEPTION => ${commandString} -> ${err?.message || String(err)}`);
    return { success: false, error: err };
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function detectPackageManager() {
  const ua = process.env.npm_config_user_agent || "";
  if (ua.includes("pnpm")) return "pnpm";
  if (ua.includes("yarn")) return "yarn";
  if (fs.existsSync(pnpmLock)) return "pnpm";
  if (fs.existsSync(yarnLock)) return "yarn";
  return "npm";
}

function ensurePackageLockExists() {
  // If package-lock.json missing, create a minimal one so npm-force-resolutions can run safely
  if (!fs.existsSync(packageLock)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(path.join(projectRoot, "package.json"), "utf8"));
      const minimal = {
        name: pkg.name || "project",
        version: pkg.version || "0.0.0",
        lockfileVersion: 2,
        requires: true,
        packages: {},
        dependencies: {}
      };
      fs.writeFileSync(packageLock, JSON.stringify(minimal, null, 2), "utf8");
      log("Created minimal package-lock.json to allow npm-force-resolutions to run.");
      return true;
    } catch (err) {
      log(`Failed to create minimal package-lock.json: ${err?.message}`);
      return false;
    }
  }
  return true;
}

async function runNpmForceResolutionsIfAvailable() {
  // only run if package-lock exists (ensured above)
  if (!ensurePackageLockExists()) return false;
  // try npx npm-force-resolutions
  try {
    log("Running npx npm-force-resolutions (if available)...");
    const r = runCommand("npx", ["npm-force-resolutions"], { cwd: projectRoot });
    if (!r.success) {
      log("npx npm-force-resolutions failed or not installed. Continuing.");
    }
    return true;
  } catch (err) {
    log(`npm-force-resolutions attempt failed: ${err?.message}`);
    return false;
  }
}

async function tryInstall(pm) {
  const installCmds = {
    npm: ["npm", ["install"]],
    yarn: ["yarn", ["install"]],
    pnpm: ["pnpm", ["install"]]
  };
  const [cmd, args] = installCmds[pm] || installCmds.npm;
  let attempt = 0;
  let delay = INITIAL_DELAY_MS;
  while (attempt < MAX_ATTEMPTS) {
    attempt++;
    log(`Install attempt ${attempt}/${MAX_ATTEMPTS} using ${pm}`);
    const res = runCommand(cmd, args, { env: process.env, cwd: projectRoot });
    if (res.success) return true;
    log(`Install attempt ${attempt} failed. Waiting ${delay}ms before retry...`);
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

async function ensureInstallAndRetry(pm = "npm") {
  log(`Ensuring install. Preferred package manager: ${pm}`);
  // run npm-force-resolutions only after ensuring lock exists
  await runNpmForceResolutionsIfAvailable();

  if (await tryInstall(pm)) {
    log("Initial install succeeded.");
    return true;
  }

  log("Initial install failed. Cleaning node_modules + lockfiles + caches and retrying...");
  removePath(nodeModulesPath);
  removePath(packageLock);
  removePath(yarnLock);
  removePath(pnpmLock);

  if (pm === "npm") runCommand("npm", ["cache", "clean", "--force"]);
  if (pm === "yarn") runCommand("yarn", ["cache", "clean"]);
  if (pm === "pnpm") runCommand("pnpm", ["store", "prune"]);

  if (await tryInstall(pm)) {
    log("Install succeeded after cleanup.");
    return true;
  }

  // try alternates
  const alternates = ["npm", "yarn", "pnpm"].filter((x) => x !== pm);
  for (const alt of alternates) {
    log(`Trying alternate package manager: ${alt}`);
    if (await tryInstall(alt)) {
      log(`Install succeeded with alternate package manager: ${alt}`);
      return true;
    }
  }

  log("All install attempts failed.");
  return false;
}

async function runGitPushFlow() {
  if (!fs.existsSync(pushFile)) {
    log(`No push.txt found at ${pushFile} — skipping git push flow.`);
    return true;
  }
  const content = fs.readFileSync(pushFile, "utf8");
  const lines = content.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  for (const line of lines) {
    const parts = line.split(" ").filter(Boolean);
    const cmd = parts[0];
    const args = parts.slice(1);
    let success = false;
    let attempt = 0;
    while (!success && attempt < MAX_ATTEMPTS) {
      attempt++;
      log(`Git command attempt ${attempt}/${MAX_ATTEMPTS}: ${line}`);
      const res = runCommand(cmd, args, { cwd: projectRoot });
      if (res.success) {
        success = true;
      } else {
        log(`Git command failed: ${line} — retrying after backoff`);
        await sleep(INITIAL_DELAY_MS * Math.pow(2, attempt));
      }
    }
    if (!success) {
      log(`Git command failed permanently after ${MAX_ATTEMPTS}: ${line}`);
      return false;
    }
  }
  log("Git push flow completed successfully.");
  return true;
}

async function runBuildsIfRequested() {
  const pkgPath = path.join(projectRoot, "package.json");
  if (!fs.existsSync(pkgPath)) {
    log("package.json missing — cannot run builds.");
    return true;
  }
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  const scripts = pkg.scripts || {};
  const candidates = ["build:all-platforms", "build:web", "build:electron:all"];
  for (const s of candidates) {
    if (scripts[s]) {
      log(`Running build script: npm run ${s}`);
      const res = runCommand("npm", ["run", s], { cwd: projectRoot });
      if (!res.success) {
        log(`Build script npm run ${s} failed.`);
        return false;
      }
      return true;
    }
  }
  log("No recognized build scripts found to run.");
  return true;
}

async function attemptGhRelease() {
  try {
    const r = spawnSync("gh", ["--version"], { stdio: "pipe" });
    if (r.status !== 0) {
      log("gh CLI not found — skipping GitHub release.");
      return false;
    }
  } catch {
    log("gh CLI not found — skipping GitHub release.");
    return false;
  }
  const tag = `auto-release-${Date.now()}`;
  log(`Creating GitHub release with tag ${tag}`);
  const create = runCommand("gh", ["release", "create", tag, "--title", `Auto Release ${new Date().toISOString()}`, "--notes", "Automated release"], { cwd: projectRoot });
  return create.success;
}

async function main() {
  ensureLog();
  fs.appendFileSync(logPath, `\n\n===== START ${now()} =====\n`);
  const args = process.argv.slice(2);
  const runBuildsFlag = args.includes("--run-builds");
  const publishFlag = args.includes("--publish");

  const pm = detectPackageManager();
  log(`Detected package manager: ${pm}`);

  const installed = await ensureInstallAndRetry(pm);
  if (!installed) {
    log("ERROR: Could not install dependencies after all retries. See log.");
    process.exit(1);
  }

  if (runBuildsFlag) {
    const b = await runBuildsIfRequested();
    if (!b) {
      log("Build step failed. Aborting.");
      process.exit(1);
    }
  }

  if (publishFlag) {
    const r = await attemptGhRelease();
    if (!r) {
      log("GitHub release attempt failed or skipped.");
    } else {
      log("GitHub release attempt succeeded.");
    }
  }

  const gitOk = await runGitPushFlow();
  if (!gitOk) {
    log("Git automation failed. Aborting with non-zero exit.");
    process.exit(1);
  }

  log("install-or-clean finished successfully.");
}

main().catch((err) => {
  ensureLog();
  log(`UNCAUGHT ERROR: ${err?.stack ?? String(err)}`);
  process.exit(1);
});
