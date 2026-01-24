#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

function walk(dir) {
  const files = [];
  if (!fs.existsSync(dir)) return files;
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) files.push(...walk(p));
    else if (stat.isFile() && /\.(ts|tsx|js|jsx)$/.test(p)) files.push(p);
  }
  return files;
}

const root = path.join(__dirname, "..", "app", "api");
const files = walk(root);
let modified = 0;
for (const file of files) {
  let src = fs.readFileSync(file, "utf8");
  let out = src;
  // If file uses _err and err, normalize to _err
  if (/\b_err\b/.test(src) && /\berr\b/.test(src)) {
    out = out.replace(/\berr\b/g, "_err");
  }
  // If file uses _e and e, normalize to _e for common patterns
  if (/\b_e\b/.test(src) && /\be\b/.test(src)) {
    // Replace e occurring as standalone or next to punctuation
    out = out.replace(/\(e\b/g, "(_e");
    out = out.replace(/\be\./g, "_e.");
    out = out.replace(/\be,/g, "_e,");
    out = out.replace(/\be\)/g, "_e)");
    // spaces: ' e ' -> ' _e '
    out = out.replace(/\be\s+/g, "_e ");
    out = out.replace(/\s+e\b/g, " _e");
  }
  // Fix pattern 'e instanceof Error ? e.message : String(_e)' -> '_e instanceof Error ? _e.message : String(_e)'
  out = out.replace(
    /\be\s*instanceof\s*Error\s*\?\s*e\.message\s*:\s*String\(_e\)/g,
    "_e instanceof Error ? _e.message : String(_e)",
  );
  // Also 'error: e instanceof Error ? e.message : String(_e)'
  out = out.replace(
    /error:\s*e\s*instanceof\s*Error\s*\?\s*e\.message\s*:\s*String\(_e\)/g,
    "error: _e instanceof Error ? _e.message : String(_e)",
  );

  if (out !== src) {
    fs.writeFileSync(file, out, "utf8");
    modified++;
  }
}
console.log("Processed", files.length, "files; modified", modified, "files");
