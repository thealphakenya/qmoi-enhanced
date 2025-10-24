#!/usr/bin/env node
// md-validator: validate markdown files conservatively and mark validated ones
const fs = require('fs');
const path = require('path');
const track = require('./track.cjs');
const qmoiMemory = require('./qmoi-memory.cjs');

function listMdFiles(dir) {
  const out = [];
  function walk(d) {
    let entries;
    try { entries = fs.readdirSync(d, { withFileTypes: true }); } catch (e) { return; }
    for (const e of entries) {
      if (e.name.startsWith('.git')) continue;
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.isFile() && e.name.toLowerCase().endsWith('.md')) out.push(p);
    }
  }
  walk(dir);
  return out;
}

function validateMd(p) {
  const txt = fs.readFileSync(p, 'utf8');
  const hasValidation = /(^|\n)#+\s*Validation\b/i.test(txt) || /(^|\n)###\s*Validation\b/i.test(txt);
  const hasTable = /\|\s*\S+\s*\|/.test(txt);
  const hasTitle = /(^|\n)#\s+\S+/.test(txt);
  const paragraphs = txt.split(/\n\s*\n/).filter(p => p.trim().length > 40).length;
  const issues = [];
  // Accept file if it has explicit Validation section with a table OR passes a lightweight heuristic
  const ok = (hasValidation && hasTable) || (hasTitle && paragraphs >= 1);
  if (!ok) {
    if (!hasValidation) issues.push('missing Validation heading');
    if (!hasTable) issues.push('missing table');
    if (!hasTitle) issues.push('missing title');
  }
  return { path: p, ok, issues };
}

function markValidated(p) {
  const txt = fs.readFileSync(p, 'utf8');
  const marker = '\n\n---\n**Lion** ✅ Validated by Lion on ' + new Date().toISOString() + '\n';
  if (txt.includes('**Lion** ✅')) return false;
  const bak = p + '.bak.' + Date.now();
  fs.copyFileSync(p, bak);
  fs.writeFileSync(p, txt + marker, 'utf8');
  return true;
}

function writeTrackAndMemory(result) {
  try { track.writeTrack('md-validator','info','validated', result); } catch (e) {}
  try { qmoiMemory.append('md-validator', result); } catch (e) {}
}

function validateAll() {
  const cwd = process.cwd();
  const files = listMdFiles(cwd);
  const summary = [];
  for (const f of files) {
    try {
      const res = validateMd(f);
      if (res.ok) {
        const updated = markValidated(f);
        writeTrackAndMemory({ file: path.relative(cwd, f), status: 'validated', updated });
        summary.push({ file: path.relative(cwd, f), validated: true, updated });
      } else {
        writeTrackAndMemory({ file: path.relative(cwd, f), status: 'validation-failed', issues: res.issues });
        summary.push({ file: path.relative(cwd, f), validated: false, issues: res.issues });
      }
    } catch (e) {
      writeTrackAndMemory({ file: path.relative(cwd, f), status: 'error', error: String(e) });
      summary.push({ file: path.relative(cwd, f), validated: false, error: String(e) });
    }
  }
  const out = path.join(cwd, '.den');
  if (!fs.existsSync(out)) fs.mkdirSync(out, { recursive: true });
  fs.writeFileSync(path.join(out, 'md-validation.json'), JSON.stringify({ runAt: new Date().toISOString(), results: summary }, null, 2));
  track.writeTrack('md-validator','info','completed',{ count: summary.length });
  return summary;
}

if (require.main === module) {
  validateAll();
  console.log('md-validator: completed. results written to .den/md-validation.json');
}

module.exports = { validateAll };
