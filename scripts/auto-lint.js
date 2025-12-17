#!/usr/bin/env node

import { execSync, spawn } from "child_process";
import { writeFileSync, readFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class AutoLinter {
  constructor() {
    this.projectRoot = join(__dirname, "..");
    this.logsDir = join(this.projectRoot, "logs");
    this.ensureLogsDir();
    this.errorLogFile = join(this.logsDir, "lint-errors.json");
    this.fixableErrors = [];
    this.unfixableErrors = [];
    this.fixedFiles = [];
  }

  ensureLogsDir() {
    if (!existsSync(this.logsDir)) {
      mkdirSync(this.logsDir, { recursive: true });
    }
  }

  log(message, type = "info") {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${type.toUpperCase()}] ${message}`;
    console.log(logMessage);

    // Also write to log file
    const logFile = join(this.logsDir, "auto-lint.log");
    writeFileSync(logFile, logMessage + "\n", { flag: "a" });
  }

  async runCommand(command, options = {}) {
    return new Promise((resolve, reject) => {
      const child = spawn(command, options.args || [], {
        cwd: this.projectRoot,
        stdio: ["pipe", "pipe", "pipe"],
        shell: true,
        ...options,
      });

      let stdout = "";
      let stderr = "";

      child.stdout.on("data", (data) => {
        stdout += data.toString();
      });

      child.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      child.on("close", (code) => {
        resolve({ code, stdout, stderr });
      });

      child.on("error", (error) => {
        reject(error);
      });
    });
  }

  parseESLintOutput(output) {
    const lines = output.split("\n");
    const errors = [];
    let currentFile = "";

    for (const line of lines) {
      if (line.includes("✖") && line.includes("problems")) {
        // Summary line, skip
        continue;
      }

      if (line.includes("✖") && line.includes("error")) {
        // Error line
        const match = line.match(/✖\s+(\d+)\s+error/);
        if (match) {
          const errorCount = parseInt(match[1]);
          // Extract file path from previous lines
          const fileMatch = line.match(/^(.+?)\s+✖/);
          if (fileMatch) {
            currentFile = fileMatch[1].trim();
          }
        }
      }

      if (line.includes("✖") && line.includes("warning")) {
        // Warning line
        const match = line.match(/✖\s+(\d+)\s+warning/);
        if (match) {
          const warningCount = parseInt(match[1]);
        }
      }

      // Parse individual error/warning lines
      const errorMatch = line.match(
        /^\s*(\d+):(\d+)\s+(error|warning)\s+(.+?)\s+(.+)$/,
      );
      if (errorMatch) {
        const [, lineNum, colNum, severity, rule, message] = errorMatch;
        errors.push({
          file: currentFile,
          line: parseInt(lineNum),
          column: parseInt(colNum),
          severity,
          rule,
          message: message.trim(),
          fixable: this.isFixable(rule, message),
        });
      }
    }

    return errors;
  }

  isFixable(rule, message) {
    // Common fixable ESLint rules
    const fixableRules = [
      "no-unused-vars",
      "no-undef",
      "no-console",
      "prefer-const",
      "no-var",
      "eqeqeq",
      "no-trailing-spaces",
      "eol-last",
      "no-multiple-empty-lines",
      "comma-dangle",
      "semi",
      "quotes",
      "indent",
      "space-before-blocks",
      "space-before-function-paren",
      "object-curly-spacing",
      "array-bracket-spacing",
      "comma-spacing",
      "key-spacing",
      "space-infix-ops",
    ];

    return fixableRules.some((ruleName) => rule.includes(ruleName));
  }

  async runInitialLint() {
    this.log("Running initial ESLint check...");

    try {
      const result = await this.runCommand("yarn", { args: ["lint"] });

      if (result.code === 0) {
        this.log("✅ No linting errors found!", "success");
        return [];
      }

      const errors = this.parseESLintOutput(result.stdout + result.stderr);
      this.log(`Found ${errors.length} linting issues`, "info");

      return errors;
    } catch (error) {
      this.log(`Error running initial lint: ${error.message}`, "error");
      return [];
    }
  }

  async runAutoFix() {
    this.log("Running ESLint auto-fix...");

    try {
      const result = await this.runCommand("yarn", { args: ["lint:fix"] });

      if (result.code === 0) {
        this.log("✅ Auto-fix completed successfully!", "success");
        return true;
      }

      // Parse remaining errors after auto-fix
      const remainingErrors = this.parseESLintOutput(
        result.stdout + result.stderr,
      );
      this.log(
        `Auto-fix completed. ${remainingErrors.length} issues remain.`,
        "info",
      );

      return remainingErrors;
    } catch (error) {
      this.log(`Error running auto-fix: ${error.message}`, "error");
      return false;
    }
  }

  async runSmartLint() {
    this.log("Running smart lint fixes...");

    try {
      const result = await this.runCommand("node", {
        args: ["scripts/smart-lint.js"],
      });

      if (result.code === 0) {
        this.log("✅ Smart lint completed successfully!", "success");
        return true;
      }

      this.log(`Smart lint completed with exit code: ${result.code}`, "info");
      return result.code;
    } catch (error) {
      this.log(`Error running smart lint: ${error.message}`, "error");
      return false;
    }
  }

  categorizeErrors(errors) {
    const categorized = {
      fixable: [],
      unfixable: [],
      critical: [],
      warnings: [],
    };

    for (const error of errors) {
      if (error.severity === "error") {
        if (error.fixable) {
          categorized.fixable.push(error);
        } else {
          categorized.unfixable.push(error);
        }

        // Mark as critical if it's a common blocking issue
        if (
          ["no-undef", "no-unused-vars", "import/no-unresolved"].some((rule) =>
            error.rule.includes(rule),
          )
        ) {
          categorized.critical.push(error);
        }
      } else {
        categorized.warnings.push(error);
      }
    }

    return categorized;
  }

  generateErrorReport(categorizedErrors) {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total:
          categorizedErrors.fixable.length +
          categorizedErrors.unfixable.length +
          categorizedErrors.warnings.length,
        fixable: categorizedErrors.fixable.length,
        unfixable: categorizedErrors.unfixable.length,
        critical: categorizedErrors.critical.length,
        warnings: categorizedErrors.warnings.length,
      },
      errors: categorizedErrors,
      recommendations: this.generateRecommendations(categorizedErrors),
    };

    writeFileSync(this.errorLogFile, JSON.stringify(report, null, 2));
    return report;
  }

  generateRecommendations(categorizedErrors) {
    const recommendations = [];

    if (categorizedErrors.critical.length > 0) {
      recommendations.push({
        priority: "high",
        message: `Found ${categorizedErrors.critical.length} critical errors that need immediate attention`,
        actions: [
          "Review and fix import statements",
          "Check for undefined variables",
          "Remove unused imports and variables",
        ],
      });
    }

    if (categorizedErrors.unfixable.length > 0) {
      recommendations.push({
        priority: "medium",
        message: `Found ${categorizedErrors.unfixable.length} errors that require manual fixing`,
        actions: [
          "Review complex logic issues",
          "Check for TypeScript type errors",
          "Verify component prop types",
        ],
      });
    }

    if (categorizedErrors.warnings.length > 0) {
      recommendations.push({
        priority: "low",
        message: `Found ${categorizedErrors.warnings.length} warnings to consider`,
        actions: [
          "Review code style issues",
          "Consider performance optimizations",
          "Check for potential bugs",
        ],
      });
    }

    return recommendations;
  }

  displayReport(report) {
    console.log("\n" + "=".repeat(60));
    console.log("🔍 AUTO-LINT REPORT");
    console.log("=".repeat(60));

    console.log(`\n📊 Summary:`);
    console.log(`   Total Issues: ${report.summary.total}`);
    console.log(`   Fixable: ${report.summary.fixable}`);
    console.log(`   Unfixable: ${report.summary.unfixable}`);
    console.log(`   Critical: ${report.summary.critical}`);
    console.log(`   Warnings: ${report.summary.warnings}`);

    if (report.errors.critical.length > 0) {
      console.log(`\n🚨 CRITICAL ERRORS (${report.errors.critical.length}):`);
      report.errors.critical.forEach((error, index) => {
        console.log(
          `   ${index + 1}. ${error.file}:${error.line}:${error.column}`,
        );
        console.log(`      ${error.rule}: ${error.message}`);
      });
    }

    if (report.errors.unfixable.length > 0) {
      console.log(
        `\n⚠️  UNFIXABLE ERRORS (${report.errors.unfixable.length}):`,
      );
      report.errors.unfixable.slice(0, 5).forEach((error, index) => {
        console.log(
          `   ${index + 1}. ${error.file}:${error.line}:${error.column}`,
        );
        console.log(`      ${error.rule}: ${error.message}`);
      });

      if (report.errors.unfixable.length > 5) {
        console.log(`   ... and ${report.errors.unfixable.length - 5} more`);
      }
    }

    if (report.recommendations.length > 0) {
      console.log(`\n💡 RECOMMENDATIONS:`);
      report.recommendations.forEach((rec, index) => {
        console.log(
          `   ${index + 1}. [${rec.priority.toUpperCase()}] ${rec.message}`,
        );
        rec.actions.forEach((action) => {
          console.log(`      • ${action}`);
        });
      });
    }

    console.log(`\n📄 Full report saved to: ${this.errorLogFile}`);
    console.log("=".repeat(60) + "\n");
  }

  async run() {
    this.log("🚀 Starting Auto-Lint Process...", "info");

    // Step 1: Run initial lint to get all errors
    const initialErrors = await this.runInitialLint();

    if (initialErrors.length === 0) {
      this.log("🎉 No linting issues found! Code is clean.", "success");
      return;
    }

    // Step 2: Categorize errors
    const categorized = this.categorizeErrors(initialErrors);

    // Step 3: Run auto-fix
    const fixResult = await this.runAutoFix();

    // Step 4: Run smart lint for complex fixes
    if (fixResult !== true) {
      await this.runSmartLint();
    }

    // Step 5: Final check
    const finalErrors = await this.runInitialLint();
    const finalCategorized = this.categorizeErrors(finalErrors);

    // Step 6: Generate and display report
    const report = this.generateErrorReport(finalCategorized);
    this.displayReport(report);

    // Step 7: Exit with appropriate code
    if (finalCategorized.critical.length > 0) {
      this.log(
        "❌ Critical errors found. Please fix them before proceeding.",
        "error",
      );
      process.exit(1);
    } else if (finalCategorized.unfixable.length > 0) {
      this.log(
        "⚠️  Some errors require manual attention. Check the report above.",
        "warning",
      );
      process.exit(2);
    } else {
      this.log("✅ All fixable errors have been resolved!", "success");
      process.exit(0);
    }
  }
}

// Run the auto-linter
const autoLinter = new AutoLinter();
autoLinter.run().catch((error) => {
  console.error("Fatal error in auto-linter:", error);
  process.exit(1);
});
