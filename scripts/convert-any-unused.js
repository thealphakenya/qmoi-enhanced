#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const APPLY = process.argv.includes("--apply");
const IGNORES = [
  "node_modules",
  ".git",
  ".next",
  "dist",
  "build",
  "out",
  "coverage",
];
const EXTS = new Set([".ts", ".tsx", ".js", ".jsx"]);

let filesChanged = 0;
let filesScanned = 0;

function shouldIgnore(entry) {
  return IGNORES.includes(entry);
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const _e of entries) {
    if (shouldIgnore(_e.name)) continue;
    const full = path.join(dir, _e.name);
    if (_e.isDirectory()) walk(full);
    else if (_e.isFile() && EXTS.has(path.extname(_e.name))) {
      filesScanned++;
      tryProcessFile(full);
    }
  }
}

function tryProcessFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  let original = content;

  // 1) Convert explicit any type annotations to unknown
  content = content.replace(/:\s*any\b/g, ": unknown");

  // 2) Prefix declared vars named _unused* with an underscore (const/let/var)
  content = content.replace(
    /\b([cC]onst|let|var)\s+(_unused[A-Za-z0-9_]*)/g,
    (m, decl, name) => `${decl} _${name}`
  );

  // 3) Prefix function parameters named _unused* (basic pattern: (, or start)
  content = content.replace(
    /([,(\s])\b(_unused[A-Za-z0-9_]*)\b/g,
    (m, before, name) => `${before}_${name}`
  );

  if (content !== original) {
    filesChanged++;
    console.log((APPLY ? "Updating" : "Would update") + `: ${filePath}`);
    if (APPLY) fs.writeFileSync(filePath, content, "utf8");
  }
}

console.log(`Starting codemod (dry run=${!APPLY}). Scanning from ${ROOT}`);
walk(ROOT);
console.log(
  `Scanned ${filesScanned} files. ${filesChanged} files ${
    APPLY ? "modified" : "would be modified"
  }.`
);
if (!APPLY)
  console.log(
    "Run with --apply to write changes. Review diffs before committing."
  );
