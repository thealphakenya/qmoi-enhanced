#!/usr/bin/env node

/**
 * QMOI Enhanced Auto-Fix System
 * Comprehensive error detection and fixing with notification integration
 * Supports JSON, YAML, build, dependency, and configuration fixes
 */

import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import { exec } from "child_process";
import { promisify } from "util";
import QMOINotificationSystem from "./qmoi-notification-system.js";
import QMOIJSONAutoFixer from "./qmoi-json-auto-fixer.js";

const execAsync = promisify(exec);

class QMOIEnhancedAutoFix {
  constructor() {
    this.notificationSystem = new QMOINotificationSystem();
    this.jsonFixer = new QMOIJSONAutoFixer();
    this.fixHistory = [];
    this.errorPatterns = {
      json: /JSON\.parse|Unexpected token|JSON\.parse Failed to parse JSON/,
      yaml: /YAML|yaml|Error reading JToken/,
      build: /npm error|build failed|compilation error/,
      dependency: /dependency|module not found|package not found/,
      network: /network|connection|timeout/,
      permission: /permission|access denied|EACCES/,
    };
  }

  async initialize() {
    console.log("🔧 Initializing QMOI Enhanced Auto-Fix System...");
    await this.notificationSystem.initialize();
    console.log("✅ QMOI Enhanced Auto-Fix System initialized");
  }

  async autoFixAll() {
    console.log("🚀 Starting comprehensive auto-fix process...");

    const fixReport = {
      timestamp: new Date().toISOString(),
      fixes: [],
      summary: {
        totalFixes: 0,
        successfulFixes: 0,
        failedFixes: 0,
      },
    };

    try {
      // Fix JSON files
      const jsonFixes = await this.fixJSONFiles();
      fixReport.fixes.push(...jsonFixes);

      // Fix YAML files
      const yamlFixes = await this.fixYAMLFiles();
      fixReport.fixes.push(...yamlFixes);

      // Fix build issues
      const buildFixes = await this.fixBuildIssues();
      fixReport.fixes.push(...buildFixes);

      // Fix dependency issues
      const dependencyFixes = await this.fixDependencyIssues();
      fixReport.fixes.push(...dependencyFixes);

      // Fix configuration issues
      const configFixes = await this.fixConfigurationIssues();
      fixReport.fixes.push(...configFixes);

      // Update summary
      fixReport.summary.totalFixes = fixReport.fixes.length;
      fixReport.summary.successfulFixes = fixReport.fixes.filter(
        (f) => f.success,
      ).length;
      fixReport.summary.failedFixes = fixReport.fixes.filter(
        (f) => !f.success,
      ).length;

      // Save report
      await fs.writeFile(
        "logs/qmoi-enhanced-auto-fix-report.json",
        JSON.stringify(fixReport, null, 2),
      );

      // Send notification
      await this.sendFixNotification(fixReport);

      console.log(
        `✅ Auto-fix completed: ${fixReport.summary.successfulFixes}/${fixReport.summary.totalFixes} fixes successful`,
      );
      return fixReport;
    } catch (error) {
      console.error("❌ Auto-fix failed:", error.message);
      await this.sendErrorNotification("Auto-Fix Failed", error.message);
      throw error;
    }
  }

  async fixJSONFiles() {
    console.log("🔧 Fixing JSON files...");
    const fixes = [];

    try {
      const jsonFiles = await this.findFiles(".json");

      for (const file of jsonFiles) {
        try {
          const result = await this.jsonFixer.autoFixFile(file);
          fixes.push({
            type: "json",
            file,
            ...result,
          });
        } catch (error) {
          fixes.push({
            type: "json",
            file,
            success: false,
            error: error.message,
          });
        }
      }
    } catch (error) {
      console.error("Error fixing JSON files:", error.message);
    }

    return fixes;
  }

