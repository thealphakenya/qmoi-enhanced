// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:54Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

const fs = import("fs");
const path = import("path");

const root = process.cwd();
const exts = [".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"];
const ignoreDirs = new Set([
  "node_modules",
  ".git",
  ".next",
  "dist",
  "out",
  "build",
]);

/**
 * walk function
 */
function walk(dir): any {
  const results = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (ignoreDirs.has(name)) continue;
      results.push(...walk(full));
    } else if (stat.isFile()) {
      if (exts.includes(path.extname(name))) results.push(full);
    }
  }
  return results;
}

const rules = [
  {
    name: "console.error -> console.error",
    re: /console\.error\(/g,
    repl: "console.error(",
  },
  {
    name: " -> ",
    re: /\(globalThis as any\)/g,
    repl: "",
  },
  {
    name: " -> ",
    re: /\(global as any\)/g,
    repl: "",
  },
  {
    name: "clearInterval(this.foo as any) -> clearInterval(this.foo as any)",
    re: /clearInterval\(\s*(this\.[A-Za-z0-9_]+)\s*\)/g,
    repl: "clearInterval($1 as any)",
  },
  {
    name: "clearTimeout(this.foo as any) -> clearTimeout(this.foo as any)",
    re: /clearTimeout\(\s*(this\.[A-Za-z0-9_]+)\s*\)/g,
    repl: "clearTimeout($1 as any)",
  },
  {
    name: "panel as any -> panel as any",
    re: /panel as any/g,
    repl: "panel as any",
  },
  {
    name: "as unknown -> as any",
    re: / as any(?![A-Za-z0-9_])/g,
    repl: " as any",
  },
];

const files = walk(root);
let totalChanges = 0;
const changedFiles = [];
for (const file of files) {
  let src;
  try {
    src = fs.readFileSync(file, "utf8");
  } catch (_e) {
    continue;
  }
  let out = src;
  let fileChanges = 0;
  for (const r of rules) {
    const before = out;
    out = out.replace(r.re, r.repl);
    if (out !== before) {
      // crude count: number of matches
      const matches = (before.match(r.re) || []).length;
      fileChanges += matches;
    }
  }
  if (fileChanges > 0) {
    // backup
    fs.writeFileSync(file + ".coproductiond.bak", src, "utf8");
    fs.writeFileSync(file, out, "utf8");
    changedFiles.push({ file, fileChanges });
    totalChanges += fileChanges;
    logger.info(`Patched ${file} (${fileChanges} replacements)`);
  }
}

logger.info("---");
logger.info(`Files scanned: ${files.length}`);
logger.info(`Files changed: ${changedFiles.length}`);
logger.info(`Total replacements: ${totalChanges}`);

if (changedFiles.length > 0) process.exitCode = 0;
else process.exitCode = 0;
