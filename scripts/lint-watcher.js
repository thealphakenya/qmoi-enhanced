#!/usr/bin/env node

import { watch } from "fs";
import { spawn } from "child_process";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { writeFileSync, existsSync, mkdirSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class LintWatcher {
  constructor() {
    this.projectRoot = join(__dirname, "..");
    this.logsDir = join(this.projectRoot, "logs");
    this.ensureLogsDir();
    this.watchedExtensions = [".ts", ".tsx", ".js", ".jsx"];
    this.ignoredDirs = [
      "node_modules",
      ".git",
      "dist",
      "build",
      "logs",
      ".next",
    ];
    this.debounceTimer = null;
    this.isRunning = false;
    this.lastRun = null;
  }

  ensureLogsDir() {
    if (!existsSync(this.logsDir)) {
      mkdirSync(this.logsDir, { recursive: true });
    }
  }

  log(message, type = "info") {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [WATCHER-${type.toUpperCase()}] ${message}`;
    console.log(logMessage);

    const logFile = join(this.logsDir, "lint-watcher.log");
    writeFileSync(logFile, logMessage + "\n", { flag: "a" });
  }

  shouldIgnoreFile(filePath) {
    const relativePath = filePath.replace(this.projectRoot, "");
    return (
      this.ignoredDirs.some((dir) => relativePath.includes(dir)) ||
      !this.watchedExtensions.some((ext) => filePath.endsWith(ext))
    );
  }

  async runLint() {
    if (this.isRunning) {
      this.log("Lint already running, skipping...", "warn");
      return;
    }

    this.isRunning = true;
    this.lastRun = new Date();

    this.log("Running lint check...", "info");

    return new Promise((resolve) => {
      const child = spawn("node", ["scripts/auto-lint.js"], {
        cwd: this.projectRoot,
        stdio: "inherit",
        shell: true,
      });

      child.on("close", (code) => {
        this.isRunning = false;
        this.log(`Lint completed with exit code: ${code}`, "info");
        resolve(code);
      });

      child.on("error", (error) => {
        this.isRunning = false;
        this.log(`Lint error: ${error.message}`, "error");
        resolve(1);
      });
    });
  }

  debouncedLint() {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this.runLint();
    }, 1000); // Wait 1 second after last file change
  }

  startWatching() {
    this.log("Starting file watcher...", "info");
    this.log(`Watching for changes in: ${this.projectRoot}`, "info");
    this.log(
      `Watched extensions: ${this.watchedExtensions.join(", ")}`,
      "info",
    );
    this.log(`Ignored directories: ${this.ignoredDirs.join(", ")}`, "info");

    watch(this.projectRoot, { recursive: true }, (eventType, filename) => {
      if (!filename) return;

      const filePath = join(this.projectRoot, filename);

      if (this.shouldIgnoreFile(filePath)) {
        return;
      }

      this.log(`File changed: ${filename} (${eventType})`, "debug");
      this.debouncedLint();
    });

    this.log("✅ File watcher is now active. Press Ctrl+C to stop.", "success");
  }

  stop() {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    this.log("Stopping file watcher...", "info");
    process.exit(0);
  }
}

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n🛑 Received SIGINT, shutting down gracefully...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n🛑 Received SIGTERM, shutting down gracefully...");
  process.exit(0);
});

// Start the watcher
const watcher = new LintWatcher();
watcher.startWatching();
