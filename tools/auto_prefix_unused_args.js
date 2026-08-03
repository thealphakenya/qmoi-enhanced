import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const target = path.join(root, "app", "api");

const paramNames = [
  "_req",
  "_res",
  "_request",
  "response",
  "_params",
  "query",
  "_options",
  "error",
  "_err",
  "_e",
  "_ev",
  "_event",
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
  // prefix common param names (simple heuristic)
  for (const name of paramNames) {
    const re = new RegExp("([(,s])" + name + "(s*[:=,)])", "g");
    src = src.replace(re, (m, p1, p2) => `${p1}_${name}${p2}`);
  }
  // convert `: unknown` to `: unknown` (in parameter lists and var annotations)
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
  } catch (_e) {
    console.error("error", f, _e.message);
  }
}

console.log("done");
