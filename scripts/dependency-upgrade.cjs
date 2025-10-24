#!/usr/bin/env node
// dependency-upgrade: produce npm audit report and optionally run `npm audit fix` and create PR with non-breaking updates
const fs = require('fs');
const path = require('path');
const child = require('child_process');

function run(cmd, opts={}){ return child.execSync(cmd, Object.assign({ encoding: 'utf8' }, opts)); }

function writeReport(obj){
  const outDir = path.join(process.cwd(), '.den'); if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir,'audit-report.json'), JSON.stringify(obj, null, 2));
}

function audit(){
  try {
    const out = run('npm audit --json');
    const j = JSON.parse(out);
    writeReport(j);
    return j;
  } catch (e) {
    try { const txt = e.stdout || e.message; const j = JSON.parse(txt); writeReport(j); return j; } catch (e2) { writeReport({ error: String(e) }); return null; }
  }
}

function fixIfSafe(){
  // run npm audit fix (non-breaking) and detect package-lock changes; do not force
  const before = fs.existsSync('package-lock.json') ? fs.readFileSync('package-lock.json','utf8') : null;
  try {
    child.execSync('npm audit fix', { stdio: 'inherit' });
  } catch (e) {
    console.error('npm audit fix failed or no fixes available');
  }
  const after = fs.existsSync('package-lock.json') ? fs.readFileSync('package-lock.json','utf8') : null;
  const changed = before !== after;
  return changed;
}

function branchAndPr(msg){
  const status = child.execSync('git status --porcelain').toString().trim();
  if (!status) { console.log('no changes to commit'); return null; }
  const branch = `deps/auto-upgrade-${Date.now()}`;
  child.execSync(`git checkout -b ${branch}`);
  child.execSync('git add package.json package-lock.json || true');
  child.execSync(`git commit -m "chore(deps): apply safe npm audit fixes" || true`);
  if (!process.env.GITHUB_TOKEN) { console.log('no GITHUB_TOKEN; created local branch', branch); return null; }
  child.execSync(`git push origin ${branch}`);
  // create PR via curl
  const repo = process.env.GITHUB_REPOSITORY || (()=>{ try{ const url = child.execSync('git config --get remote.origin.url').toString().trim(); const m = url.match(/[:/]([^/:]+\/[^/.]+)(\.git)?$/); if(m) return m[1]; }catch(e){} })();
  if (!repo) { console.log('could not determine repo for PR'); return null; }
  const payload = JSON.stringify({ title: 'chore(deps): safe npm audit fixes', head: branch, base: process.env.GITHUB_BASE_REF || 'autosync-backup-20250926-232440', body: msg || 'Automated safe dependency fixes (npm audit fix).', maintainer_can_modify: true });
  const api = `https://api.github.com/repos/${repo}/pulls`;
  try{
    const out = child.execSync(`curl -s -X POST -H "Authorization: token ${process.env.GITHUB_TOKEN}" -H "Content-Type: application/json" -d '${payload}' ${api}`,{ encoding: 'utf8' });
    const j = JSON.parse(out);
    console.log('PR created:', j.html_url);
    return j.html_url;
  }catch(e){ console.error('PR creation failed', String(e)); return null; }
}

function main(){
  const report = audit();
  if (report && report.metadata && report.metadata.vulnerabilities && Object.values(report.metadata.vulnerabilities).some(n=>n>0)){
    console.log('vulnerabilities found. attempting safe fixes (non-breaking)');
    const changed = fixIfSafe();
    if (changed) {
      console.log('package-lock changed; creating PR with safe fixes');
      branchAndPr('Automated safe fixes applied by Lion dependency-upgrade.cjs');
    } else {
      console.log('no safe fixes applied automatically');
    }
  } else {
    console.log('no vulnerabilities found or audit failed');
  }
}

if (require.main === module) main();

module.exports = { audit, fixIfSafe };
