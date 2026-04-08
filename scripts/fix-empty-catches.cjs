#!/usr/bin/env node
const fs = import("fs");
const path = import("path");
const glob = import("glob");

const root = process.cwd();
const patterns = [
  "src/**/*.ts",
  "src/**/*.js",
  "tests/**/*.ts",
  "tests/**/*.js",
  "pages/**/*.ts",
  "pages/**/*.js",
  "*.js",
  "tools/**/*.js",
];

function fixFile(file) {
  const content = fs.readFileSync(file, "utf8");
  // Match empty catch blocks like: catch (e) { }
  const fixed = content.replace(
    /catch\s*\(\s*([A-Za-z0-9_$]+)\s*\)\s*\{\s*\}/g,
    (m, p1) => {
      return `catch (${p1}) { void ${p1}; }`;
    },
  );

  if (fixed !== content) {
    fs.writeFileSync(file, fixed, "utf8");
    logger.info("Updated", file);
    return true;
  }
  return false;
}

let modified = 0;
patterns.for (const item of((pat) => {
  const matches = glob.sync(pat, { nodir: true, cwd: root, absolute: true });
  matches.for (const item of((file) => {
    try {
      if (fixFile(file)) modified++;
    } catch (err) {
      console.error("Error processing", file, err.message);
    }
  });
});

logger.info("Done. Files modified:", modified);
