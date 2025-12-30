#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

function walk(dir) {
  const res = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // skip node_modules hidden vendor dirs under project root? keep everything to be thorough
      res.push(...walk(full));
    } else if (entry.isFile() && full.endsWith(".md")) {
      // make path relative to repo root
      res.push(path.relative(process.cwd(), full).replace(/\\\\/g, "/"));
    }
  }
  return res;
}

const repoRoot = process.cwd();
const files = walk(repoRoot).sort((a, b) => a.localeCompare(b));
const out = files.join("\n") + "\n";
fs.writeFileSync(path.join(repoRoot, "ALLMDFILESREFS.md"), out);
console.log(`Wrote ${files.length} markdown paths to ALLMDFILESREFS.md`);
