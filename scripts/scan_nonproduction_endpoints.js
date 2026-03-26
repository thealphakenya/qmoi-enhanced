// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:06Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const scanDirs = ['app/api', 'src/app/api', 'lib', 'prisma'];
const keywords = [
  '
  '
  '
  '
  '
  '
  '
  '
  '
  'real',
  'PRODUCTION',
  '
  'production',
];

const results = [];

function readDirRecursively(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      readDirRecursively(fullPath);
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (['.ts', '.js', '.mjs', '.tsx', '.jsx', '.md', '.json'].includes(ext)) {
        scanFile(fullPath);
      }
    }
  }
}

function scanFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lower = content.toLowerCase();
    const hits = [];
    for (const keyword of keywords) {
      if (lower.includes(keyword.toLowerCase())) {
        hits.push(keyword);
      }
    }
    if (hits.length) {
      results.push({ filePath: path.relative(rootDir, filePath), hits: [...new Set(hits)] });
    }
  } catch (error) {
    console.error('Error reading file', filePath, error);
  }
}

for (const dir of scanDirs) {
  const fullDir = path.join(rootDir, dir);
  if (fs.existsSync(fullDir)) {
    readDirRecursively(fullDir);
  }
}

// Also include top-level README/docs with keywords.
readDirRecursively(rootDir);

const doneDir = path.join(rootDir, 'undone.txt');

const summary = [];
summary.push('# NON-PRODUCTION IMPLEMENTATION AUDIT');
summary.push('Generated: ' + new Date().toISOString());
summary.push('');
summary.push('## Keywords scanned: ' + keywords.join(', '));
summary.push('');
summary.push('## Findings: ' + results.length + ' files');
summary.push('');
summary.push('### Files needing review for real production implementation');
results.sort((a,b)=>a.filePath.localeCompare(b.filePath));
for (const entry of results) {
  summary.push(`- ${entry.filePath} [${entry.hits.join(', ')}]`);
}
summary.push('');
summary.push('## Categorization');
summary.push('### Not yet implemented: manual validation required for each listed file');
summary.push('### Implemented: none yet, this report is the starting point');

fs.writeFileSync(doneDir, summary.join('\n'));
console.log('Scan complete. Files found:', results.length);
