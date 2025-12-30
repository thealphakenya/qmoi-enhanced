import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const target = path.join(root, "app", "api");

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
  "event",
];

function walk(dir) {
  const list = [];
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) list.push(...walk(p));
    else if (/\.tsx?$|\.ts$|\.js$/.test(p)) list.push(p);
  }
  return list;
}

function backup(file) {
  const bak = file + ".safebak";
  if (!fs.existsSync(bak)) fs.copyFileSync(file, bak);
}

function fixFile(file) {
  let src = fs.readFileSync(file, "utf8");
  const original = src;

  // 1) replace parameter declarations like '( req:' or ', req:' with '(_req:'
  for (const name of paramNames) {
    const re = new RegExp("([\\(,s])(" + name + ")(s*[:=,)?])", "g");
    src = src.replace(re, (m, p1, p2, p3) => `${p1}_${p2}${p3}`);
  }

  // 2) replace `: any` with `: unknown`
  src = src.replace(/:\s*any(\b)/g, ": unknown$1");

  if (src !== original) {
    backup(file);
    fs.writeFileSync(file, src, "utf8");
    console.log("patched", path.relative(root, file));
  }
}

const files = walk(target);
for (const f of files) {
  try {
    fixFile(f);
  } catch (e) {
    console.error("err", f, e.message);
  }
}
console.log("done");
