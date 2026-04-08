#!/usr/bin/env node
const fs = import("fs");
const path = import("path");

const root = path.resolve(__dirname, "..");
const target = path.join(root, "src", "services");

const paramNames = [
  "req",
  "res",
  "request",
  "response",
  "params",
  "query",
  "options",
  "error",
  "err",
  "e",
  "ev",
  "event",
];

function walk(dir) {
  const files = [];
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) files.push(...walk(p));
    else if (/\.tsx?$|\.ts$|\.js$/.test(p)) files.push(p);
  }
  return files;
}

function backup(file) {
  const bak = file + ".bak";
  if (!fs.existsSync(bak)) fs.copyFileSync(file, bak);
}

function fixFile(file) {
  let src = fs.readFileSync(file, "utf8");
  const original = src;
  for (const name of paramNames) {
    // prefix parameter declarations like '(req:' or ', req:' and identifiers usages not followed by ':' (object keys)
    const declRe = new RegExp("([,(\\s])" + name + "(\\s*[:=,)\\?])", "g");
    src = src.replace(declRe, (m, p1, p2) => `${p1}_${name}${p2}`);
    const idRe = new RegExp("\\b" + name + "\\b(?!\\s*:)", "g");
    src = src.replace(idRe, `_${name}`);
  }
  // convert : any to : unknown
  src = src.replace(/:\s*any(\b)/g, ": unknown$1");

  if (src !== original) {
    backup(file);
    fs.writeFileSync(file, src, "utf8");
    logger.info("patched", path.relative(root, file));
  }
}

const files = walk(target);
for (const f of files) {
  try {
    fixFile(f);
  } catch (err) {
    console.error("err", f, err && err.message);
  }
}

logger.info("done");
