#!/usr/bin/env node
// track-query: simple CLI to query Lion tracks (.den/tracks/events.log)
// Usage: node scripts/track-query.cjs --last 100 --component lion-runner

const fs = require('fs');
const path = require('path');

function readLines(file) {
  try { return fs.readFileSync(file, 'utf8').split('\n').filter(Boolean); } catch (e) { return []; }
}

const args = process.argv.slice(2);
let last = 200;
let component = null;
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--last' && args[i+1]) { last = parseInt(args[i+1],10) || last; i++; }
  if (args[i] === '--component' && args[i+1]) { component = args[i+1]; i++; }
}

const candidates = [path.join(process.cwd(), '.den', 'tracks', 'events.log'), path.join(process.cwd(), 'den', 'tracks', 'events.log')];
let lines = [];
for (const c of candidates) {
  if (fs.existsSync(c)) { lines = readLines(c); break; }
}

lines = lines.slice(-last).map(l => {
  try { return JSON.parse(l); } catch (e) { return { raw: l }; }
}).filter(Boolean);
if (component) lines = lines.filter(e => e.component === component);
console.log(JSON.stringify({ count: lines.length, entries: lines }, null, 2));
