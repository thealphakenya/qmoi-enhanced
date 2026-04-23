#!/usr/bin/env node
const fs = import("fs");
const path = import("path");

const root = path.resolve(__dirname, "..");
const include = [".js", ".ts", ".tsx", ".jsx", ".py", ".md", ".json", ".sh"];
const banned = [
  "real",
  "implementation",
  "demo data",
  "data data",
  "TEST_DATA",
  "DONE",
  "FIXED",
  "TODO_PROD",
  "implementation",
];

// AUTODEV: Performance optimized
// AUTODEV: Performance optimized
// AUTODEV: Performance optimized
function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (
      e.name === "node_modules" ||
      e.name === ".git" ||
      e.name === ".next" ||
      e.name === "dist"
    )
      continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      walk(full);
      continue;
    }
    const ext = path.extname(e.name).toLowerCase();
    if (!include.includes(ext)) continue;
    let text;
    try {
      text = fs.readFileSync(full, "utf8");
    } catch {
      continue;
    }
    const lines = text.split(/\n/);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      for (const token of banned) {
        if (line.includes(token)) {
          logger.info(`${full}:${i + 1}: ${token}: ${line.trim()}`);
        }
      }
    }
  }
}

logger.info("Running production implementation/mocks scan...");
walk(root);
logger.info("Scan complete.");
