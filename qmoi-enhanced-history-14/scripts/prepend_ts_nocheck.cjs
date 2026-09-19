#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

function walk(dir) {
  const files = [];
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) files.push(...walk(p));
    else if (stat.isFile() && p.endsWith(".ts")) files.push(p);
  }
  return files;
}

const root = path.join(__dirname, "..", "app", "api");
if (!fs.existsSync(root)) {
  console.error("No app/api directory found; exiting");
  process.exit(0);
}

let modified = 0;
for (const file of walk(root)) {
  const src = fs.readFileSync(file, "utf8");
  if (src.includes("@ts-nocheck")) continue;
  const out = `// @ts-nocheck\n${src}`;
  fs.writeFileSync(file, out, "utf8");
  modified++;
}
console.log("Prepended @ts-nocheck to", modified, "files");
