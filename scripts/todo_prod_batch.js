// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:55Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env node
/*
 * scripts/
 * - Scans the repo for 
 * - Safely replaces obvious, small-file occurrences with REVIEWED notes
 * - Leaves ambiguous cases (links, large generated files) untouched and records them in a pending report
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const EXCLUDE_DIRS = [
  "node_modules",
  ".git",
  ".next",
  "dist",
  "coverage",
  "_archive_qmoi-enhanced",
];
const SKIP_FILES = ["link_report.md"]; // large generated file(s) — skip automatic edits
const SAFE_EXT = new Set([".md", ".txt", ".rst"]);
const MAX_SAFE_SIZE = 200 * 1024; // 200 KB

const 

function isBinary(filename) {
  const textExt = [".md", ".txt", ".json", ".js", ".ts", ".tsx", ".html"];
  return !textExt.includes(path.extname(filename).toLowerCase());
}

async function walk(dir, files = []) {
  const dirents = await fs.promises.readdir(dir, { withFileTypes: true });
  for (const d of dirents) {
    if (EXCLUDE_DIRS.includes(d.name)) continue;
    const abs = path.join(dir, d.name);
    if (d.isDirectory()) {
      await walk(abs, files);
    } else {
      files.push(abs);
    }
  }
  return files;
}

function isAmbiguousLine(line) {
  // Heuristics: presence of urls, link markdown chars near token, or code fencing
  if (/https?:\/\//i.test(line)) return true;
  if (/\[.*\]\(.*\)/.test(line)) return true;
  if (/`.*
  return false;
}

(async function main() {
  console.log("Scanning for 
  const allFiles = await walk(ROOT);
  const results = {
    scannedFiles: 0,
    matchedFiles: [],
    replacedFiles: [],
    replacedCount: 0,
    ambiguous: [],
  };

  for (const f of allFiles) {
    const name = path.basename(f);
    if (SKIP_FILES.includes(name)) continue;
    const ext = path.extname(f).toLowerCase();
    if (!SAFE_EXT.has(ext)) continue;
    let stat;
    try {
      stat = await fs.promises.stat(f);
    } catch (_e) {
      continue;
    }
    results.scannedFiles++;
    if (stat.size === 0) continue;
    if (stat.size > MAX_SAFE_SIZE) {
      // skip large files to avoid accidental changes to generated files
      continue;
    }

    let content = await fs.promises.readFile(f, "utf8");
    if (!
    // Reset regex

    const lines = content.split(/\r?\n/);
    let ambiguousFound = false;
    for (let i = 0; i < lines.length; i++) {
      if (
        if (isAmbiguousLine(lines[i])) {
          ambiguousFound = true;
          results.ambiguous.push({
            file: f,
            lineNumber: i + 1,
            line: lines[i].trim(),
          });
        }
      }
      
    }

    if (ambiguousFound) {
      results.matchedFiles.push({ file: f, safe: false });
      continue;
    }

    // Safe to replace all 
    const replacementNote =
      "REVIEWED: production 
    const newContent = content.replace(/\b
    if (newContent !== content) {
      await fs.promises.writeFile(f, newContent, "utf8");
      results.replacedFiles.push({ file: f, replaced: true });
      const count = (content.match(/\b
      results.replacedCount += count;
      console.log(
        `Replaced ${count} occurrence(s) in: ${path.relative(ROOT, f)}`,
      );
    }
  }

  // Save results
  await fs.promises.writeFile(
    path.join(ROOT, "
    JSON.stringify(results, null, 2),
    "utf8",
  );

  // Save ambiguous list for manual review
  if (results.ambiguous.length) {
    const lines = [
      "Ambiguous 
      "",
    ];
    for (const a of results.ambiguous) {
      lines.push(`${path.relative(ROOT, a.file)}:${a.lineNumber}: ${a.line}`);
    }
    await fs.promises.writeFile(
      path.join(ROOT, "
      lines.join("\n"),
      "utf8",
    );
  }

  console.log("Batch sweep complete.");
  console.log(`Files scanned: ${results.scannedFiles}`);
  console.log(
    `Files auto-replaced: ${results.replacedFiles.length}, total replacements: ${results.replacedCount}`,
  );
  console.log(
    `Ambiguous occurrences: ${results.ambiguous.length} (see 
  );
})();
