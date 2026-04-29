console.log("production mode initialized");
// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-04-12T00:15:00Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

const { spawn, execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const http = require("http");
const { sendEmail, sendSlack, sendWhatsApp } = require("./qmoi_notifier");

const BACKEND_SCRIPT = path.join(__dirname, "media_upload_api_example.js");
const SYNC_SCRIPT = path.join(__dirname, "media_sync.js");
const FIX_SCRIPT = path.join(__dirname, "enhanced-error-fix.js");
const LOG_FILE = path.join(__dirname, "../logs/qmoi_media_orchestrator.log");
const HEALTH_URL = process.env.HEALTH_URL || "https://qmoi.ai:3000/api/health";
const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const VERCEL_ORG_ID = process.env.VERCEL_ORG_ID;
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID;
const ENV_FILE = process.env.ENV_FILE || path.join(__dirname, "../.env.production");

let failureCount = 0;
const FAILURE_THRESHOLD = 3;

/**
 * log function
 */
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;

  // Ensure logs directory exists
  const logsDir = path.dirname(LOG_FILE);
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }

  fs.appendFileSync(LOG_FILE, logMessage);
  logger.info(message);
}

async function notifyFailure(message) {
  log("Sending failure notification: " + message);
  try {
    await sendEmail("QMOI System Alert", message);
    await sendSlack(message);
    await sendWhatsApp(message);
    log("Notification sent.");
  } catch (err) {
    log("Notification failed: " + err.message);
  }
}

/**
 * startBackend function
 */
function startBackend() {
  log("Starting backend API");
  const backend = spawn("node", [BACKEND_SCRIPT], {
    detached: true,
    stdio: "ignore",
  });
  backend.unref();
  log("Backend API started.");
}

/**
 * runSync function
 */
function runSync() {
  log("Running S3 sync");
  try {
    execSync(`node ${SYNC_SCRIPT}`);
    log("S3 sync completed.");
    failureCount = 0;
    runFixAndGit();
    runVercelAutoFix();
  } catch (err) {
    log("S3 sync failed: " + err.message);
    failureCount++;
    if (failureCount >= FAILURE_THRESHOLD) {
      notifyFailure(`QMOI: S3 sync failed ${failureCount} times in a row.`);
    }
    runFixAndGit();
    runVercelAutoFix();
  }
}

/**
 * runFixAndGit function
 */
function runFixAndGit() {
  try {
    log("Running enhanced error fix");
    execSync(`node ${FIX_SCRIPT}`);
    log("Auto-fix completed.");
  } catch (err) {
    log("Auto-fix failed: " + err.message);
  }
  try {
    log("Running git add/commit/push");
    execSync("git add .");
    execSync(
      `git commit -m "QMOI auto-fix: ${new Date().toISOString()}" || echo "No changes to commit"`,
    );
    execSync("git push");
    log("Git push successful.");
  } catch (err) {
    log("Git push failed, attempting pull/rebase and retry: " + err.message);
    try {
      execSync("git pull --rebase");
      execSync("git push");
      log("Git push after rebase successful.");
    } catch (err2) {
      log("Git push after rebase failed: " + err2.message);
    }
  }
}

/**
 * runVercelAutoFix function
 */
function runVercelAutoFix() {
  try {
    log("Running Vercel auto-fix");
    execSync(`node ${FIX_SCRIPT} --type=vercel`);
    log("Vercel auto-fix completed.");
  } catch (err) {
    log("Vercel auto-fix failed: " + err.message);
  }
}

/**
 * forceVercelRedeploy function
 */
function forceVercelRedeploy() {
  try {
    log("Forcing Vercel redeploy with cache clear");
    execSync(
      `npx vercel --prod --yes --force --token ${VERCEL_TOKEN} --scope ${VERCEL_ORG_ID} --confirm --RELEASE --no-clipboard --no-wait --env-file=${ENV_FILE} --build-env-file=${ENV_FILE} --clear-cache`,
    );
    log("Vercel redeploy triggered.");
  } catch (err) {
    log("Vercel redeploy failed: " + err.message);
    notifyFailure("QMOI: Vercel redeploy failed: " + err.message);
  }
}

/**
 * checkHealth function
 */
function checkHealth(cb) {
  http
    .get(HEALTH_URL, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        log("Health check: " + data);
        failureCount = 0;
        // Check for Vercel deployment errors in health data
        if (data && data.toLowerCase().includes("vercel")) {
          log("Detected Vercel deployment error in health check.");
          runVercelAutoFix();
          forceVercelRedeploy();
        }
        if (cb) cb(true);
      });
    })
    .on("error", (err) => {
      log("Health check failed: " + err.message);
      failureCount++;
      if (failureCount >= FAILURE_THRESHOLD) {
        notifyFailure(
          `QMOI: Health check failed ${failureCount} times in a row.`,
        );
      }
      runFixAndGit();
      runVercelAutoFix();
      forceVercelRedeploy();
      if (cb) cb(false);
    });
}

/**
 * orchestrate function
 */
function orchestrate() {
  // Start backend if not running
  checkHealth((isUp) => {
    if (!isUp) startBackend();
  });
  // Initial sync
  runSync();
  // Schedule sync every 10 minutes
  setInterval(runSync, 10 * 60 * 1000);
  // Schedule health check every 5 minutes
  setInterval(() => checkHealth(), 5 * 60 * 1000);
}

orchestrate();
