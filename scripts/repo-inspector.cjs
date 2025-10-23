#!/usr/bin/env node
// repo-inspector: produce conservative suggestions for package.json, tsconfig.json, and workflows.
// Usage: node scripts/repo-inspector.cjs [--apply]

const fs = require('fs');
const path = require('path');
const track = require('./track.cjs');

function readJsonSafe(p) {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch (e) { return null; }
}

function backup(p) {
  try {
    const bak = p + '.bak.' + Date.now();
    fs.copyFileSync(p, bak);
    return bak;
  } catch (e) { return null; }
}

function writeSuggestions(sugg) {
  const outDir = path.join(process.cwd(), '.den');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const file = path.join(outDir, 'suggestions.json');
  fs.writeFileSync(file, JSON.stringify({ generatedAt: new Date().toISOString(), suggestions: sugg }, null, 2), 'utf8');
  track.writeTrack('repo-inspector', 'info', 'wrote suggestions', { file });
}

function inspectPackage(pkgPath) {
  const suggestions = [];
  const pkg = readJsonSafe(pkgPath);
  if (!pkg) return [{ file: pkgPath, issue: 'invalid json or missing' }];
  if (!pkg.name) suggestions.push({ file: pkgPath, change: 'add name', example: 'my-project' });
  if (!pkg.version) suggestions.push({ file: pkgPath, change: 'add version', example: '0.1.0' });
  if (!pkg.scripts || !pkg.scripts.test) suggestions.push({ file: pkgPath, change: 'add test script', example: 'echo "no tests" && exit 0' });
  if (!pkg.engines || !pkg.engines.node) suggestions.push({ file: pkgPath, change: 'add engines.node', example: '>=18' });
  return suggestions;
}

function inspectTsconfig(tsPath) {
  const suggestions = [];
  const cfg = readJsonSafe(tsPath);
  if (!cfg) return [{ file: tsPath, issue: 'invalid json or missing' }];
  cfg.compilerOptions = cfg.compilerOptions || {};
  if (!('skipLibCheck' in cfg.compilerOptions)) suggestions.push({ file: tsPath, change: 'set compilerOptions.skipLibCheck', example: true });
  if (!cfg.compilerOptions.target) suggestions.push({ file: tsPath, change: 'set compilerOptions.target', example: 'ES2020' });
  return suggestions;
}

function inspectBuildGradle(gPath) {
  // conservative: do not modify automatically; report presence and suggest wrapper
  return [{ file: gPath, change: 'has build.gradle', suggestion: 'add gradle wrapper or ensure versioning' }];
}

(function main(){
  const cwd = process.cwd();
  const args = process.argv.slice(2);
  const apply = args.includes('--apply');
  const results = [];

  const pkgPath = path.join(cwd, 'package.json');
  if (fs.existsSync(pkgPath)) {
    const s = inspectPackage(pkgPath);
    if (s.length) { results.push(...s); }
    if (apply) {
      const pkg = readJsonSafe(pkgPath);
      if (pkg) {
        let modified = false;
        if (!pkg.name) { pkg.name = path.basename(cwd); modified = true; }
        if (!pkg.version) { pkg.version = '0.1.0'; modified = true; }
        pkg.scripts = pkg.scripts || {};
        if (!pkg.scripts.test) { pkg.scripts.test = 'echo "no tests" && exit 0'; modified = true; }
        pkg.engines = pkg.engines || {};
        if (!pkg.engines.node) { pkg.engines.node = '>=18'; modified = true; }
        if (modified) {
          backup(pkgPath);
          fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
          track.writeTrack('repo-inspector','info','applied-package-fixes',{pkgPath});
        }
      }
    }
  }

  const tsPath = path.join(cwd, 'tsconfig.json');
  if (fs.existsSync(tsPath)) {
    const s = inspectTsconfig(tsPath);
    if (s.length) { results.push(...s); }
    if (apply) {
      const cfg = readJsonSafe(tsPath) || {};
      cfg.compilerOptions = cfg.compilerOptions || {};
      let modified = false;
      if (!('skipLibCheck' in cfg.compilerOptions)) { cfg.compilerOptions.skipLibCheck = true; modified = true; }
      if (!cfg.compilerOptions.target) { cfg.compilerOptions.target = 'ES2020'; modified = true; }
      if (modified) {
        backup(tsPath);
        fs.writeFileSync(tsPath, JSON.stringify(cfg, null, 2) + '\n', 'utf8');
        track.writeTrack('repo-inspector','info','applied-tsconfig-fixes',{tsPath});
      }
    }
  }

  const gradlePath = path.join(cwd, 'build.gradle');
  if (fs.existsSync(gradlePath)) {
    results.push(...inspectBuildGradle(gradlePath));
  }

  // Dockerfile presence
  const dockerPath = path.join(cwd, 'Dockerfile');
  if (fs.existsSync(dockerPath)) {
    results.push({ file: dockerPath, change: 'has Dockerfile', suggestion: 'ensure multi-stage build and pinned base image' });
  }

  // gradle wrapper
  const gradleWrapper = path.join(cwd, 'gradlew');
  if (fs.existsSync(gradleWrapper)) {
    results.push({ file: gradleWrapper, change: 'has gradle wrapper', suggestion: 'ensure wrapper is executable and versioned' });
  }

  // scan workflows for common issues (presence)
  const wfDir = path.join(cwd, '.github', 'workflows');
  if (fs.existsSync(wfDir)) {
    const wfFiles = fs.readdirSync(wfDir).filter(f => f.endsWith('.yml') || f.endsWith('.yaml'));
    for (const w of wfFiles) results.push({ file: path.join(wfDir, w), change: 'workflow-present' });
  }

  writeSuggestions(results);
  try { track.writeTrack('repo-inspector','info','completed-inspection',{ suggestions: results.length }); } catch(e){}
  console.log('repo-inspector: completed. suggestions written to .den/suggestions.json');
})();
