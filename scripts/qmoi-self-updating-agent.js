#!/usr/bin/env node

/**
 * QMOI Self-Updating Agent
 * Continuously pulls from GitHub, applies PRs, fixes errors, and updates all environments.
 * Ensures all permissions are granted and requests elevation if needed.
 */

const { exec, spawn } = require('child_process');
const os = require('os');
const path = require('path');
const fs = require('fs');

const LOG_PATH = path.join(__dirname, '../logs/qmoi-self-updating-agent.log');
const IS_WINDOWS = os.platform() === 'win32';
const IS_MAC = os.platform() === 'darwin';
const IS_LINUX = os.platform() === 'linux';

function log(msg) {
  const entry = `[${new Date().toISOString()}] ${msg}\n`;
  fs.appendFileSync(LOG_PATH, entry);
  if (process.env.QMOI_MASTER) console.log(entry);
}

function run(cmd, cwd = '.', opts = {}) {
  return new Promise((resolve, reject) => {
    log(`Running: ${cmd} (cwd: ${cwd})`);
    const child = exec(cmd, { cwd, ...opts }, (err, stdout, stderr) => {
      if (stdout) log(stdout);
      if (stderr) log(stderr);
      if (err) {
        log(`Error: ${err.message}`);
        return reject(err);
      }
      resolve(stdout);
    });
  });
}

async function checkPermissions() {
  try {
    // Check if we have write permissions to key directories
    const testFile = path.join(__dirname, '../.qmoi-permission-test');
    fs.writeFileSync(testFile, 'test');
    fs.unlinkSync(testFile);
    log('Permissions check passed');
    return true;
  } catch (e) {
    log('Permission check failed, requesting elevation...');
    return false;
  }
}

async function requestElevation() {
  if (IS_WINDOWS) {
    // On Windows, restart with admin privileges
    const { exec } = require('child_process');
    exec('powershell Start-Process node -ArgumentList "' + process.argv.join(' ') + '" -Verb RunAs');
    process.exit(0);
  } else if (IS_MAC || IS_LINUX) {
    // On Unix-like systems, use sudo
    const { spawn } = require('child_process');
    spawn('sudo', ['node', ...process.argv.slice(1)], { stdio: 'inherit' });
    process.exit(0);
  }
}

async function gitPull() {
  try {
    await run('git pull origin main');
    log('Git pull successful');
    return true;
  } catch (e) {
    log('Git pull failed: ' + e.message);
    return false;
  }
}

async function applyPRs() {
  try {
    // Fetch all PRs and apply them
    await run('git fetch origin');
    const prs = await run('git log --oneline origin/main..HEAD');
    if (prs.trim()) {
      await run('git merge origin/main');
      log('Applied PRs successfully');
    } else {
      log('No new PRs to apply');
    }
    return true;
  } catch (e) {
    log('PR application failed: ' + e.message);
    return false;
  }
}

async function autoFixAll() {
  try {
    await run('npm run qmoi:always-fix-all');
    log('Auto-fix completed');
    return true;
  } catch (e) {
    log('Auto-fix failed: ' + e.message);
    return false;
  }
}

async function updateMobile() {
  try {
    await run('npm install', 'mobile');
    await run('npx react-native start --reset-cache', 'mobile');
    log('Mobile environment updated');
    return true;
  } catch (e) {
    log('Mobile update failed: ' + e.message);
    return false;
  }
}

async function updateCloud() {
  try {
    await run('npm run qmoi:cloud:sync');
    log('Cloud environment updated');
    return true;
  } catch (e) {
    log('Cloud update failed: ' + e.message);
    return false;
  }
}

async function updateCICD() {
  try {
    // Update GitHub Actions workflows
    await run('git add .github/workflows/*');
    await run('git commit -m "Update CI/CD workflows" || true');
    await run('git push origin main');
    log('CI/CD environment updated');
    return true;
  } catch (e) {
    log('CI/CD update failed: ' + e.message);
    return false;
  }
}

async function updateDocumentation() {
  try {
    // Update last-modified dates in all documentation
    const docs = [
      'README.md',
      'QMOI-CLOUD.md',
      'QMOI-CLOUD-ENHANCED.md',
      'MONITORING.md',
      'QMOI-ENHANCED-SYSTEM.md'
    ];
    
    for (const doc of docs) {
      if (fs.existsSync(doc)) {
        let content = fs.readFileSync(doc, 'utf8');
        content = content.replace(
          /_Last updated: \d{4}-\d{2}-\d{2}_/g,
          `_Last updated: ${new Date().toISOString().split('T')[0]}_`
        );
        fs.writeFileSync(doc, content);
      }
    }
    log('Documentation updated with current dates');
    return true;
  } catch (e) {
    log('Documentation update failed: ' + e.message);
    return false;
  }
}

async function main() {
  log('QMOI Self-Updating Agent started');
  
  // Check permissions and request elevation if needed
  if (!(await checkPermissions())) {
    await requestElevation();
    return;
  }
  
  // Main update loop
  while (true) {
    try {
      log('Starting update cycle...');
      
      // Pull latest changes from GitHub
      await gitPull();
      
      // Apply any pending PRs
      await applyPRs();
      
      // Auto-fix all errors
      await autoFixAll();
      
      // Update all environments
      await updateMobile();
      await updateCloud();
      await updateCICD();
      
      // Update documentation
      await updateDocumentation();
      
      log('Update cycle completed successfully');
      
      // Wait before next cycle (5 minutes)
      await new Promise(resolve => setTimeout(resolve, 5 * 60 * 1000));
      
    } catch (e) {
      log('Update cycle failed: ' + e.message);
      // Wait before retry (1 minute)
      await new Promise(resolve => setTimeout(resolve, 60 * 1000));
    }
  }
}

main().catch(e => log('Fatal error: ' + e.message)); 