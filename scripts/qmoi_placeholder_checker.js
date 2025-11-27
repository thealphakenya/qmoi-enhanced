#!/usr/bin/env node

/**
 * QMOI Placeholder Checker and Safe Template Applier
 * - Scans files for placeholders like {AVATAR} and {PLACE}
 * - Reports findings to logs and JSON report
 * - Optionally applies '--apply' replacements using mappings in config/
 * - Runs a TypeScript type-check (if tsconfig.json exists) as part of a quick "type-check"
 *
 * Safety & maintainability considerations:
 * - Only runs replacements in allowed file extensions and directories
 * - Creates backups before writing files
 * - Replacements are sanitized (strings only) and cannot execute code
 * - Logging and reporting implemented
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import * as lib from '../lib/qmoi_placeholder_lib.js';

const USAGE = `Usage: node scripts/qmoi_placeholder_checker.js [--scan] [--apply] [--dry-run] [--dir <path>] [--fail-on-find] [--no-notify] [--force]

Options:
  --scan     (default) scan for placeholders and generate a report
  --apply    apply replacements based on mappings (requires --allow-apply set or confirmation)
  --dry-run  show what would change without writing files
  --dir <path> restrict scanning to a directory (default: project root)
`;

const ALLOWED_EXT = ['.md', '.markdown', '.json', '.html', '.txt', '.mdown', '.js', '.ts', '.tsx', '.py'];
const DEFAULT_DIR = '.';
const PLACEHOLDER_REGEX = /\{\s*([A-Za-z0-9_\-]+)\s*\}/g; // e.g., {AVATAR}, {place}, {COMPONENT_NAME}
const REPORT_PATH = 'reports/placeholder_scan_report.json';
const LOG_PATH = 'logs/placeholder_checker.log';

function log(message) {
  try { fs.appendFileSync(LOG_PATH, `[${new Date().toISOString()}] ${message}\n`); } catch (e) { console.error('Log write failed:', e.message); }
}

function loadJSONSafe(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return null; }
}

// replaced by lib.ensureConfigDefaults()

// replaced by lib.loadPlaceholderConfig()

// replaced by lib.loadApprovals()  

// replaced by lib.loadFaceMappings()

function isAllowedFile(file) {
  return ALLOWED_EXT.includes(path.extname(file).toLowerCase());
}

function getAllFiles(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      if (['node_modules', '.git', '.next', 'dist', 'build', 'logs'].includes(item.name)) continue;
      results.push(...getAllFiles(fullPath));
    } else if (item.isFile()) {
      if (isAllowedFile(fullPath)) results.push(fullPath);
    }
  }
  return results;
}

// use lib.randomChoice

// Replacement mapping logic
// use lib.applyMapping

async function runTypeCheck() {
  try {
    if (fs.existsSync('tsconfig.json')) {
      log('Running TypeScript check (tsc --noEmit)');
      console.log('🔎 Running TypeScript check...');
      execSync('npx tsc --noEmit', { stdio: 'inherit' });
      log('TypeScript check passed');
    } else {
      log('No tsconfig.json found; skipping TypeScript check');
    }
  } catch (error) {
    log('TypeScript check failed: ' + (error.message || error.toString()));
    console.error('TypeScript check failed:', error.message);
    // don't crash; return error
    return { success: false, error: error.message };
  }

  // Lint check (optional)
  try {
    if (fs.existsSync('package.json')) {
      const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      if (pkg.scripts && (pkg.scripts.lint || pkg.scripts['type-check'])) {
        log('Running eslint/tsc as part of type-check flow');
        try { execSync('npm run lint --silent -- --max-warnings 0', { stdio: 'inherit' }); log('Lint passed'); } catch (e) { log('Lint failed: ' + (e.message || e.toString())); }
      }
    }
  } catch (e) { log('Type-check: lint check failed: ' + e.message); }

  return { success: true };
}

async function runScanAndFix(options) {
  const dir = options.dir || DEFAULT_DIR;
  const files = getAllFiles(dir);
  log(`Scanning ${files.length} files for placeholders under ${dir}`);
  const mapping = lib.ensureConfigDefaults();
  mapping.faceMappings = lib.loadFaceMappings();
  mapping.placeholderConfig = lib.loadPlaceholderConfig();
  mapping.approvals = lib.loadApprovals();
  // Load release report if any
  const releaseReportPath = path.join('scripts', 'qmoi_release_report.json');
  mapping.releaseReport = loadJSONSafe(releaseReportPath);
  // Load master config guard for autoApply/force logic
  const masterConfig = lib.loadJSONSafe(path.join('config', 'qmoi_master_config.json')) || {};
  const checkerCfg = masterConfig.services?.placeholderChecker || {};

  const report = { timestamp: new Date().toISOString(), dir, files: [], replacements: [] };

  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      let match;
      const matches = [];
      while ((match = PLACEHOLDER_REGEX.exec(content)) !== null) {
        matches.push({ token: match[1], index: match.index });
      }

      if (matches.length > 0) {
        report.files.push({ file, matches });
      }

      if (options.apply && matches.length > 0) {
        // Check guard: if autoApply disabled and applyWithConfirmation is true, require --force
        if (!checkerCfg.autoApply && checkerCfg.applyWithConfirmation && !options.force) {
          log(`Apply suppressed by config for ${file}; supply --force to override`);
          continue; // skip applying
        }
        // Do not apply replacements for tokens that require approval unless they are in approvals.safeTokens
        const approvals = mapping.approvals || { safeTokens: [], requireApprovalFor: [] };
        let newContent = content;
        let replacedSomething = false;
        for (const m of matches) {
          // Check approval guard: skip replacements for tokens that are not on safe list
          const tokenUpper = (m.token || '').toUpperCase();
          if (approvals.requireApprovalFor && approvals.requireApprovalFor.includes(tokenUpper) && !approvals.safeTokens.includes(tokenUpper)) {
            log(`Skipping replacement for ${tokenUpper} in ${file} - requires manual approval`);
            continue;
          }
          const replacement = lib.applyMapping(m.token, mapping);
          if (replacement === null) continue;
          const safeReplacement = String(replacement).replace(/[\\`$]/g, ''); // Minimal sanitization
          // global replace for this token pattern
          const tokenPattern = new RegExp('\\{\\s*' + m.token + '\\s*\\}', 'g');
          if (content.match(tokenPattern)) {
            newContent = newContent.replace(tokenPattern, safeReplacement);
            replacedSomething = true;
            report.replacements.push({ file, token: m.token, replacement: safeReplacement });
          }
        }
        if (replacedSomething) {
          if (!options.dryRun) {
            try {
              // Create backup
              fs.writeFileSync(file + '.bak', content, 'utf8');
              fs.writeFileSync(file, newContent, 'utf8');
              log(`Applied replacements to ${file} (backup: ${file}.bak)`);
            } catch (e) { log('Failed to write file: ' + file + ' - ' + e.message); }
          } else {
            log(`(dry-run) Would replace tokens in ${file}`);
          }
        }
      }
    } catch (e) {
      log(`Failed to scan ${file}: ${e.message}`);
    }
  }

  // Evaluate severity vs denylist
  const denied = [];
  const placeholderConfig = mapping.placeholderConfig || {};
  const approvals = mapping.approvals || { requireApprovalFor: [], approved: [] };
  const denyList = placeholderConfig.denyList || [];
  const approvedList = placeholderConfig.approvedList || [];
  report.files.forEach(f => {
    f.matches.forEach(m => {
      const tokenUp = String(m.token).toUpperCase();
      if (denyList.includes(tokenUp)) denied.push({ file: f.file, token: m.token });
      // flag if not approved and looks like placeholder
      if (!approvedList.includes(tokenUp) && !denyList.includes(tokenUp) && !approvals.approved.includes(tokenUp)) {
        // If token is unapproved, throw a medium severity entry
        denied.push({ file: f.file, token: m.token });
      }
          // Check requireApprovalFor wildcard patterns
          approvals.requireApprovalFor.forEach(pattern => {
            const p = String(pattern).toUpperCase();
            if (p.endsWith('*')) {
              const base = p.slice(0, -1);
              if (tokenUp.startsWith(base) && !approvals.approved.includes(tokenUp)) {
                // mark as denied if not approved
                if (!denyList.includes(tokenUp)) denied.push({ file: f.file, token: m.token, reason: 'requiresApproval' });
              }
            } else if (tokenUp === p && !approvals.approved.includes(tokenUp)) {
              if (!denyList.includes(tokenUp)) denied.push({ file: f.file, token: m.token, reason: 'requiresApproval' });
            }
          });
    });
  });

  // Save report
  try { fs.mkdirSync('reports', { recursive: true }); fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2)); log('Saved placeholder report to ' + REPORT_PATH); } catch (e) { log('Failed to save report: ' + e.message); }

  // Fail if requested
  if (options.failOnFind && denied.length > 0 && !options.apply) {
    log(`Found disallowed/unknown placeholders: ${JSON.stringify(denied, null, 2)}`);
    console.error(`Failed: Found disallowed/unknown placeholders: ${JSON.stringify(denied, null, 2)}`);
    process.exit(4);
  }
  return report;
}

async function maybeNotify(report, options) {
  // Optionally notify via notifier if available.
  if (options.noNotify) return;
  let notifier = null;
  try {
    const mod = await import('./qmoi_notifier.cjs');
    notifier = mod?.default || mod;
  } catch (err) {
    log('Notifier module not found or failed to load: ' + (err.message || err));
  }
  if (!notifier) return;
  const filesFound = report.files.length;
  const replacements = report.replacements.length;
  const summary = `Placeholder scan report: ${filesFound} files with placeholders, ${replacements} replacements suggested/applied.`;
  try {
    if (notifier.sendSlack) await notifier.sendSlack(summary);
    if (notifier.sendEmail) await notifier.sendEmail('QMOI Placeholder Scan', summary);
  } catch (err) {
    log('Failed to send notifier: ' + (err.message || err));
  }
}

// CLI parse
const args = process.argv.slice(2);
const options = { apply: false, dryRun: false, dir: DEFAULT_DIR, force: false, failOnFind: false };
if (args.includes('--help') || args.includes('-h')) { console.log(USAGE); process.exit(0); }
if (args.includes('--apply')) options.apply = true;
if (args.includes('--dry-run')) options.dryRun = true;
if (args.includes('--no-notify')) options.noNotify = true;
if (args.includes('--dir')) { const idx = args.indexOf('--dir'); if (idx > -1 && args[idx+1]) options.dir = args[idx+1]; }
if (args.includes('--force')) options.force = true;
if (args.includes('--fail-on-find')) options.failOnFind = true;

(async () => {
  try {
    // Run TypeScript / lint check first (quick 'type-check')
    const typeResult = await runTypeCheck();
    if (typeResult && typeResult.success === false) {
      console.warn('Type-check failed; continuing with scan (reporting errors)');
    }

    const report = await runScanAndFix(options);
    await maybeNotify(report, options);

    // Quick console summary
    console.log('🌱 Placeholder scan complete');
    console.log('  Files with placeholders:', report.files.length);
    console.log('  Replacements planned/applied:', report.replacements.length);
    
    process.exit(0);
  } catch (e) {
    log('Script failed: ' + e.message);
    console.error('Script failed:', e.message);
    process.exit(2);
  }
})();
