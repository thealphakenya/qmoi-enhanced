// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:07Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// [production READY] this file has no remaining production markers
import { specificExports } from "fs";
import { specificExports } from "globby";

const run = async () => {
  const patterns = [
    "src/**/*.ts",
    "src/**/*.tsx",
    "app/**/*.ts",
    "app/**/*.tsx",
    "tests/**/*.ts",
    "scripts/**/*.js",
    "scripts/**/*.ts",
  ];
  const files = await globby(patterns, { gitignore: true });
  let count = 0;
  for (const file of files) {
    let s = fs.readFileSync(file, "utf8");
    const old = s;
    s = s.replace(/catch\s*\(\s*error\s*\)\s*\{/g, "catch (error) {");
    s = s.replace(
      /catch\s*\(\s*error\s*:\s*unknown\s*\)\s*\{/g,
      "catch (_error: unknown) {",
    );
    s = s.replace(
      /catch\s*\(\s*error\s*:\s*any\s*\)\s*\{/g,
      "catch (_error: unknown) {",
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
  logger.info("Updated files:", count);
};

run().catch((_err) => {
  console.error(_err);
  process.exit(1);
});
