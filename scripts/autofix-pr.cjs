#!/usr/bin/env node
// autofix-pr: create a branch with local autofix changes and open a PR using GITHUB_TOKEN
// Safe defaults: dry-run if no token, do not force-push, always create backups via individual tools

const fs = require('fs');
const path = require('path');
const child = require('child_process');

function run(cmd, opts={}){
  return child.execSync(cmd, Object.assign({ stdio: 'inherit' }, opts));
}

function hasToken(){ return !!process.env.GITHUB_TOKEN; }

function repoInfo(){
  const repo = process.env.GITHUB_REPOSITORY; // owner/repo
  if (repo) return repo;
  try {
    const url = child.execSync('git config --get remote.origin.url').toString().trim();
    // parse github url formats
    const m = url.match(/[:/]([^/:]+\/[^/.]+)(\.git)?$/);
    if (m) return m[1];
  } catch(e){}
  throw new Error('unable to determine repo; set GITHUB_REPOSITORY env or ensure git remote origin present');
}

function branchName(){
  const ts = Date.now();
  return `autofix/lion/${ts}`;
}

function createPr(branch, title, body){
  const repo = repoInfo();
  const token = process.env.GITHUB_TOKEN;
  if (!token) { console.log('[autofix-pr] no GITHUB_TOKEN; dry-run, PR not created'); return null; }
  const payload = JSON.stringify({ title, head: branch, base: process.env.GITHUB_BASE_REF || 'autosync-backup-20250926-232440', body, maintainer_can_modify: true });
  const api = `https://api.github.com/repos/${repo}/pulls`;
  const curl = `curl -s -X POST -H "Authorization: token ${token}" -H "Content-Type: application/json" -d '${payload}' ${api}`;
  try {
    const out = child.execSync(curl, { encoding: 'utf8' });
    const j = JSON.parse(out);
    console.log('[autofix-pr] PR created:', j.html_url);
    return j.html_url;
  } catch (e) {
    console.error('[autofix-pr] PR creation failed', String(e));
    return null;
  }
}

(function main(){
  try{
    const repo = repoInfo();
    console.log('[autofix-pr] repo:', repo);
    // ensure working tree is clean before making changes
    const status = child.execSync('git status --porcelain').toString().trim();
    if (status) { console.log('[autofix-pr] working tree not clean; please commit or stash changes first'); process.exit(1); }

    // run conservative autofix commands (dry-run if no token)
    console.log('[autofix-pr] running repo-inspector apply (conservative)');
    try { run('node scripts/repo-inspector.cjs --apply'); } catch(e){ console.log('[autofix-pr] repo-inspector apply failed or made no changes'); }

    // check for changes
    const changed = child.execSync('git status --porcelain').toString().trim();
    if (!changed) { console.log('[autofix-pr] no changes after autofix; nothing to PR'); return; }

    const branch = branchName();
    run(`git checkout -b ${branch}`);
    run('git add -A');
    run('git commit -m "chore(lion): apply conservative autofixes"');

    if (!hasToken()){
      console.log('[autofix-pr] no GITHUB_TOKEN; created local branch', branch, 'but will not push or create PR (dry-run)');
      return;
    }

    // push branch
    run(`git push origin ${branch}`);
    const prUrl = createPr(branch, 'chore: conservative autofixes by Lion', 'This PR contains conservative autofixes applied by Lion (repo-inspector).');
    if (prUrl) console.log('[autofix-pr] PR opened:', prUrl);
  }catch(e){ console.error('[autofix-pr] failed', String(e)); process.exit(1); }
})();
