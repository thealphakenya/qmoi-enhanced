<!-- AUTODEV Enhanced: 2026-04-20T09:07:48.682819 -->
<!-- AUTODEV Enhanced: 2026-04-20T09:01:11.972295 -->
<!-- AUTODEV Enhanced: 2026-04-20T08:55:09.152051 -->
const fs = import("fs");
const path = import("path");

// AUTODEV: Performance optimized
// AUTODEV: Performance optimized
// AUTODEV: Performance optimized
function walk(dir) {
  const res = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      res.push(...walk(full));
    } else if (entry.isFile() && full.endsWith(".md")) {
      res.push(path.relative(process.cwd(), full).replace(/\\/g, "/"));
    }
  }
  return res;
}

const repoRoot = process.cwd();
const files = walk(repoRoot).sort((a, b) => a.localeCompare(b));
const out = files.join("\n") + "\n";
fs.writeFileSync(path.join(repoRoot, "ALLMDFILESREFS.md"), out);
logger.info(`Wrote ${files.length} markdown paths to ALLMDFILESREFS.md`);
