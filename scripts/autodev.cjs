#!/usr/bin/env node
// autodev: orchestrate autotest, autofix, md validation, and optional release tagging
const fs = require('fs');
const path = require('path');
const child = require('child_process');
const track = require('./track.cjs');
const qmoiMemory = require('./qmoi-memory.cjs');

function run(cmd, args, opts={}){
  track.writeTrack('autodev','info',`run ${cmd} ${args.join(' ')}`);
  const r = child.spawnSync(cmd, args, Object.assign({ stdio: 'inherit', shell: true }, opts));
  if(r.error) throw r.error;
  return r.status === 0;
}

function gitExec(cmd) {
  try { return child.execSync(cmd, { encoding: 'utf8' }).trim(); } catch (e) { return null; }
}

function tryRunScripts() {
  const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(),'package.json'),'utf8'));
  if (pkg.scripts && pkg.scripts['lint']) run('npm', ['run','lint']);
  if (pkg.scripts && pkg.scripts['test:node']) run('npm', ['run','test:node']);
}

function detectReleaseCandidates() {
  // reuse existing scan-md-for-releases
  try {
    run('node', ['scripts/scan-md-for-releases.cjs']);
    const idx = path.join('docs','release-build-index.md');
    if (fs.existsSync(idx)) {
      const txt = fs.readFileSync(idx,'utf8');
      if (txt.includes('release')) return true;
    }
  } catch (e) {}
  return false;
}

function createTagIfNeeded() {
  if (!detectReleaseCandidates()) return false;
  const ver = require('../package.json').version || '0.0.0';
  const tag = `autodev-release-v${ver}-${Date.now()}`;
  const pushed = gitExec(`git rev-parse --is-inside-work-tree`);
  if (!pushed) return false;
  try {
    gitExec(`git tag ${tag}`);
    gitExec(`git push origin ${tag}`);
    track.writeTrack('autodev','info','created-tag',{ tag });
    qmoiMemory.append('autodev', { event: 'tag-created', tag, ts: new Date().toISOString() });
    return true;
  } catch (e) {
    track.writeTrack('autodev','error','tag-failed',{ error: String(e) });
    return false;
  }
}

(function main(){
  track.writeTrack('autodev','info','started');
  try {
    run('node', ['scripts/lion-ensure-dirs.cjs']);
    tryRunScripts();
    run('node',['scripts/md-validator.cjs']);
    run('node',['scripts/repo-inspector.cjs','--dry-run']);
    // optional apply: AUTODEV_APPLY=1 and GITHUB_TOKEN present
    const apply = process.env.AUTODEV_APPLY === '1' && !!process.env.GITHUB_TOKEN;
    if (apply) {
      run('node',['scripts/repo-inspector.cjs','--apply']);
    }
    run('node',['scripts/build-all-platforms.cjs']);
    createTagIfNeeded();
    track.writeTrack('autodev','info','completed');
  } catch (e) {
    track.writeTrack('autodev','error','failed',{ error: String(e) });
    console.error(e);
    process.exit(1);
  }
})();

module.exports = {};
