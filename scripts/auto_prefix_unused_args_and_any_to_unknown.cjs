#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const API_DIR = path.join(ROOT, "app", "api");

const targetExt = new Set([".ts", ".tsx", ".js", ".jsx"]);

function walk(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      walk(p, files);
    } else if (targetExt.has(path.extname(e.name))) {
      files.push(p);
    }
  }
  return files;
}

function processFile(file) {
  let s = fs.readFileSync(file, "utf8");
  const original = s;

  s = s.replace(/:\s*any\b/g, ": unknown");
  s = s.replace(/\b as\s+any\b/g, " as unknown");

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
  const re = new RegExp(
    "([\\(\\[,]\\s*)(" + paramsPattern + ")(?=\\s*[:,\\)\\]\\=])",
    "g"
  );
  s = s.replace(re, function (_, lead, name) {
    return lead + "_" + name;
  });

  if (s !== original) {
    fs.writeFileSync(file, s, "utf8");
    return true;
  }
  return false;
}

function main() {
  if (!fs.existsSync(API_DIR)) {
    console.error("app/api directory not found, aborting");
    process.exit(1);
  }
  const files = walk(API_DIR);
  let changed = 0;
  for (const f of files) {
    try {
      if (processFile(f)) changed++;
    } catch (err) {
      console.error("error processing", f, err && err.message);
    }
  }
  console.log(
    "Processed " + files.length + " files, modified " + changed + " files."
  );
}

main();