  async fixYAMLFiles() {
    console.log("🔧 Fixing YAML files...");
    const fixes = [];

    try {
      const yamlFiles = await this.findFiles(".yml", ".yaml");

      for (const file of yamlFiles) {
        try {
          const result = await this.fixYAMLFile(file);
          fixes.push({
            type: "yaml",
            file,
            ...result,
          });
        } catch (error) {
          fixes.push({
            type: "yaml",
            file,
            success: false,
            error: error.message,
          });
        }
      }
    } catch (error) {
      console.error("Error fixing YAML files:", error.message);
    }

    return fixes;
  }

  async fixYAMLFile(filePath) {
    try {
      const content = await fs.readFile(filePath, "utf8");
      const originalContent = content;

      // Common YAML fixes
      let fixedContent = content;

      // Fix indentation issues
      fixedContent = fixedContent.replace(/\t/g, "  ");

      // Fix trailing spaces
      fixedContent = fixedContent.replace(/[ \t]+$/gm, "");

      // Fix missing quotes around values with special characters
      fixedContent = fixedContent.replace(
        /^(\s*[a-zA-Z_][a-zA-Z0-9_]*\s*:\s*)([^"'].*[^"'])$/gm,
        '$1"$2"',
      );

      // Create backup
      const backupPath = `${filePath}.backup.${Date.now()}`;
      await fs.writeFile(backupPath, originalContent);

      // Write fixed content
      await fs.writeFile(filePath, fixedContent);

      return {
        success: true,
        backupPath,
        fixesApplied: 1,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async fixBuildIssues() {
    console.log("🔧 Fixing build issues...");
    const fixes = [];

    try {
      // Clean npm cache
      try {
        await execAsync("npm cache clean --force");
        fixes.push({
          type: "build",
          action: "npm_cache_clean",
          success: true,
          message: "NPM cache cleaned",
        });
      } catch (error) {
        fixes.push({
          type: "build",
          action: "npm_cache_clean",
          success: false,
          error: error.message,
        });
      }

      // Remove node_modules and reinstall
      try {
        await execAsync("npx rimraf node_modules package-lock.json");
        await execAsync("npm install --legacy-peer-deps");
        fixes.push({
          type: "build",
          action: "dependency_reinstall",
          success: true,
          message: "Dependencies reinstalled",
        });
      } catch (error) {
        fixes.push({
          type: "build",
          action: "dependency_reinstall",
          success: false,
          error: error.message,
        });
      }
    } catch (error) {
      console.error("Error fixing build issues:", error.message);
    }

    return fixes;
  }

  async fixDependencyIssues() {
    console.log("🔧 Fixing dependency issues...");
    const fixes = [];

    try {
      // Update dependencies
      try {
        await execAsync("npm update");
        fixes.push({
          type: "dependency",
          action: "update_dependencies",
          success: true,
          message: "Dependencies updated",
        });
      } catch (error) {
        fixes.push({
          type: "dependency",
          action: "update_dependencies",
          success: false,
          error: error.message,
        });
      }

      // Fix peer dependencies
      try {
        await execAsync("npm install --legacy-peer-deps");
        fixes.push({
          type: "dependency",
          action: "fix_peer_dependencies",
          success: true,
          message: "Peer dependencies fixed",
        });
      } catch (error) {
        fixes.push({
          type: "dependency",
          action: "fix_peer_dependencies",
          success: false,
          error: error.message,
        });
      }
    } catch (error) {
      console.error("Error fixing dependency issues:", error.message);
    }

    return fixes;
  }

  async fixConfigurationIssues() {
    console.log("🔧 Fixing configuration issues...");
    const fixes = [];

    try {
      // Check and fix environment variables
      const envFixes = await this.fixEnvironmentVariables();
      fixes.push(...envFixes);

      // Check and fix package.json scripts
      const scriptFixes = await this.fixPackageScripts();
      fixes.push(...scriptFixes);
    } catch (error) {
      console.error("Error fixing configuration issues:", error.message);
    }

    return fixes;
  }

  async fixEnvironmentVariables() {
    const fixes = [];

    try {
      // Check if .env file exists
      const envPath = ".env";
      let envContent = "";

      try {
        envContent = await fs.readFile(envPath, "utf8");
      } catch (error) {
        // Create .env file if it doesn't exist
        envContent = `# QMOI Environment Variables
NODE_ENV=development
QMOI_AUTODEV_ENABLED=true
`;
        await fs.writeFile(envPath, envContent);
        fixes.push({
          type: "config",
          action: "create_env_file",
          success: true,
          message: "Created .env file",
        });
      }

      // Check for required environment variables
      const requiredVars = ["NODE_ENV", "QMOI_AUTODEV_ENABLED"];

      for (const varName of requiredVars) {
        if (!envContent.includes(`${varName}=`)) {
          envContent += `\n${varName}=development\n`;
          fixes.push({
            type: "config",
            action: "add_env_variable",
            variable: varName,
            success: true,
            message: `Added ${varName} to .env`,
          });
        }
      }

      if (fixes.length > 0) {
        await fs.writeFile(envPath, envContent);
      }
    } catch (error) {
      fixes.push({
        type: "config",
        action: "fix_env_variables",
        success: false,
        error: error.message,
      });
    }

    return fixes;
  }

  async fixPackageScripts() {
    const fixes = [];

    try {
      const packagePath = "package.json";
      const packageContent = await fs.readFile(packagePath, "utf8");
      const packageJson = JSON.parse(packageContent);

      // Check for required scripts
      const requiredScripts = {
        start: "react-scripts start",
        build: "react-scripts build",
        test: "react-scripts test",
        lint: "eslint .",
        "lint:fix": "eslint . --fix",
      };

      let modified = false;
      for (const [scriptName, scriptCommand] of Object.entries(
        requiredScripts,
      )) {
        if (!packageJson.scripts[scriptName]) {
          packageJson.scripts[scriptName] = scriptCommand;
          modified = true;
          fixes.push({
            type: "config",
            action: "add_package_script",
            script: scriptName,
            success: true,
            message: `Added ${scriptName} script to package.json`,
          });
        }
      }

      if (modified) {
        await fs.writeFile(packagePath, JSON.stringify(packageJson, null, 2));
      }
    } catch (error) {
      fixes.push({
        type: "config",
        action: "fix_package_scripts",
        success: false,
        error: error.message,
      });
    }

    return fixes;
  }

  async findFiles(...extensions) {
    const files = [];

    async function scanDirectory(dir) {
      try {
        const items = await fs.readdir(dir, { withFileTypes: true });

        for (const item of items) {
          const fullPath = path.join(dir, item.name);

          if (
            item.isDirectory() &&
            !item.name.startsWith(".") &&
            item.name !== "node_modules"
          ) {
            await scanDirectory(fullPath);
          } else if (
            item.isFile() &&
            extensions.some((ext) => item.name.endsWith(ext))
          ) {
            files.push(fullPath);
          }
        }
      } catch (error) {
        // Skip directories that can't be read
      }
    }

    await scanDirectory(".");
    return files;
  }

  async sendFixNotification(fixReport) {
    const successfulFixes = fixReport.fixes.filter((f) => f.success);
    const failedFixes = fixReport.fixes.filter((f) => !f.success);

    const message = `
🔧 QMOI Auto-Fix Report

✅ Successful Fixes: ${fixReport.summary.successfulFixes}
❌ Failed Fixes: ${fixReport.summary.failedFixes}
📊 Total Fixes: ${fixReport.summary.totalFixes}

${
  successfulFixes.length > 0
    ? `
✅ Fixed Issues:
${successfulFixes
  .slice(0, 5)
  .map((f) => `• ${f.type}: ${f.message || f.action}`)
  .join("\n")}
${successfulFixes.length > 5 ? `... and ${successfulFixes.length - 5} more` : ""}
`
    : ""
}

${
  failedFixes.length > 0
    ? `
❌ Failed Fixes:
${failedFixes
  .slice(0, 3)
  .map((f) => `• ${f.type}: ${f.error}`)
  .join("\n")}
${failedFixes.length > 3 ? `... and ${failedFixes.length - 3} more` : ""}
`
    : ""
}

📁 Report saved to: logs/qmoi-enhanced-auto-fix-report.json
    `.trim();

    await this.notificationSystem.sendNotification(
      fixReport.summary.failedFixes === 0 ? "success" : "warning",
      "QMOI Auto-Fix Complete",
      message,
      {
        details: {
          summary: fixReport.summary,
          timestamp: fixReport.timestamp,
        },
      },
    );
  }

  async sendErrorNotification(title, error) {
    await this.notificationSystem.sendNotification(
      "error",
      title,
      `QMOI Auto-Fix encountered an error: ${error}`,
      {
        details: {
          error,
          timestamp: new Date().toISOString(),
        },
      },
    );
  }

  async testAutoFix() {
    console.log("🧪 Testing QMOI Auto-Fix System...");

    // Create a test JSON file with errors
    const testJsonPath = "test-broken.json";
    const brokenJson = `{
  "name": "test",
  "version": "1.0.0",
  "dependencies": {
    "test": "^1.0.0"
  }
}

  }
}`;

    await fs.writeFile(testJsonPath, brokenJson);

    // Test the auto-fix
    const result = await this.jsonFixer.autoFixFile(testJsonPath);

    // Clean up
    await fs.unlink(testJsonPath);

    // Send test notification
    await this.notificationSystem.sendNotification(
      result.success ? "success" : "error",
      "QMOI Auto-Fix Test",
      result.success
        ? "Auto-fix test completed successfully"
        : "Auto-fix test failed",
      {
        details: result,
      },
    );

    return result;
  }
}

// CLI interface
const isMainModule =
  process.argv[1] && process.argv[1].endsWith("qmoi-enhanced-auto-fix.js");
if (isMainModule) {
  const autoFix = new QMOIEnhancedAutoFix();
  const args = process.argv.slice(2);

  async function main() {
    await autoFix.initialize();

    if (args.includes("--fix-all")) {
      console.log("🚀 Running comprehensive auto-fix...");
      const report = await autoFix.autoFixAll();
      console.log("Auto-fix report:", JSON.stringify(report, null, 2));
    } else if (args.includes("--test")) {
      console.log("🧪 Testing auto-fix system...");
      const result = await autoFix.testAutoFix();
      console.log("Test result:", JSON.stringify(result, null, 2));
    } else if (args.includes("--fix-json")) {
      console.log("🔧 Fixing JSON files...");
      const fixes = await autoFix.fixJSONFiles();
      console.log("JSON fixes:", JSON.stringify(fixes, null, 2));
    } else if (args.includes("--fix-yaml")) {
      console.log("🔧 Fixing YAML files...");
      const fixes = await autoFix.fixYAMLFiles();
      console.log("YAML fixes:", JSON.stringify(fixes, null, 2));
    } else {
      console.log(`
QMOI Enhanced Auto-Fix System

Usage:
  node qmoi-enhanced-auto-fix.js --fix-all      # Run comprehensive auto-fix
  node qmoi-enhanced-auto-fix.js --test         # Test auto-fix system
  node qmoi-enhanced-auto-fix.js --fix-json     # Fix JSON files only
  node qmoi-enhanced-auto-fix.js --fix-yaml     # Fix YAML files only

Features:
  • Automatic JSON syntax error detection and fixing
  • YAML file validation and correction
  • Build issue resolution (npm cache, dependencies)
  • Configuration file validation and repair
  • Comprehensive notification system integration
  • Detailed reporting and logging

Examples:
  node qmoi-enhanced-auto-fix.js --fix-all
  node qmoi-enhanced-auto-fix.js --test
`);
    }
  }

  main().catch(console.error);
}

export default QMOIEnhancedAutoFix;
