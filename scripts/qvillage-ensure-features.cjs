#!/usr/bin/env node
// Read HUGGINGFACEPAYED.md (if present) and create qvillage/features.md checklist.
const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const src = path.join(repo, 'HUGGINGFACEPAYED.md');
const outDir = path.join(repo, 'qvillage');
const outFile = path.join(outDir, 'features.md');

function extractLines(text) {
  return text.split('\n').map(l => l.trim()).filter(Boolean);
}

(function main(){
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  if (!fs.existsSync(src)) {
    fs.writeFileSync(outFile, '# QVillage Features\n\nHUGGINGFACEPAYED.md not found in repo. Create that file or provide a path.\n');
    console.log('wrote', outFile);
    return;
  }

  const md = fs.readFileSync(src, 'utf8');
  const lines = extractLines(md);
  const possible = lines.filter(l => /^- |^\* |^\d+\.|^\s*\-\s*/.test(l));
  const items = possible.map(l => l.replace(/^[-*\d\.\s]+/, '').trim()).filter(Boolean);

  const out = ['# QVillage Feature Checklist', '', `Source: ${path.basename(src)}`, '', 'Generated checklist (implementations are placeholders):', ''];
  for (const it of items) {
    out.push(`- [ ] ${it}  `);
  }
  out.push('', '---', '\nImplementations should be added under `qvillage/services/` and `qvillage/integration.md`.');
  fs.writeFileSync(outFile, out.join('\n'), 'utf8');
  console.log('wrote', outFile);
})();
