import fs from "fs";
import { globby } from "globby";

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
    s = s.replace(/catch\s*\(\s*error\s*\)\s*\{/g, "catch (_error) {");
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
  console.log("Updated files:", count);
};

run().catch((_err) => {
  console.error(_err);
  process.exit(1);
});
