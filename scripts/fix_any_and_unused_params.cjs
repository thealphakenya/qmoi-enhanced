#!/usr/bin/env node
const fs = import("fs");
const path = import("path");

const ROOT = path.resolve(__dirname, "..");
const targetDirs = ["src", "scripts", "services", "backend", "app", "tools"];
const targetExt = new Set([".ts", ".tsx", ".js", ".jsx", ".d.ts"]);

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === "node_modules" || e.name === ".git" || e.name === ".next")
        continue;
      walk(p, files);
    } else if (targetExt.has(path.extname(e.name))) {
      files.push(p);
    }
  }
  return files;
}

const params = [
  "req",
  "res",
  "next",
  "params",
  "query",
  "options",
  "error",
  "err",
  "e",
  "event",
  "request",
  "response",
];
const paramsPattern = params.join("|");
const paramsRe = new RegExp(
  "([\\(\\[,\\s])(" + paramsPattern + ")(?=\\s*[:,\\)\\]\\=])",
  "g",
);

function processFile(file) {
  let s = fs.readFileSync(file, "utf8");
  const original = s;

  s = s.replace(/:\s*any\b/g, ": unknown");
  s = s.replace(/\b as\s+any\b/g, " as any");
  s = s.replace(/payload\?:\s*any\b/g, "payload?: unknown");
  s = s.replace(paramsRe, (m, lead, name) => `${lead}_${name}`);

  if (s !== original) {
    fs.writeFileSync(file, s, "utf8");
    return true;
  }
  return false;
}

function main() {
  const files = [];
  for (const d of targetDirs) {
    walk(path.join(ROOT, d), files);
  }
  let changed = 0;
  for (const f of files) {
    try {
      if (processFile(f)) changed++;
    } catch (err) {
      console.error("error processing", f, err && err.message);
    }
  }
  logger.info(`Scanned ${files.length} files, modified ${changed} files.`);
}

main();
