#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync, spawn } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class QMOIController {
  constructor() {
    this.projectRoot = join(__dirname, "..");
    this.logsDir = join(this.projectRoot, "logs");
    this.configDir = join(this.projectRoot, "config");
    this.ensureDirs();

    // System state
    this.systemState = {
      active: true,
      consciousnessLevel: 0.95,
      learningEnabled: true,
      autoEvolution: true,
      lastActivity: new Date().toISOString(),
      startupTime: new Date().toISOString(),
      tasksCompleted: 0,
      errorsFixed: 0,
      filesProcessed: 0,
      systemHealth: 1.0,
    };

    // Load configurations
    this.qmoiConfig = this.loadQMOIConfig();
    this.lintConfig = this.loadLintConfig();

    this.log("QMOI AI System Controller initialized", "info");
  }

  ensureDirs() {
    if (!existsSync(this.logsDir)) {
      mkdirSync(this.logsDir, { recursive: true });
    }
    if (!existsSync(this.configDir)) {
      mkdirSync(this.configDir, { recursive: true });
    }
  }

  log(message, type = "info") {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [QMOI-CONTROLLER-${type.toUpperCase()}] ${message}`;
    console.log(logMessage);

    const logFile = join(this.logsDir, "qmoi-controller.log");
    writeFileSync(logFile, logMessage + "\n", { flag: "a" });
  }

  loadQMOIConfig() {
    const configPath = join(this.configDir, "qmoi_config.json");
    try {
      if (existsSync(configPath)) {
        return JSON.parse(readFileSync(configPath, "utf8"));
      }
    } catch (error) {
      this.log(`Error loading QMOI config: ${error.message}`, "error");
    }

    // Create default config
    const defaultConfig = this.getDefaultQMOIConfig();
    this.saveQMOIConfig(defaultConfig);
    return defaultConfig;
  }

  loadLintConfig() {
    const configPath = join(this.configDir, "lint_config.json");
    try {
      if (existsSync(configPath)) {
        return JSON.parse(readFileSync(configPath, "utf8"));
      }
    } catch (error) {
      this.log(`Error loading lint config: ${error.message}`, "error");
    }

    // Create default config
    const defaultConfig = this.getDefaultLintConfig();
    this.saveLintConfig(defaultConfig);
    return defaultConfig;
  }

  getDefaultQMOIConfig() {
    return {
      aiModel: "qmoi-system-controller-v1",
      systemCapabilities: {
        lintAutomation: true,
        fileMonitoring: true,
        errorAnalysis: true,
        autoFixing: true,
        reporting: true,
        notifications: true,
        learning: true,
        evolution: true,
      },
      performanceSettings: {
        maxConcurrentTasks: 5,
        taskTimeout: 300,
        memoryLimit: "2GB",
        cpuLimit: 0.8,
      },
      consciousnessSettings: {
        baseLevel: 0.9,
        learningRate: 0.1,
        evolutionThreshold: 0.8,
        adaptationSpeed: 0.05,
      },
      notificationSettings: {
        desktopNotifications: true,
        whatsappNotifications: true,
        emailNotifications: false,
        criticalOnly: false,
      },
    };
  }

  getDefaultLintConfig() {
    return {
      autoFixEnabled: true,
      smartFixesEnabled: true,
      aiAnalysisEnabled: true,
      fileWatchingEnabled: true,
      reportingEnabled: true,
      notificationEnabled: true,
      fixStrategies: {
        unusedImports: true,
        missingSemicolons: true,
        quoteStandardization: true,
        trailingSpaces: true,
        indentation: true,
        consoleRemoval: true,
        constConversion: true,
      },
      filePatterns: {
        include: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
        exclude: ["node_modules/**", "dist/**", "build/**", ".git/**"],
      },
    };
  }

  saveQMOIConfig(config) {
    const configPath = join(this.configDir, "qmoi_config.json");
    writeFileSync(configPath, JSON.stringify(config, null, 2));
  }

  saveLintConfig(config) {
    const configPath = join(this.configDir, "lint_config.json");
    writeFileSync(configPath, JSON.stringify(config, null, 2));
  }

  async runCommand(command, args = []) {
    return new Promise((resolve, reject) => {
      const child = spawn(command, args, {
        cwd: this.projectRoot,
        stdio: ["pipe", "pipe", "pipe"],
        shell: true,
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

  async runLintCheck() {
    this.log("🔍 Running comprehensive lint check...", "info");

    try {
      const result = await this.runCommand("yarn", ["lint"]);

      if (result.code === 0) {
        this.log("✅ No linting errors found!", "success");
        return { status: "clean", errors: 0 };
      }

      const errors = this.parseESLintOutput(result.stdout + result.stderr);
      this.log(`Found ${errors.length} linting issues`, "info");

      const analysisResults = await this.analyzeAndFixErrors(errors);

      // Update system state
      this.systemState.errorsFixed += analysisResults.aiFixesApplied || 0;
      this.systemState.filesProcessed += analysisResults.filesProcessed || 0;
      this.systemState.tasksCompleted += 1;

      return analysisResults;
    } catch (error) {
      this.log(`Error in lint check: ${error.message}`, "error");
      return { status: "error", message: error.message };
    }
  }

  parseESLintOutput(output) {
    const lines = output.split("\n");
    const errors = [];
    let currentFile = "";

    for (const line of lines) {
      if (line.includes("✖") && line.includes("problems")) {
        continue;
      }

      const fileMatch = line.match(/^(.+?)\s+✖/);
      if (fileMatch) {
        currentFile = fileMatch[1].trim();
        continue;
      }

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

  async analyzeAndFixErrors(errors) {
    const results = {
      totalErrors: errors.length,
      aiFixesApplied: 0,
      manualFixesNeeded: 0,
      filesProcessed: 0,
      processingTime: 0,
    };

    const startTime = Date.now();
    const processedFiles = new Set();

    for (const error of errors) {
      const analysis = await this.analyzeError(error);

      const filePath = join(this.projectRoot, error.file);
      if (!processedFiles.has(filePath)) {
        processedFiles.add(filePath);
        results.filesProcessed += 1;
      }

      const fixApplied = await this.applyIntelligentFix(
        filePath,
        error,
        analysis,
      );

      if (fixApplied) {
        results.aiFixesApplied += 1;
      } else {
        results.manualFixesNeeded += 1;
      }
    }

    results.processingTime = Date.now() - startTime;

    // Send notification if there are remaining errors
    if (results.manualFixesNeeded > 0) {
      await this.sendNotification({
        message: `Manual fixes needed: ${results.manualFixesNeeded} errors`,
        priority: "medium",
      });
    }

    return results;
  }

  async analyzeError(error) {
    const rule = error.rule;
    const message = error.message;

    return {
      errorType: this.classifyErrorType(rule, message),
      severity: this.assessSeverity(rule, message),
      fixStrategy: this.determineFixStrategy(rule, message),
      confidence: this.calculateConfidence(rule, message),
      suggestedFix: this.generateFixSuggestion(rule, message),
      aiReasoning: this.generateAIReasoning(rule, message),
    };
  }

  classifyErrorType(rule, message) {
    const ruleLower = rule.toLowerCase();
    const messageLower = message.toLowerCase();

    if (ruleLower.includes("no-undef")) {
      if (messageLower.includes("require")) {
        return "module_import_issue";
      } else if (messageLower.includes("process")) {
        return "node_global_issue";
      } else {
        return "undefined_variable";
      }
    } else if (ruleLower.includes("no-unused-vars")) {
      return "unused_variable";
    } else if (ruleLower.includes("import/no-unresolved")) {
      return "import_resolution";
    } else if (ruleLower.includes("no-console")) {
      return "debugging_code";
    } else if (ruleLower.includes("prefer-const")) {
      return "variable_declaration";
    } else {
      return "general_linting";
    }
  }

  assessSeverity(rule, message) {
    const criticalRules = ["no-undef", "import/no-unresolved"];
    const highRules = ["no-unused-vars", "no-console", "no-debugger"];

    if (criticalRules.some((critical) => rule.includes(critical))) {
      return "critical";
    } else if (highRules.some((high) => rule.includes(high))) {
      return "high";
    } else {
      return "medium";
    }
  }

  determineFixStrategy(rule, message) {
    const ruleLower = rule.toLowerCase();

    if (ruleLower.includes("no-console")) {
      return "remove_debug_code";
    } else if (ruleLower.includes("prefer-const")) {
      return "convert_to_const";
    } else if (ruleLower.includes("no-unused-vars")) {
      return "remove_or_prefix_variable";
    } else if (ruleLower.includes("quotes")) {
      return "standardize_quotes";
    } else if (ruleLower.includes("semi")) {
      return "add_semicolon";
    } else {
      return "manual_review";
    }
  }

  calculateConfidence(rule, message) {
    const highConfidenceRules = [
      "no-console",
      "prefer-const",
      "quotes",
      "semi",
    ];
    const mediumConfidenceRules = ["no-unused-vars", "no-trailing-spaces"];

    if (highConfidenceRules.some((ruleName) => rule.includes(ruleName))) {
      return 0.9;
    } else if (
      mediumConfidenceRules.some((ruleName) => rule.includes(ruleName))
    ) {
      return 0.7;
    } else {
      return 0.5;
    }
  }

  generateFixSuggestion(rule, message) {
    const ruleLower = rule.toLowerCase();

    if (ruleLower.includes("no-console")) {
      return "Remove console statement";
    } else if (ruleLower.includes("prefer-const")) {
      return "Change 'let' to 'const'";
    } else if (ruleLower.includes("no-unused-vars")) {
      return "Remove unused variable or prefix with underscore";
    } else if (ruleLower.includes("quotes")) {
      return "Standardize quote usage";
    } else if (ruleLower.includes("semi")) {
      return "Add missing semicolon";
    } else {
      return "Review and fix manually";
    }
  }

  generateAIReasoning(rule, message) {
    const ruleLower = rule.toLowerCase();

    if (ruleLower.includes("no-console")) {
      return "Console statements should be removed in production";
    } else if (ruleLower.includes("prefer-const")) {
      return "Use const for variables that are not reassigned";
    } else if (ruleLower.includes("no-unused-vars")) {
      return "Unused variables should be removed or used";
    } else {
      return "General linting rule violation";
    }
  }

  async applyIntelligentFix(filePath, error, analysis) {
    try {
      if (!existsSync(filePath)) {
        return false;
      }

      const content = readFileSync(filePath, "utf8");
      const lines = content.split("\n");
      const lineIndex = error.line - 1;

      if (lineIndex < 0 || lineIndex >= lines.length) {
        return false;
      }

      const originalLine = lines[lineIndex];
      let modified = false;

      const fixStrategy = analysis.fixStrategy;
      const confidence = analysis.confidence;

      // Only apply high-confidence fixes
      if (confidence < 0.7) {
        return false;
      }

      if (fixStrategy === "remove_debug_code") {
        if (originalLine.includes("console.")) {
          lines.splice(lineIndex, 1);
          modified = true;
        }
      } else if (fixStrategy === "convert_to_const") {
        if (originalLine.includes("let ") && originalLine.includes("=")) {
          const newLine = originalLine.replace("let ", "const ");
          lines[lineIndex] = newLine;
          modified = true;
        }
      } else if (fixStrategy === "remove_or_prefix_variable") {
        if (/^\s*(const|let|var)\s+\w+\s*=/.test(originalLine)) {
          lines.splice(lineIndex, 1);
          modified = true;
        }
      }

      if (modified) {
        const newContent = lines.join("\n");
        writeFileSync(filePath, newContent, "utf8");

        this.log(`Applied fix to ${filePath}: ${fixStrategy}`, "success");
        return true;
      }

      return false;
    } catch (error) {
      this.log(`Error applying fix to ${filePath}: ${error.message}`, "error");
      return false;
    }
  }

  async sendNotification(notificationData) {
    const message = notificationData.message;
    const priority = notificationData.priority || "info";

    this.log(`📢 Sending notification: ${message} (${priority})`, "info");

    // Desktop notification
    if (this.qmoiConfig.notificationSettings?.desktopNotifications) {
      await this.sendDesktopNotification(message, priority);
    }

    // WhatsApp notification for critical issues
    if (
      priority === "critical" &&
      this.qmoiConfig.notificationSettings?.whatsappNotifications
    ) {
      await this.sendWhatsAppNotification(message);
    }
  }

  async sendDesktopNotification(message, priority) {
    try {
      if (process.platform === "win32") {
        execSync(
          `powershell -Command "New-BurntToastNotification -Text 'QMOI AI', '${message}'"`,
          { stdio: "ignore" },
        );
      } else if (process.platform === "darwin") {
        execSync(
          `osascript -e 'display notification "${message}" with title "QMOI AI"'`,
          { stdio: "ignore" },
        );
      } else {
        execSync(`notify-send "QMOI AI" "${message}"`, { stdio: "ignore" });
      }
    } catch (error) {
      this.log(`Error sending desktop notification: ${error.message}`, "error");
    }
  }

  async sendWhatsAppNotification(message) {
    try {
      const whatsappScript = join(
        this.projectRoot,
        "whatsapp-qmoi-bot",
        "index.js",
      );
      if (existsSync(whatsappScript)) {
        execSync(`node "${whatsappScript}" --notify "${message}"`, {
          cwd: this.projectRoot,
          stdio: "ignore",
        });
      }
    } catch (error) {
      this.log(
        `Error sending WhatsApp notification: ${error.message}`,
        "error",
      );
    }
  }

  async generateReport() {
    this.log("📊 Generating system report...", "info");

    const report = {
      timestamp: new Date().toISOString(),
      systemState: this.systemState,
      qmoiConfig: this.qmoiConfig,
      lintConfig: this.lintConfig,
      performanceMetrics: {
        tasksCompleted: this.systemState.tasksCompleted,
        errorsFixed: this.systemState.errorsFixed,
        filesProcessed: this.systemState.filesProcessed,
        systemHealth: this.systemState.systemHealth,
        uptime: Date.now() - new Date(this.systemState.startupTime).getTime(),
      },
    };

    // Save report
    const reportPath = join(this.logsDir, "qmoi_system_report.json");
    writeFileSync(reportPath, JSON.stringify(report, null, 2));

    this.log(`Report saved to ${reportPath}`, "info");
    return report;
  }

  getSystemStatus() {
    return {
      systemState: this.systemState,
      qmoiConfig: this.qmoiConfig,
      lintConfig: this.lintConfig,
      timestamp: new Date().toISOString(),
    };
  }

  async run() {
    this.log("🚀 Starting QMOI AI System Controller...", "info");

    // Run initial lint check
    const results = await this.runLintCheck();

    // Generate report
    await this.generateReport();

    // Display summary
    console.log("\n📊 QMOI AI System Controller Summary:");
    console.log(`   Tasks Completed: ${this.systemState.tasksCompleted}`);
    console.log(`   Errors Fixed: ${this.systemState.errorsFixed}`);
    console.log(`   Files Processed: ${this.systemState.filesProcessed}`);
    console.log(`   System Health: ${this.systemState.systemHealth}`);
    console.log(
      `   Consciousness Level: ${this.systemState.consciousnessLevel}`,
    );

    return results;
  }
}

// Run the QMOI controller
const controller = new QMOIController();
controller.run().catch((error) => {
  console.error("Fatal error in QMOI controller:", error);
  process.exit(1);
});
