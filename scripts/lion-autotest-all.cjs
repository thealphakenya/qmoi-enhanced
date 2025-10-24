#!/usr/bin/env node
// lion-autotest-all: run linters, node tests, repo-inspector, autofix, and create PR with fixes if any.
// Usage: node scripts/lion-autotest-all.cjs [--apply-fixes] [--create-pr]

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const child = require('child_process');
const track = require('./track.cjs');
const fetch = require('node-fetch');

function run(cmd, opts) {
  try {
    console.log('> ', cmd);
    execSync(cmd, Object.assign({ stdio: 'inherit' }, opts || {}));
    return true;
  } catch (e) {
    console.error('command failed:', cmd);
    return false;
  }
}

async function createPR(branch, title, body) {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (!token) {
    console.log('GITHUB_TOKEN not provided; skipping PR creation');
    return null;
  }
  const repo = process.env.GITHUB_REPOSITORY || (execSync('git remote get-url origin').toString().trim().split(':').pop().replace(/\.git$/, ''));
  const [owner, repoName] = repo.includes('/') ? repo.split('/') : [null, repo];
  const url = `https://api.github.com/repos/${owner}/${repoName}/pulls`;
  const payload = { title, head: branch, base: process.env.GITHUB_BASE_REF || 'autosync-backup-20250926-232440', body }; // base fallback
  const res = await fetch(url, { method: 'POST', headers: { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github.v3+json' }, body: JSON.stringify(payload) });
  const j = await res.json();
  if (res.ok) {
    track.writeTrack('lion-autotest','info','created-pr',{ pr: j.number });
    console.log('PR created:', j.html_url);
    return j;
  }
  console.error('PR creation failed', j);
  return null;
}

(async function main(){
  const args = process.argv.slice(2);
  const applyFixes = args.includes('--apply-fixes');
  const createPrFlag = args.includes('--create-pr');

  track.writeTrack('lion-autotest','info','started',{});

  // 1. Lint & fix
  run('npm run lint:fix || true');

  // 2. Node-scoped tests
  const okNodeTests = run('npm run test:node');
  if (!okNodeTests) track.writeTrack('lion-autotest','error','node-tests-failed',{});

  // 3. Run full unit tests (best-effort)
  run('npm run test:all || true');

  // 4. Build UI (if applicable)
  run('npm run build || true');

  // 5. Repo inspector (dry-run)
  run('node scripts/repo-inspector.cjs');
  const suggestionsFile = path.join(process.cwd(), '.den', 'suggestions.json');
  let suggestions = [];
  if (fs.existsSync(suggestionsFile)) {
    try { suggestions = JSON.parse(fs.readFileSync(suggestionsFile,'utf8')).suggestions || []; } catch(e){}
  }

  // 6. Autofix (dry-run then apply if requested)
  run('node scripts/lion-autofix-extended.cjs');
  if (applyFixes) {
    // conservative: run autofix (it already writes backups)
    run('node scripts/lion-autofix-extended.cjs');
    // apply repo-inspector fixes
    run('node scripts/repo-inspector.cjs --apply');
  }

  // 7. If fixes applied, create branch and push
  const status = execSync('git status --porcelain || true').toString().trim();
  if (status) {
    const branch = `lion-autofix-${Date.now()}`;
    run(`git checkout -b ${branch}`);
    run('git add -A');
    run(`git commit -m "chore(lion): apply autofixes and suggestions" || echo "no changes to commit"`);
    run(`git push -u origin ${branch}`);
    if (createPrFlag) {
      await createPR(branch, 'lion: apply autofixes', 'This PR contains conservative autofixes proposed and applied by lion-autotest.');
    }
  } else {
    console.log('No changes to commit after autofix.');
  }

  track.writeTrack('lion-autotest','info','completed', { suggestions: suggestions.length });
})();
