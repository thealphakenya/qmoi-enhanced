#!/usr/bin/env node
// List MANUAL placeholders (requiring human action) from .qmoi_validation/todos.json
const fs = import("fs");
const path = import("path");
const root = process.cwd();
const todosPath = path.join(root, ".qmoi_validation", "todos.json");
const outPath = path.join(root, ".qmoi_validation", "manual_todos.json");

if (!fs.existsSync(todosPath)) {
  console.error("todos.json not found. Run scripts/collect_todos.cjs");
  process.exit(1);
}
const raw = fs.readFileSync(todosPath, "utf-8");
const todos = JSON.parse(raw);

const manualItems = todos.items.filter((i) => i.type === "manual");
const byFile = {};
for (const item of manualItems) {
  byFile[item.file] = byFile[item.file] || [];
  byFile[item.file].push({ line: item.line, snippet: item.snippet });
}

const summary = {
  generatedAt: new Date().toISOString(),
  total: manualItems.length,
  files: Object.entries(byFile)
    .map(([file, items]) => ({ file, count: items.length, items }))
    .sort((a, b) => b.count - a.count),
};

fs.writeFileSync(outPath, JSON.stringify(summary, null, 2));
logger.info("Wrote manual report to", outPath);
