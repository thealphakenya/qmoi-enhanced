// QMOI Automated Cloning & Cloud Optimization (CommonJS)
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const fsExtra = (() => { try { return require('fs-extra'); } catch { return null; } })();

const repos = [
  { name: 'Alpha-Q-ai', url: process.env.GITLAB_REPO_URL, platform: 'gitlab' },
  { name: 'Alpha-Q-ai', url: process.env.GITHUB_REPO_URL, platform: 'github' },
  { name: 'Alpha-Q-ai', url: process.env.DAGSHUB_REPO_URL, platform: 'dagshub' }
];

const cloudTargets = [
  { name: 'vercel', deployCmd: 'npx vercel --prod --yes', optimize: true },
  { name: 'colab', deployCmd: 'python scripts/colab_deploy.py', optimize: true },
  { name: 'dagshub', deployCmd: 'python scripts/dagshub_deploy.py', optimize: true },
  { name: 'gitpod', deployCmd: 'gp sync', optimize: true }
];

const logPath = path.join(__dirname, '../qmoi-clone-optimize.log');
function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  fs.appendFileSync(logPath, line + '\n');
}

function cloneOrUpdateRepo(repo) {
  if (!repo.url) return log(`[QMOI] Skipping ${repo.platform}: repo URL not set.`);
  const dir = path.join('clones', repo.platform);
  if (!fs.existsSync('clones')) fs.mkdirSync('clones');
  if (!fs.existsSync(dir)) {
    log(`[QMOI] Cloning ${repo.platform} repo...`);
    execSync(`git clone ${repo.url} ${dir}`, { stdio: 'inherit' });
  } else {
    log(`[QMOI] Pulling latest for ${repo.platform} repo...`);
    execSync('git pull', { cwd: dir, stdio: 'inherit' });
  }
}

function deployToCloud(target) {
  log(`[QMOI] Deploying to ${target.name}...`);
  try {
    // Special handling for gitpod CLI
    if (target.name === 'gitpod') {
      try {
        execSync('gp --version', { stdio: 'ignore' });
      } catch {
        log('[QMOI] Gitpod CLI (gp) not found, skipping gitpod deployment.');
        return;
      }
    }
    execSync(target.deployCmd, { stdio: 'inherit' });
    log(`[QMOI] Deploy to ${target.name} succeeded.`);
  } catch (e) {
    log(`[QMOI] Deploy to ${target.name} failed: ${e.message}`);
    // Advanced auto-fix and retry logic
    if (target.optimize) {
      log(`[QMOI] Attempting auto-fix for ${target.name}...`);
      try {
        execSync('npm run fix:all', { stdio: 'inherit' });
        execSync(target.deployCmd, { stdio: 'inherit' });
        log(`[QMOI] Auto-fix and redeploy to ${target.name} succeeded.`);
      } catch (e2) {
        log(`[QMOI] Auto-fix failed for ${target.name}: ${e2.message}`);
      }
    }
  }
}

function optimizeCloudSpend() {
  log('[QMOI] Optimizing cloud spend: preferring free/ephemeral resources, cleaning up unused assets.');
  // Example: clean up old clones
  if (fs.existsSync('clones')) {
    fs.readdirSync('clones').forEach(dir => {
      const fullPath = path.join('clones', dir);
      if (fs.statSync(fullPath).mtime < Date.now() - 7 * 24 * 60 * 60 * 1000) {
        fs.rmSync(fullPath, { recursive: true, force: true });
        log(`[QMOI] Cleaned up old clone: ${fullPath}`);
      }
    });
  }
  // (Extend with cloud API calls for Colab, DagsHub, etc.)
}

function setupDirectorySync(localDir, repoDir) {
  log(`[QMOI] Setting up directory sync: ${localDir} <-> ${repoDir}`);
  const watcher = chokidar.watch(localDir, { ignoreInitial: true });
  watcher.on('all', (event, filePath) => {
    log(`[QMOI] Detected ${event} on ${filePath}. Auto-committing and pushing to repo...`);
    try {
      execSync('git add .', { cwd: repoDir });
      execSync('git commit -m "QMOI: auto-sync from local change"', { cwd: repoDir });
      execSync('git push', { cwd: repoDir });
      log('[QMOI] Auto-sync to repo complete.');
    } catch (e) {
      log(`[QMOI] Auto-sync failed: ${e.message}`);
    }
  });
}

function backupAndEvolve() {
  log('[QMOI] Backing up and evolving state...');
  // Example: copy logs and clones to backup dir
  const backupDir = path.join(__dirname, '../qmoi-backups', Date.now().toString());
  fs.mkdirSync(backupDir, { recursive: true });
  if (fs.existsSync('clones')) {
    // Use fs-extra if available, else fallback to manual copy
    if (fsExtra) {
      fsExtra.copySync('clones', path.join(backupDir, 'clones'));
    } else {
      log('[QMOI] fs-extra not found, skipping clones backup.');
    }
  }
  if (fs.existsSync(logPath)) {
    fs.copyFileSync(logPath, path.join(backupDir, path.basename(logPath)));
  }
  log(`[QMOI] Backup complete: ${backupDir}`);
  // (Extend: auto-evolve logic, changelog, etc.)
}

(async () => {
  log('[QMOI] Starting enhanced clone, deploy, sync, and optimization.');
  for (const repo of repos) cloneOrUpdateRepo(repo);
  for (const target of cloudTargets) deployToCloud(target);
  optimizeCloudSpend();
  setupDirectorySync(process.cwd(), path.join('clones', 'gitlab'));
  backupAndEvolve();
  log('[QMOI] All actions complete. See log for details.');
})(); 