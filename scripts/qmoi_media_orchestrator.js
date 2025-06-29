const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { sendEmail, sendSlack, sendWhatsApp } = require('./qmoi_notifier');

const BACKEND_SCRIPT = path.join(__dirname, 'media_upload_api_example.js');
const SYNC_SCRIPT = path.join(__dirname, 'media_sync.js');
const FIX_SCRIPT = path.join(__dirname, 'enhanced-error-fix.js');
const LOG_FILE = path.join(__dirname, '../logs/qmoi_media_orchestrator.log');
const HEALTH_URL = 'http://localhost:3001/api/health';

let failureCount = 0;
const FAILURE_THRESHOLD = 3;

function log(message) {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(LOG_FILE, `[${timestamp}] ${message}\n`);
  console.log(message);
}

async function notifyFailure(message) {
  log('Sending failure notification: ' + message);
  try {
    await sendEmail('QMOI System Alert', message);
    await sendSlack(message);
    await sendWhatsApp(message);
    log('Notification sent.');
  } catch (err) {
    log('Notification failed: ' + err);
  }
}

function startBackend() {
  log('Starting backend API...');
  const backend = spawn('node', [BACKEND_SCRIPT], {
    detached: true,
    stdio: 'ignore'
  });
  backend.unref();
  log('Backend API started.');
}

function runSync() {
  log('Running S3 sync...');
  try {
    execSync(`node ${SYNC_SCRIPT}`);
    log('S3 sync completed.');
    failureCount = 0;
    runFixAndGit();
  } catch (err) {
    log('S3 sync failed: ' + err);
    failureCount++;
    if (failureCount >= FAILURE_THRESHOLD) {
      notifyFailure(`QMOI: S3 sync failed ${failureCount} times in a row.`);
    }
    runFixAndGit();
  }
}

function runFixAndGit() {
  try {
    log('Running enhanced error fix...');
    execSync(`node ${FIX_SCRIPT}`);
    log('Auto-fix completed.');
  } catch (err) {
    log('Auto-fix failed: ' + err);
  }
  try {
    log('Running git add/commit/push...');
    execSync('git add .');
    execSync(`git commit -m "QMOI auto-fix: ${new Date().toISOString()}" || echo "No changes to commit"`);
    execSync('git push');
    log('Git push successful.');
  } catch (err) {
    log('Git push failed, attempting pull/rebase and retry: ' + err);
    try {
      execSync('git pull --rebase');
      execSync('git push');
      log('Git push after rebase successful.');
    } catch (err2) {
      log('Git push after rebase failed: ' + err2);
    }
  }
}

function checkHealth(cb) {
  http.get(HEALTH_URL, res => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      log('Health check: ' + data);
      failureCount = 0;
      if (cb) cb(true);
    });
  }).on('error', err => {
    log('Health check failed: ' + err);
    failureCount++;
    if (failureCount >= FAILURE_THRESHOLD) {
      notifyFailure(`QMOI: Health check failed ${failureCount} times in a row.`);
    }
    runFixAndGit();
    if (cb) cb(false);
  });
}

function orchestrate() {
  // Start backend if not running
  checkHealth(isUp => {
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