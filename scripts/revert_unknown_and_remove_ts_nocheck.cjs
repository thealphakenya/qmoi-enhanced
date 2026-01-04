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
  // Remove @ts-nocheck lines
  out = out.replace(/^\s*\/\/\s*@ts-nocheck\s*\n?/gm, "");
  // Revert common conversions: ': unknown' -> ': any'
  out = out.replace(/:\s*unknown\b/g, ": any");
  // unknown[] -> any[]
  out = out.replace(/unknown\[\]/g, "any[]");
  // as any -> as any
  out = out.replace(/\bas\s+unknown\b/g, "as any");
  // const x: Record<string, unknown> -> Record<string, any>
  out = out.replace(/Record<([^,>]+),\s*unknown>/g, "Record<$1, any>");

  if (out !== src) {
    fs.writeFileSync(file, out, "utf8");
    modified++;
  }
}
console.log("Processed", files.length, "files; modified", modified, "files");
