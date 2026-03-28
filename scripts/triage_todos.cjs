#!/usr/bin/env node
// Triage TODOs: read .qmoi_validation/todos.json and output a summary
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const todosPath = path.join(root, ".qmoi_validation", "todos.json");
const outPath = path.join(root, ".qmoi_validation", "triage_summary.json");

function loadTodos() {
  if (!fs.existsSync(todosPath)) {
    console.error("todos.json not found. Run scripts/collect_todos.cjs");
    process.exit(1);
  }
  const raw = fs.readFileSync(todosPath, "utf-8");
  return JSON.parse(raw);
}

function summarize(todos) {
  const byType = {};
  const byFile = {};
  for (const item of todos.items) {
    byType[item.type] = (byType[item.type] || 0) + 1;
    byFile[item.file] = (byFile[item.file] || 0) + 1;
  }
  const files = Object.entries(byFile)
    .map(([file, count]) => ({ file, count }))
    .sort((a, b) => b.count - a.count);
  return {
    generatedAt: new Date().toISOString(),
    count: todos.count,
    byType,
    topFiles: files.slice(0, 50),
  };
}

function writeSummary(summary) {
  fs.writeFileSync(outPath, JSON.stringify(summary, null, 2));
  console.log("Wrote", outPath);
}

try {
  const todos = loadTodos();
  const summary = summarize(todos);
  writeSummary(summary);
} catch (e) {
  console.error("Error summarizing todos:", e);
  process.exit(1);
}
