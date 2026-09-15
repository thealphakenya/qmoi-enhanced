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

function fixFile(file) {
  let src = fs.readFileSync(file, "utf8");
  const original = src;
  for (const name of paramNames) {
    const newName = `_${name}`;
    // replace identifier usages but NOT object keys (avoid `error:`)
    const idRe = new RegExp("\\b" + name + "\\b(?!\\s*:)", "g");
    src = src.replace(idRe, newName);
  }
  if (src !== original) {
    fs.writeFileSync(file, src, "utf8");
    console.log("fixed refs", path.relative(root, file));
  }
}

const files = walk(target);
for (const f of files) {
  try {
    fixFile(f);
  } catch (_e) {
    console.error("_err", f, _e.message);
  }
}
console.log("done");
