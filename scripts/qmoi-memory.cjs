#!/usr/bin/env node
// qmoi-memory: single JSON-backed memory store under .den/memory.json
const fs = require('fs');
const path = require('path');

function memoryPath() {
  const cwd = process.cwd();
  const outDir = path.join(cwd, '.den');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  return path.join(outDir, 'memory.json');
}

function read() {
  const p = memoryPath();
  try {
    if (!fs.existsSync(p)) return { createdAt: new Date().toISOString(), records: [] };
    const txt = fs.readFileSync(p, 'utf8');
    return JSON.parse(txt);
  } catch (e) { return { createdAt: new Date().toISOString(), records: [] }; }
}

function write(obj) {
  const p = memoryPath();
  fs.writeFileSync(p, JSON.stringify(obj, null, 2) + '\n', 'utf8');
}

function append(namespace, entry) {
  const s = read();
  s.records = s.records || [];
  s.records.push({ ns: namespace || 'default', ts: new Date().toISOString(), entry });
  write(s);
  return true;
}

function query(filter) {
  const s = read();
  if (!filter) return s.records || [];
  return (s.records || []).filter(r => {
    if (filter.ns && r.ns !== filter.ns) return false;
    if (filter.key && (!r.entry || !(filter.key in r.entry))) return false;
    return true;
  });
}

module.exports = { read, write, append, query };
