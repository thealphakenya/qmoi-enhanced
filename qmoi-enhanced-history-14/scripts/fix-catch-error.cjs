const fs = require("fs");
const path = require("path");
const globby = require("globby");

function walk(dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (
        ["node_modules", ".git", ".next", "dist", "build"].includes(entry.name)
      )
        continue;
      walk(full, fileList);
    } else {
      fileList.push(full);
    }
  }
  return fileList;
}

(async () => {
  const root = process.cwd();
  const files = walk(root).filter((f) => {
    return (
      /\.(ts|tsx|js)$/.test(f) &&
      (f.includes("/src/") ||
        f.includes("/app/") ||
        f.includes("/tests/") ||
        f.includes("/scripts/"))
    );
  });
  const patterns = [
    "src/**/*.ts",
    "src/**/*.tsx",
    "app/**/*.ts",
    "app/**/*.tsx",
    "tests/**/*.ts",
    "scripts/**/*.js",
    "scripts/**/*.ts",
  ];
  let count = 0;
  for (const file of files) {
    let s = fs.readFileSync(file, "utf8");
    const old = s;
    s = s.replace(/catch\s*\(\s*error\s*\)\s*\{/g, "catch (_error) {");
    s = s.replace(
      /catch\s*\(\s*error\s*:\s*unknown\s*\)\s*\{/g,
      "catch (_error: unknown) {",
    );
    s = s.replace(
      /catch\s*\(\s*error\s*:\s*any\s*\)\s*\{/g,
      "catch (_error: any) {",
    );
    s = s.replace(
      /catch\s*\(\s*error\s*:\s*Error\s*\)\s*\{/g,
      "catch (_error: Error) {",
    );
    if (s !== old) {
      fs.writeFileSync(file, s, "utf8");
      count++;
    }
  }
  console.log("Updated files:", count);
})();
