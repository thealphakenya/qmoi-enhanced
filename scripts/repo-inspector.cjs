#!/usr/bin/env node
// repo-inspector: produce conservative suggestions for package.json, tsconfig.json, and workflows.
// Usage: node scripts/repo-inspector.cjs [--apply]

const fs = require('fs');
const path = require('path');
const track = require('./track.cjs');
const qmoiMemory = require('./qmoi-memory.cjs');

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

  // Dockerfile presence and basic checks
  const dockerPath = path.join(cwd, 'Dockerfile');
  if (fs.existsSync(dockerPath)) {
    try {
      const txt = fs.readFileSync(dockerPath, 'utf8');
      const hasBuilder = /AS\s+\w+/i.test(txt) || (txt.match(/FROM\s+/gi) || []).length > 1;
      const usesLatest = /FROM\s+[^:\s]+:latest/i.test(txt);
      const suggestions = [];
      if (!hasBuilder) suggestions.push('consider multi-stage build to reduce image size');
      if (usesLatest) suggestions.push('pin base image versions instead of using :latest');
      if (suggestions.length) results.push({ file: dockerPath, change: 'docker-suggestions', suggestion: suggestions.join('; ') });
      // record memory that Dockerfile was analyzed
      try { qmoiMemory.append('inspector', { file: dockerPath, analyzedAt: new Date().toISOString(), suggestions }); } catch (e) {}
    } catch (e) {
      results.push({ file: dockerPath, change: 'docker-read-failed', suggestion: 'could not read Dockerfile' });
    }
  }

  // gradle wrapper
  const gradleWrapper = path.join(cwd, 'gradlew');
  if (fs.existsSync(gradleWrapper)) {
    results.push({ file: gradleWrapper, change: 'has gradle wrapper', suggestion: 'ensure wrapper is executable and versioned' });
    try { qmoiMemory.append('inspector', { file: gradleWrapper, analyzedAt: new Date().toISOString(), note: 'gradle wrapper present' }); } catch (e) {}
  }

  // scan workflows for common issues (presence and basic analysis)
  const wfDir = path.join(cwd, '.github', 'workflows');
  if (fs.existsSync(wfDir)) {
    const wfFiles = fs.readdirSync(wfDir).filter(f => f.endsWith('.yml') || f.endsWith('.yaml'));
    for (const w of wfFiles) {
      const full = path.join(wfDir, w);
      results.push({ file: full, change: 'workflow-present' });
      try { qmoiMemory.append('inspector', { file: full, analyzedAt: new Date().toISOString() }); } catch (e) {}
    }
  }

  // Analyze workflows for unpinned actions and missing permissions
  try {
    const yaml = require('js-yaml');
    if (fs.existsSync(wfDir)) {
      const wfFiles = fs.readdirSync(wfDir).filter(f => f.endsWith('.yml') || f.endsWith('.yaml'));
      for (const w of wfFiles) {
          const full = path.join(wfDir, w);
          try {
            const raw = fs.readFileSync(full, 'utf8');
            const doc = yaml.load(raw);
            // detect 'uses:' without a version pin (@) - improved check: find uses: lines and check for '@'
            const usesLines = raw.split(/\r?\n/).filter(l => /\buses:\s+/.test(l));
            for (const line of usesLines) {
              if (!/@/g.test(line)) results.push({ file: full, change: 'workflow-unpinned-uses', suggestion: `pin action in line: ${line.trim()}` });
            }
            // detect missing permissions block
            if (!doc || !doc.permissions) results.push({ file: full, change: 'workflow-missing-permissions', suggestion: 'add least-privilege permissions block to workflows' });
          } catch (e) {
            results.push({ file: full, change: 'workflow-parse-failed', suggestion: 'could not parse workflow YAML' });
          }
        }
    }
  } catch (e) {
    // js-yaml not installed: skip deeper analysis
    results.push({ file: 'workflows', change: 'yaml-analysis-skipped', suggestion: 'install js-yaml to enable workflow analysis' });
  }

  writeSuggestions(results);
  try { track.writeTrack('repo-inspector','info','completed-inspection',{ suggestions: results.length }); } catch(e){}
  console.log('repo-inspector: completed. suggestions written to .den/suggestions.json');
})();
