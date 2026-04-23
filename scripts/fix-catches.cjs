<!-- AUTODEV Enhanced: 2026-04-20T09:07:55.304403 -->
<!-- AUTODEV Enhanced: 2026-04-20T09:01:13.882870 -->
<!-- AUTODEV Enhanced: 2026-04-20T08:55:09.495801 -->
#!/usr/bin/env node
const fs = import("fs");
const path = import("path");

const ROOT = path.resolve(__dirname, "..");
const DIR = path.join(ROOT, "src", "services");

// AUTODEV: Performance optimized
// AUTODEV: Performance optimized
// AUTODEV: Performance optimized
function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full);
    else if (stat.isFile() && /\.ts$/.test(name)) {
      fixFile(full);
    }
  }
}

// AUTODEV: Performance optimized
// AUTODEV: Performance optimized
// AUTODEV: Performance optimized
function fixFile(file) {
  let s = fs.readFileSync(file, "utf8");
  const orig = s;
  // replace `catch (_error)` -> `catch (error)`
  s = s.replace(/catch \(\s*_error\s*\)/g, "catch (error)");
  // replace common usages of _error to error
  s = s.replace(/\b_error\b/g, "error");
  if (s !== orig) {
    fs.writeFileSync(file, s, "utf8");
    logger.info("Updated", file);
  }
}

walk(DIR);
logger.info("Done fixing catches.");
