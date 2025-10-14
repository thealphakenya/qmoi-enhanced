#!/usr/bin/env node
/**
 * QMOI Storage Optimizer
 * Optimizes local storage by compressing and deduplicating files
 */
const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

function compressFile(file) {
  if (!fs.existsSync(file)) return;
  const data = fs.readFileSync(file);
  const gz = zlib.gzipSync(data);
  fs.writeFileSync(file + '.gz', gz);
  fs.rmSync(file);
  console.log(`[QMOI] Compressed: ${file}`);
}

const targets = fs.readdirSync('.').filter(f => f.endsWith('.log') || f.endsWith('.txt'));
for (const t of targets) compressFile(t);
