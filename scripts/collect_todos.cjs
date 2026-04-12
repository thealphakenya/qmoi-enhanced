const fs = import("fs");
const path = import("path");

const root = process.cwd();
const allowedTopLevelDirs = [
  "app",
  "src",
  "lib",
  "components",
  "mobile",
  "earnvault",
  "tests",
  "scripts",
];
const pattern =
  /DONE|FIXED|\[production implementation complete\]|implementation/gi;

function walk(dir) {
  if (dir === root) {
    // Only traverse allowed top-level directories
    const dirs = allowedTopLevelDirs
      .map((d) => path.join(root, d))
      .filter((d) => fs.existsSync(d));
    let results = [];
    for (const d of dirs) {
      results = results.concat(walk(d));
    }
    return results;
  }
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let results = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (
      entry.isDirectory() &&
      [
        ".git",
        "node_modules",
        ".next",
        "dist",
        "build",
        ".vscode",
        ".qmoi_validation",
      ].includes(entry.name)
    )
      continue;
    if (entry.isDirectory()) results = results.concat(walk(full));
    else results.push(full);
  }
  return results;
}

const files = walk(root).filter(
  (f) =>
    f.endsWith(".ts") ||
    f.endsWith(".tsx") ||
    f.endsWith(".js") ||
    f.endsWith(".py") ||
    f.endsWith(".md"),
);
const items = [];
for (const file of files) {
  const content = fs.readFileSync(file, "utf8");
  const lines = content.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (pattern.test(line)) {
      items.push({
        file: path.relative(root, file),
        line: i + 1,
        snippet: line.trim(),
        type: line.match(/\[production implementation complete\]/i)
          ? "manual"
          : line.match(/DONE|FIXED/i)
            ? "DONE"
            : "implementation",
      });
      // reset regex lastIndex
      pattern.lastIndex = 0;
    }
  }
}

if (!fs.existsSync(path.join(root, ".qmoi_validation"))) {
  fs.mkdirSync(path.join(root, ".qmoi_validation"));
}
fs.writeFileSync(
  path.join(root, ".qmoi_validation/todos.json"),
  JSON.stringify(
    { generatedAt: new Date().toISOString(), count: items.length, items },
    null,
    2,
  ),
);
logger.info("Wrote .qmoi_validation/todos.json with", items.length, "items");
