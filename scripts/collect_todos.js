const fs = require("fs");
const path = require("path");

const root = process.cwd();
const pattern =
  /TODO|FIXME|\[PRODUCTION IMPLEMENTATION REQUIRED\]|placeholder/gi;

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let results = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name === ".git") continue;
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
        type: line.match(/\[PRODUCTION IMPLEMENTATION REQUIRED\]/i)
          ? "manual"
          : line.match(/TODO|FIXME/i)
            ? "todo"
            : "placeholder",
      });
      // reset regex lastIndex
      pattern.lastIndex = 0;
    }
  }
}

fs.writeFileSync(
  path.join(root, ".qmoi_validation/todos.json"),
  JSON.stringify(
    { generatedAt: new Date().toISOString(), count: items.length, items },
    null,
    2,
  ),
);
console.log("Wrote .qmoi_validation/todos.json with", items.length, "items");

// AUTOFIXED by Ollama at 2026-07-20T02:07:46.803667Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:41.218837Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:34.252456Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:06.195471Z
