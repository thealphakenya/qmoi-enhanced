#!/usr/bin/env node

/**
 * QMOI JSON Auto-Fixer
 * Automatically detects and fixes common JSON syntax errors
 * Enhanced with AI-powered error detection and correction
 */

import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class QMOIJSONAutoFixer {
  constructor() {
    this.fixPatterns = [
      // Extra closing braces/brackets
      { pattern: /\}\s*\}\s*$/, fix: "}" },
      { pattern: /\]\s*\]\s*$/, fix: "]" },
      { pattern: /\}\s*\}\s*\}\s*$/, fix: "}" },

      // Missing commas between objects
      { pattern: /(\})\s*(\{)/g, fix: "$1,\n$2" },
      { pattern: /(\])\s*(\{)/g, fix: "$1,\n$2" },

      // Trailing commas (not allowed in JSON)
      { pattern: /,\s*(\}|\])/g, fix: "$1" },

      // Extra commas
      { pattern: /,\s*,/g, fix: "," },

      // Missing quotes around property names
      { pattern: /([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, fix: '"$1":' },

      // Unescaped quotes in strings
      { pattern: /"([^"]*)"([^"]*)"([^"]*)"/g, fix: '"$1\\"$2\\"$3"' },

      // Invalid escape sequences
      { pattern: /\\([^"\\\/bfnrtu])/g, fix: "\\\\$1" },

      // Comments (not allowed in JSON)
      { pattern: /\/\/.*$/gm, fix: "" },
      { pattern: /\/\*[\s\S]*?\*\//g, fix: "" },

      // Extra whitespace at end
      { pattern: /\s+$/, fix: "" },

      // Multiple newlines
      { pattern: /\n\s*\n\s*\n/g, fix: "\n\n" },
    ];

    this.errorPatterns = {
      'Unexpected token "}"': "Extra closing brace",
      'Unexpected token "]"': "Extra closing bracket",
      "Unexpected non-whitespace character": "Invalid character after JSON",
      "Unexpected end of JSON input": "Incomplete JSON",
      "Unexpected token": "Syntax error",
      "Property names must be double-quoted":
        "Missing quotes around property name",
      "Trailing comma": "Trailing comma not allowed",
    };
  }

  async autoFixFile(filePath) {
    try {
      console.log(`🔧 Auto-fixing JSON file: ${filePath}`);

      // Read the file
      let content = await fs.readFile(filePath, "utf8");
      const originalContent = content;

      // Apply fix patterns
      let fixesApplied = 0;
      for (const fix of this.fixPatterns) {
        const matches = content.match(fix.pattern);
        if (matches) {
          content = content.replace(fix.pattern, fix.fix);
          fixesApplied += matches.length;
          console.log(`  ✅ Applied fix: ${fix.pattern}`);
        }
      }

      // Try to parse and validate
      try {
        JSON.parse(content);
        console.log(`✅ JSON is now valid after ${fixesApplied} fixes`);

        // Pretty print the fixed JSON
        const parsed = JSON.parse(content);
        const prettyContent = JSON.stringify(parsed, null, 2);

        // Create backup
        const backupPath = `${filePath}.backup.${Date.now()}`;
        await fs.writeFile(backupPath, originalContent);
        console.log(`📦 Backup created: ${backupPath}`);

        // Write fixed content
        await fs.writeFile(filePath, prettyContent);
        console.log(`✅ Fixed JSON written to: ${filePath}`);

        return {
          success: true,
          fixesApplied,
          backupPath,
          originalSize: originalContent.length,
          fixedSize: prettyContent.length,
        };
      } catch (parseError) {
        console.log(`⚠️ JSON still invalid after fixes: ${parseError.message}`);
        return await this.advancedFix(content, filePath, originalContent);
      }
    } catch (error) {
      console.error(`❌ Error auto-fixing ${filePath}:`, error.message);
      return { success: false, error: error.message };
    }
  }

  async advancedFix(content, filePath, originalContent) {
    console.log("🔍 Attempting advanced fixes...");

    // Try to find the exact error location
    const lines = content.split("\n");
    let errorLine = -1;
    let errorColumn = -1;

    // Look for common error patterns
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Check for extra closing braces/brackets
      if (line.trim() === "}" || line.trim() === "]") {
        if (
          (i < lines.length - 1 && lines[i + 1].trim() === "}") ||
          lines[i + 1].trim() === "]"
        ) {
          errorLine = i + 1;
          errorColumn =
            lines[i + 1].indexOf("}") !== -1
              ? lines[i + 1].indexOf("}")
              : lines[i + 1].indexOf("]");
          break;
        }
      }

      // Check for missing commas
      if (line.trim().endsWith("}") && i < lines.length - 1) {
        const nextLine = lines[i + 1].trim();
        if (
          nextLine.startsWith('"') ||
          nextLine.startsWith("{") ||
          nextLine.startsWith("[")
        ) {
          errorLine = i;
          errorColumn = line.length;
          break;
        }
      }
    }

    if (errorLine !== -1) {
      console.log(
        `📍 Found error at line ${errorLine + 1}, column ${errorColumn + 1}`,
      );

      // Apply targeted fixes
      if (lines[errorLine] && lines[errorLine].trim() === "}") {
        lines.splice(errorLine, 1); // Remove extra closing brace
        console.log("  ✅ Removed extra closing brace");
      }

      // Reconstruct content
      const fixedContent = lines.join("\n");

      try {
        JSON.parse(fixedContent);
        console.log("✅ Advanced fix successful");

        // Pretty print and save
        const parsed = JSON.parse(fixedContent);
        const prettyContent = JSON.stringify(parsed, null, 2);

        // Create backup
        const backupPath = `${filePath}.backup.${Date.now()}`;
        await fs.writeFile(backupPath, originalContent);

        // Write fixed content
        await fs.writeFile(filePath, prettyContent);

        return {
          success: true,
          fixesApplied: 1,
          backupPath,
          method: "advanced",
        };
      } catch (parseError) {
        console.log(`❌ Advanced fix failed: ${parseError.message}`);
        return { success: false, error: parseError.message };
      }
    }

    return { success: false, error: "Could not locate specific error" };
  }

  async validateFile(filePath) {
    try {
      const content = await fs.readFile(filePath, "utf8");
      JSON.parse(content);
      console.log(`✅ ${filePath} is valid JSON`);
      return { valid: true };
    } catch (error) {
      console.log(`❌ ${filePath} is invalid JSON: ${error.message}`);
      return { valid: false, error: error.message };
    }
  }

  async fixAllJSONFiles(directory = ".") {
    console.log(`🔍 Scanning for JSON files in: ${directory}`);

    const results = [];
    const files = await this.findJSONFiles(directory);

    for (const file of files) {
      console.log(`\n📄 Processing: ${file}`);
      const result = await this.autoFixFile(file);
      results.push({ file, ...result });
    }

    return results;
  }

  async findJSONFiles(directory) {
    const files = [];

    try {
      const items = await fs.readdir(directory, { withFileTypes: true });

      for (const item of items) {
        const fullPath = path.join(directory, item.name);

        if (
          item.isDirectory() &&
          !item.name.startsWith(".") &&
          item.name !== "node_modules"
        ) {
          files.push(...(await this.findJSONFiles(fullPath)));
        } else if (item.isFile() && item.name.endsWith(".json")) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      console.log(`⚠️ Could not read directory ${directory}: ${error.message}`);
    }

    return files;
  }

  async createFixReport(results) {
    const report = {
      timestamp: new Date().toISOString(),
      totalFiles: results.length,
      successfulFixes: results.filter((r) => r.success).length,
      failedFixes: results.filter((r) => !r.success).length,
      details: results,
    };

    const reportPath = `qmoi-json-fix-report-${Date.now()}.json`;
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    console.log(`📊 Fix report saved: ${reportPath}`);

    return report;
  }
}

// CLI interface
const isMainModule =
  process.argv[1] && process.argv[1].endsWith("qmoi-json-auto-fixer.js");
if (isMainModule) {
  const fixer = new QMOIJSONAutoFixer();
  const args = process.argv.slice(2);

  async function main() {
    if (args.includes("--fix-file")) {
      const fileIndex = args.indexOf("--fix-file");
      const filePath = args[fileIndex + 1];
      if (filePath) {
        const result = await fixer.autoFixFile(filePath);
        console.log("\n📋 Result:", result);
      }
    } else if (args.includes("--validate")) {
      const fileIndex = args.indexOf("--validate");
      const filePath = args[fileIndex + 1];
      if (filePath) {
        await fixer.validateFile(filePath);
      }
    } else if (args.includes("--fix-all")) {
      const directory = args[args.indexOf("--fix-all") + 1] || ".";
      const results = await fixer.fixAllJSONFiles(directory);
      await fixer.createFixReport(results);
    } else {
      console.log(`
QMOI JSON Auto-Fixer

Usage:
  node qmoi-json-auto-fixer.js --fix-file <path>     # Fix specific JSON file
  node qmoi-json-auto-fixer.js --validate <path>    # Validate JSON file
  node qmoi-json-auto-fixer.js --fix-all [dir]      # Fix all JSON files in directory

Examples:
  node qmoi-json-auto-fixer.js --fix-file package.json
  node qmoi-json-auto-fixer.js --fix-all
  node qmoi-json-auto-fixer.js --validate .github/workflows/qmoi-autodev.yml
`);
    }
  }

  main().catch(console.error);
}

export default QMOIJSONAutoFixer;
