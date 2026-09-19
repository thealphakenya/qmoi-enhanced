const fs = require("fs");
const path = require("path");
const { generateStub, updateDocs } = require("../../scripts/auto_utils");

describe("Auto-watcher utilities", () => {
  const testFile = "test_feature.ts";
  const featuresIndex = path.join("docs", "FEATURESINDEX.md");

  afterEach(() => {
    if (fs.existsSync(testFile)) fs.unlinkSync(testFile);
    // Remove last line from FEATURESINDEX.md
    if (fs.existsSync(featuresIndex)) {
      const lines = fs.readFileSync(featuresIndex, "utf8").split("\n");
      lines.pop();
      fs.writeFileSync(featuresIndex, lines.join("\n"));
    }
  });

  it("should generate a stub file", () => {
    generateStub(testFile);
    expect(fs.existsSync(testFile)).toBe(true);
    const content = fs.readFileSync(testFile, "utf8");
    expect(content).toMatch(/Auto-generated stub/);
  });

  it("should update FEATURESINDEX.md", () => {
    updateDocs(testFile);
    const content = fs.readFileSync(featuresIndex, "utf8");
    expect(content).toMatch(new RegExp(testFile));
  });
});
