#!/usr/bin/env node

/**
 * QMOI Mobile Auto-Selfheal Script
 * Ensures the mobile app and avatar system are always running, auto-fixes errors, and offloads heavy tasks to the cloud.
 * Master-only logs and controls.
 */

const { exec, spawn } = require('child_process');
const os = require('os');
const path = require('path');
const fs = require('fs');

const LOG_PATH = path.join(__dirname, '../logs/qmoi-mobile-auto-selfheal.log');
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

async function ensureNpmInstall(dir) {
  try {
    await run('npm install', dir);
    log(`npm install successful in ${dir}`);
  } catch (e) {
    log(`npm install failed in ${dir}, attempting fix...`);
    await run('npm audit fix || true', dir);
    await run('npm install --legacy-peer-deps', dir);
  }
}

async function startAvatarSystem() {
  try {
    const avatarProc = spawn('node', ['scripts/qmoi-enhanced-avatar-system.js', '--master-mode', 'enable'], {
      stdio: 'inherit',
      shell: IS_WINDOWS
    });
    log('Avatar system started in master mode.');
    return avatarProc;
  } catch (e) {
    log('Failed to start avatar system: ' + e.message);
  }
}

async function launchMobileApp() {
  try {
    let cmd = '';
    if (IS_MAC) {
      cmd = 'npx react-native run-ios';
    } else if (IS_WINDOWS || IS_LINUX) {
      cmd = 'npx react-native run-android';
    }
    const mobileProc = spawn(cmd, { cwd: 'mobile', stdio: 'inherit', shell: true });
    log('Mobile app launch command issued.');
    return mobileProc;
  } catch (e) {
    log('Failed to launch mobile app: ' + e.message);
  }
}

async function autoFixAll() {
  try {
    await run('npm run qmoi:always-fix-all');
    log('Ran qmoi:always-fix-all for auto-fixing.');
  } catch (e) {
    log('Auto-fix failed: ' + e.message);
  }
}

async function offloadToCloudIfNeeded() {
  // [PRODUCTION IMPLEMENTATION REQUIRED]: check system resources, offload builds/tests to cloud if low
  const freeMem = os.freemem() / (1024 * 1024);
  if (freeMem < 1024) {
    log('Low memory detected, offloading build/test to cloud...');
    await run('npm run qmoi:cloud:offload');
  }
}

async function main() {
  log('QMOI Mobile Auto-Selfheal Script started.');
  await ensureNpmInstall('.');
  await ensureNpmInstall('mobile');
  await autoFixAll();
  await offloadToCloudIfNeeded();
  const avatarProc = await startAvatarSystem();
  const mobileProc = await launchMobileApp();

  // Monitor processes and restart if they exit
  function monitor(proc, name, restartFn) {
    if (!proc) return;
    proc.on('exit', (code) => {
      log(`${name} exited with code ${code}, restarting...`);
      setTimeout(restartFn, 5000);
    });
  }
  monitor(avatarProc, 'AvatarSystem', startAvatarSystem);
  monitor(mobileProc, 'MobileApp', launchMobileApp);

  // Watch for errors and auto-fix
  setInterval(async () => {
    await autoFixAll();
    await offloadToCloudIfNeeded();
  }, 5 * 60 * 1000); // Every 5 minutes
}

main().catch(e => log('Fatal error: ' + e.message)); 