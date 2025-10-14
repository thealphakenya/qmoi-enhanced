#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync, spawn } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class AILintEngine {
  constructor() {
    this.projectRoot = join(__dirname, "..");
    this.logsDir = join(this.projectRoot, "logs");
    this.qmoiConfigPath = join(this.projectRoot, "config", "qmoi_config.json");
    this.ensureLogsDir();
    this.fixesApplied = 0;
    this.filesModified = new Set();
    this.qmoiAI = null;
    this.aiEnabled = false;
  }

  ensureLogsDir() {
    if (!existsSync(this.logsDir)) {
      mkdirSync(this.logsDir, { recursive: true });
    }
  }

  log(message, type = "info") {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [AI-LINT-${type.toUpperCase()}] ${message}`;
    console.log(logMessage);

    const logFile = join(this.logsDir, "ai-lint-engine.log");
    writeFileSync(logFile, logMessage + "\n", { flag: "a" });
  }

  async initializeQMOI() {
    try {
      // Check if QMOI AI is available
      const qmoiScript = join(
        this.projectRoot,
        "scripts",
        "qmoi_enhanced_ai.py",
      );
      if (existsSync(qmoiScript)) {
        this.aiEnabled = true;
        this.log("QMOI AI detected and enabled", "success");
        return true;
      } else {
        this.log("QMOI AI not found, using fallback mode", "warning");
        return false;
      }
    } catch (error) {
      this.log(`Error initializing QMOI AI: ${error.message}`, "error");
      return false;
    }
  }

  async callQMOIAI(prompt, context = {}) {
    if (!this.aiEnabled) {
      return this.fallbackAIResponse(prompt, context);
    }

    try {
      const qmoiScript = join(
        this.projectRoot,
        "scripts",
        "qmoi_enhanced_ai.py",
      );
      const input = JSON.stringify({
        prompt,
        context,
        task: "lint_fix",
        timestamp: new Date().toISOString(),
      });

      const result = execSync(`python "${qmoiScript}" --lint-fix '${input}'`, {
        cwd: this.projectRoot,
        encoding: "utf8",
        stdio: "pipe",
        timeout: 30000, // 30 second timeout
      });

      return JSON.parse(result);
    } catch (error) {
      this.log(`QMOI AI call failed: ${error.message}`, "error");
      return this.fallbackAIResponse(prompt, context);
    }
  }

  fallbackAIResponse(prompt, context) {
    // Fallback AI logic for when QMOI AI is not available
    const response = {
      success: true,
      suggestion: this.generateFallbackSuggestion(prompt, context),
      confidence: 0.7,
      reasoning: "Generated using fallback AI logic",
    };
    return response;
  }

  generateFallbackSuggestion(prompt, context) {
    // Intelligent fallback suggestions based on error patterns
    if (prompt.includes("no-undef")) {
      if (prompt.includes("require")) {
        return 'Add "require" to globals or convert to ES6 import';
      }
      if (prompt.includes("module")) {
        return 'Add "module" to globals or use ES6 module syntax';
      }
      if (prompt.includes("process")) {
        return 'Add "process" to globals or use import { env } from "process"';
      }
    }

    if (prompt.includes("no-unused-vars")) {
      return "Remove unused variable or prefix with underscore (_variable)";
    }

    if (prompt.includes("import/no-unresolved")) {
      return "Check import path, install missing package, or add to module resolution";
    }

    if (prompt.includes("no-console")) {
      return "Remove console statement or add eslint-disable comment";
    }

    return "Review code logic and fix according to ESLint rules";
  }

  async analyzeError(error) {
    const prompt = `Analyze this ESLint error and provide a fix:
File: ${error.file}
Line: ${error.line}
Column: ${error.column}
Rule: ${error.rule}
Message: ${error.message}

Provide a specific fix that can be applied automatically.`;

    const context = {
      file: error.file,
      line: error.line,
      column: error.column,
      rule: error.rule,
      message: error.message,
      projectType: "typescript-react",
      framework: "nextjs",
    };

    return await this.callQMOIAI(prompt, context);
  }

  async applyAIFix(filePath, error, aiResponse) {
    if (!aiResponse.success || !aiResponse.suggestion) {
      return false;
    }

    try {
      const content = readFileSync(filePath, "utf8");
      const lines = content.split("\n");
      const lineIndex = error.line - 1;

      if (lineIndex < 0 || lineIndex >= lines.length) {
        return false;
      }

      const originalLine = lines[lineIndex];
      let modifiedLine = originalLine;
      let modified = false;

      // Apply AI-suggested fixes
      if (aiResponse.suggestion.includes('Add "require" to globals')) {
        // This would be handled by ESLint config, skip
        return false;
      }

      if (aiResponse.suggestion.includes("Remove unused variable")) {
        // Remove the line if it's just a variable declaration
        if (originalLine.trim().match(/^(const|let|var)\s+\w+\s*=/)) {
          lines.splice(lineIndex, 1);
          modified = true;
        }
      }

      if (aiResponse.suggestion.includes("Remove console statement")) {
        // Remove console statements
        if (originalLine.includes("console.")) {
          lines.splice(lineIndex, 1);
          modified = true;
        }
      }

      if (aiResponse.suggestion.includes("prefix with underscore")) {
        // Add underscore prefix to unused variables
        const varMatch = originalLine.match(/(const|let|var)\s+(\w+)/);
        if (varMatch && !originalLine.includes("_")) {
          modifiedLine = originalLine.replace(varMatch[2], `_${varMatch[2]}`);
          lines[lineIndex] = modifiedLine;
          modified = true;
        }
      }

      if (modified) {
        const newContent = lines.join("\n");
        writeFileSync(filePath, newContent, "utf8");
        this.filesModified.add(filePath);
        this.fixesApplied++;
        this.log(
          `AI fix applied to ${filePath}: ${aiResponse.suggestion}`,
          "success",
        );
        return true;
      }

      return false;
    } catch (error) {
      this.log(
        `Error applying AI fix to ${filePath}: ${error.message}`,
        "error",
      );
      return false;
    }
  }

  async fixComplexErrors(errors) {
    this.log("Starting AI-powered complex error fixing...", "info");

    const errorsByFile = {};
    for (const error of errors) {
      if (!errorsByFile[error.file]) {
        errorsByFile[error.file] = [];
      }
      errorsByFile[error.file].push(error);
    }

    let totalFixes = 0;

    for (const [filePath, fileErrors] of Object.entries(errorsByFile)) {
      const fullPath = join(this.projectRoot, filePath);

      if (!existsSync(fullPath)) {
        continue;
      }

      for (const error of fileErrors) {
        // Analyze error with AI
        const aiResponse = await this.analyzeError(error);

        // Apply AI fix
        const fixApplied = await this.applyAIFix(fullPath, error, aiResponse);

        if (fixApplied) {
          totalFixes++;
        }

        // Add small delay to prevent overwhelming the AI
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    this.log(
      `AI fixes applied: ${totalFixes} across ${this.filesModified.size} files`,
      "success",
    );
    return totalFixes;
  }

  async runESLint() {
    try {
      const output = execSync("yarn lint", {
        cwd: this.projectRoot,
        encoding: "utf8",
        stdio: "pipe",
      });
      return { success: true, output: "" };
    } catch (error) {
      return { success: false, output: error.stdout || error.stderr || "" };
    }
  }

  parseErrors(output) {
    const lines = output.split("\n");
    const errors = [];
    let currentFile = "";

    for (const line of lines) {
      // Extract file path
      const fileMatch = line.match(/^(.+?)\s+✖/);
      if (fileMatch) {
        currentFile = fileMatch[1].trim();
        continue;
      }

      // Parse error details
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
          timestamp: new Date().toISOString(),
        });
      }
    }

    return errors;
  }

  categorizeErrors(errors) {
    const categories = {
      aiFixable: [],
      manualFix: [],
      critical: [],
      warnings: [],
    };

    for (const error of errors) {
      if (error.severity === "error") {
        // AI can potentially fix these
        if (
          [
            "no-undef",
            "no-unused-vars",
            "no-console",
            "import/no-unresolved",
          ].some((rule) => error.rule.includes(rule))
        ) {
          categories.aiFixable.push(error);
        } else {
          categories.manualFix.push(error);
        }

        // Mark as critical
        if (
          ["no-undef", "import/no-unresolved"].some((rule) =>
            error.rule.includes(rule),
          )
        ) {
          categories.critical.push(error);
        }
      } else {
        categories.warnings.push(error);
      }
    }

    return categories;
  }

  async run() {
    this.log("🚀 Starting AI-Powered Lint Engine...", "info");

    // Initialize QMOI AI
    await this.initializeQMOI();

    // Step 1: Run ESLint to get current errors
    const lintResult = await this.runESLint();

    if (lintResult.success) {
      this.log("✅ No linting errors found!", "success");
      return;
    }

    // Step 2: Parse and categorize errors
    const errors = this.parseErrors(lintResult.output);
    const categories = this.categorizeErrors(errors);

    this.log(`Found ${errors.length} linting issues`, "info");
    this.log(`AI-fixable: ${categories.aiFixable.length}`, "info");
    this.log(`Manual fix needed: ${categories.manualFix.length}`, "info");

    // Step 3: Apply AI fixes to complex errors
    if (categories.aiFixable.length > 0) {
      await this.fixComplexErrors(categories.aiFixable);
    }

    // Step 4: Run ESLint again to check remaining errors
    const finalResult = await this.runESLint();

    if (finalResult.success) {
      this.log("🎉 All errors have been automatically fixed!", "success");
    } else {
      const remainingErrors = this.parseErrors(finalResult.output);
      const remainingCategories = this.categorizeErrors(remainingErrors);

      this.log(
        `AI fixes applied. ${remainingErrors.length} issues remain.`,
        "warning",
      );

      // Display remaining errors
      console.log("\n📋 Remaining Issues:");
      remainingErrors.slice(0, 10).forEach((error, index) => {
        console.log(
          `   ${index + 1}. ${error.file}:${error.line}:${error.column} - ${error.rule}: ${error.message}`,
        );
      });

      if (remainingErrors.length > 10) {
        console.log(`   ... and ${remainingErrors.length - 10} more`);
      }
    }

    // Step 5: Generate summary
    console.log("\n📊 AI Lint Engine Summary:");
    console.log(`   AI Fixes Applied: ${this.fixesApplied}`);
    console.log(`   Files Modified: ${this.filesModified.size}`);
    console.log(`   QMOI AI Enabled: ${this.aiEnabled ? "Yes" : "No"}`);
    console.log(
      `   Remaining Issues: ${finalResult.success ? 0 : this.parseErrors(finalResult.output).length}`,
    );
  }
}

// Run the AI lint engine
const aiLintEngine = new AILintEngine();
aiLintEngine.run().catch((error) => {
  console.error("Fatal error in AI lint engine:", error);
  process.exit(1);
});
