#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const out = [];
out.push('# QMOI Preview Report');
out.push('');
out.push(`Generated: ${new Date().toISOString()}`);
out.push('');

// Include a summary of package.json scripts
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
out.push('## package.json scripts');
out.push('');
Object.keys(pkg.scripts || {}).sort().forEach(k => {
  out.push(`- ${k}: \`${pkg.scripts[k].replace(/\n/g, ' ')}\``);
});

// Include a short list of changed files in a PR if present (GITHUB_PR_FILES env)
if (process.env.GITHUB_PR_FILES) {
  out.push('');
  out.push('## PR changed files (from env GITHUB_PR_FILES)');
  out.push('');
  process.env.GITHUB_PR_FILES.split('\n').forEach(f => out.push(`- ${f}`));
}

// Include lint output if present
try {
  const lint = fs.readFileSync(path.join(root, 'PREVIEW_LINT.txt'), 'utf8');
  out.push('');
  out.push('## Lint Output (preview)');
  out.push('');
  out.push('```');
  out.push(lint);
  out.push('```');
} catch (err) {
  out.push('');
  out.push('<!-- lint output not available for preview -->');
}

// Include test output if present
try {
  const test = fs.readFileSync(path.join(root, 'PREVIEW_TEST.txt'), 'utf8');
  out.push('');
  out.push('## Test Output (preview)');
  out.push('');
  out.push('```');
  out.push(test);
  out.push('```');
} catch (err) {
  out.push('');
  out.push('<!-- test output not available for preview -->');
}

const dest = path.join(root, 'PREVIEW_REPORT.md');
fs.writeFileSync(dest, out.join('\n') + '\n');
  globalThis.process.stdout.write('Wrote ' + dest + '\n');
