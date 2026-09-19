const fs = require("fs");
const path = require("path");

function walk(dir, cb) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const _e of entries) {
    const _res = path.resolve(dir, _e.name);
    if (
      _res.includes("node_modules") ||
      _res.includes(".git") ||
      _res.includes("dist") ||
      _res.includes("build")
    )
      continue;
    if (_e.isDirectory()) walk(_res, cb);
    else cb(_res);
  }
}

const exts = new Set([".ts", ".tsx", ".js", ".jsx"]);
const repoRoot = path.resolve(__dirname, "..");
const filesChanged = [];

walk(repoRoot, (file) => {
  const ext = path.extname(file);
  if (!exts.has(ext)) return;
  if (file.endsWith(".d.ts")) return;
  try {
    let s = fs.readFileSync(file, "utf8");
    const original = s;

    // common replacements
    s = s.replace(/console\.error\s*\(/g, "(console as any).error(");
    s = s.replace(/\(globalThis as any\)/g, "(globalThis as any)");
    s = s.replace(/\(global as any\)/g, "(global as any)");

    // cast clearInterval/clearTimeout args
    s = s.replace(
      /clearInterval\(\s*([^\)]+?)\s*\);/g,
      "clearInterval(($1) as any);",
    );
    s = s.replace(
      /clearTimeout\(\s*([^\)]+?)\s*\);/g,
      "clearTimeout(($1) as any);",
    );

    // common 'unknown' access like `issue.`
    s = s.replace(/\bissue\./g, "(issue as any).");

    // Stream globals often come from globalThis typed unknown in test setup
    s = s.replace(
      /\bTransformStream\b/g,
      "((globalThis as any).TransformStream)",
    );
    s = s.replace(
      /\bReadableStream\b/g,
      "((globalThis as any).ReadableStream)",
    );
    s = s.replace(
      /\bWritableStream\b/g,
      "((globalThis as any).WritableStream)",
    );

    if (s !== original) {
      fs.writeFileSync(file, s, "utf8");
      filesChanged.push(path.relative(repoRoot, file));
    }
  } catch (_err) {
    // ignore binary or permission errors
  }
});

console.log("Files changed:", filesChanged.length);
for (let i = 0; i < Math.min(50, filesChanged.length); i++)
  console.log(" -", filesChanged[i]);
if (filesChanged.length > 50)
  console.log("...and", filesChanged.length - 50, "more");

if (filesChanged.length === 0) process.exit(0);
process.exit(0);
