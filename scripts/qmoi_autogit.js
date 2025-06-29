const { execSync } = require('child_process');
const fs = require('fs');
const LOG = './logs/qmoi_autogit.log';

function getLastCommitNumber() {
  try {
    const log = execSync('git log --grep="QMOI auto-fix #" -1 --pretty=%B').toString();
    const match = log.match(/QMOI auto-fix #(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  } catch { return 0; }
}
let commitCount = getLastCommitNumber() + 1;

function log(msg) {
  fs.appendFileSync(LOG, `[${new Date().toISOString()}] ${msg}\n`);
}

function runGit(cmd) {
  try {
    execSync(cmd, { stdio: 'inherit' });
    log(`SUCCESS: ${cmd}`);
    return true;
  } catch (err) {
    log(`FAIL: ${cmd} | ${err}`);
    return false;
  }
}

log('--- QMOI AutoGit Attempt ---');
if (runGit('git add .')) {
  const commitMsg = `QMOI auto-fix #${commitCount}`;
  if (runGit(`git commit -m "${commitMsg}" || echo 'No changes to commit'`)) {
    let pushed = false;
    for (let i = 0; i < 3 && !pushed; i++) {
      pushed = runGit('git push');
      if (!pushed) {
        log('Git push failed, retrying after pull/rebase...');
        runGit('git pull --rebase');
      }
    }
    if (pushed) {
      log(`AutoGit SUCCESS: ${commitMsg}`);
      commitCount++;
    } else {
      log('AutoGit FAILED after 3 push attempts. Will retry next run.');
    }
  } else {
    log('No changes to commit.');
  }
} else {
  log('git add failed.');
} 