// QMOI Automated Cloning & Cloud Optimization
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const repos = [
  { name: 'Alpha-Q-ai', url: process.env.GITLAB_REPO_URL, platform: 'gitlab' },
  { name: 'Alpha-Q-ai', url: process.env.GITHUB_REPO_URL, platform: 'github' },
  { name: 'Alpha-Q-ai', url: process.env.DAGSHUB_REPO_URL, platform: 'dagshub' }
];

const cloudTargets = [
  { name: 'vercel', deployCmd: 'npx vercel --prod --yes', optimize: true },
  { name: 'colab', deployCmd: 'python scripts/colab_deploy.py', optimize: true },
  { name: 'dagshub', deployCmd: 'python scripts/dagshub_deploy.py', optimize: true }
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
    execSync(target.deployCmd, { stdio: 'inherit' });
    log(`[QMOI] Deploy to ${target.name} succeeded.`);
  } catch (e) {
    log(`[QMOI] Deploy to ${target.name} failed: ${e.message}`);
    // Auto-fix and retry logic (simplified)
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

(async () => {
  log('[QMOI] Starting automated clone, deploy, and optimization.');
  for (const repo of repos) cloneOrUpdateRepo(repo);
  for (const target of cloudTargets) deployToCloud(target);
  optimizeCloudSpend();
  log('[QMOI] All actions complete. See log for details.');
})(); 