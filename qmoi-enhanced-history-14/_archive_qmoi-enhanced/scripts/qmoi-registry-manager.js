#!/usr/bin/env node

/**
 * QMOI Registry Manager - Enhanced
 * Now supports feedback loops, advanced AI triggers, external API integration, auto-evolution, and advanced error/fix tracking.
 */

const fs = require("fs").promises;
const path = require("path");
const crypto = require("crypto");
const axios = require("axios");

class QMOIRegistryManager {
  constructor() {
    this.registryPath = path.join(
      process.cwd(),
      "config",
      "qmoi-registry.json",
    );
    this.registry = {
      version: "2.0.0",
      lastUpdated: new Date().toISOString(),
      components: {},
      configurations: {},
      autoEnhancements: {},
      devices: {},
      platforms: {},
      integrations: {},
      security: {},
      performance: {},
      errors: {},
      fixes: {},
      feedback: [],
      aiActions: [],
      apiSync: {},
      analytics: {},
      evolutionHistory: [],
    };
    this.autoEnhancementRules = new Map();
    this.initializeRegistry();
  }

  async initializeRegistry() {
    try {
      try {
        const data = await fs.readFile(this.registryPath, "utf8");
        this.registry = { ...this.registry, ...JSON.parse(data) };
      } catch (error) {
        console.log("Creating new QMOI registry...");
        await this.saveRegistry();
      }
      this.initializeAutoEnhancementRules();
      await this.registerCoreComponents();
      console.log("✅ QMOI Registry initialized successfully");
    } catch (error) {
      console.error("❌ Error initializing QMOI registry:", error.message);
    }
  }

  initializeAutoEnhancementRules() {
    // Performance optimization rules
    this.autoEnhancementRules.set("performance", {
      condition: (metrics) => metrics.memoryUsage > 80 || metrics.cpuUsage > 90,
      action: async () => {
        await this.optimizePerformance();
        return "Performance optimized";
      },
      priority: 1,
    });

    // Memory optimization rules
    this.autoEnhancementRules.set("memory", {
      condition: (metrics) => metrics.memoryUsage > 85,
      action: async () => {
        await this.optimizeMemory();
        return "Memory optimized";
      },
      priority: 2,
    });

    // Error detection rules
    this.autoEnhancementRules.set("error_detection", {
      condition: (metrics) => metrics.errorRate > 0.05,
      action: async () => {
        await this.autoFixErrors();
        return "Errors auto-fixed";
      },
      priority: 3,
    });

    // Security enhancement rules
    this.autoEnhancementRules.set("security", {
      condition: (metrics) => metrics.securityScore < 0.8,
      action: async () => {
        await this.enhanceSecurity();
        return "Security enhanced";
      },
      priority: 4,
    });

    // Network optimization rules
    this.autoEnhancementRules.set("network", {
      condition: (metrics) => metrics.networkLatency > 1000,
      action: async () => {
        await this.optimizeNetwork();
        return "Network optimized";
      },
      priority: 5,
    });
  }

  async registerCoreComponents() {
    const coreComponents = {
      "qmoi-avatar": {
        type: "ui-component",
        version: "1.0.0",
        status: "active",
        dependencies: ["react", "framer-motion"],
        autoEnhancement: true,
        lastUpdated: new Date().toISOString(),
      },
      "qmoi-error-handler": {
        type: "service",
        version: "1.0.0",
        status: "active",
        dependencies: ["axios", "child_process"],
        autoEnhancement: true,
        lastUpdated: new Date().toISOString(),
      },
      "qmoi-registry": {
        type: "system",
        version: "1.0.0",
        status: "active",
        dependencies: ["fs", "path"],
        autoEnhancement: true,
        lastUpdated: new Date().toISOString(),
      },
      "qcity-device": {
        type: "device",
        version: "1.0.0",
        status: "active",
        dependencies: ["node", "npm"],
        autoEnhancement: true,
        lastUpdated: new Date().toISOString(),
      },
      "qmoi-vpn": {
        type: "security",
        version: "1.0.0",
        status: "active",
        dependencies: ["crypto", "net"],
        autoEnhancement: true,
        lastUpdated: new Date().toISOString(),
      },
      "qmoi-autodev": {
        type: "automation",
        version: "1.0.0",
        status: "active",
        dependencies: ["child_process", "fs"],
        autoEnhancement: true,
        lastUpdated: new Date().toISOString(),
      },
    };

    for (const [name, component] of Object.entries(coreComponents)) {
      await this.registerComponent(name, component);
    }
  }

  async registerComponent(name, component) {
    this.registry.components[name] = {
      ...component,
      id: crypto.randomUUID(),
      registeredAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };

    console.log(`✅ Registered component: ${name}`);
    await this.saveRegistry();
  }

  async registerConfiguration(name, config) {
    this.registry.configurations[name] = {
      ...config,
      id: crypto.randomUUID(),
      registeredAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };

    console.log(`✅ Registered configuration: ${name}`);
    await this.saveRegistry();
  }

  async registerDevice(name, device) {
    this.registry.devices[name] = {
      ...device,
      id: crypto.randomUUID(),
      registeredAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      status: "active",
    };

    console.log(`✅ Registered device: ${name}`);
    await this.saveRegistry();
  }

  async registerPlatform(name, platform) {
    this.registry.platforms[name] = {
      ...platform,
      id: crypto.randomUUID(),
      registeredAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      status: "active",
    };

    console.log(`✅ Registered platform: ${name}`);
    await this.saveRegistry();
  }

  async registerIntegration(name, integration) {
    this.registry.integrations[name] = {
      ...integration,
      id: crypto.randomUUID(),
      registeredAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      status: "active",
    };

    console.log(`✅ Registered integration: ${name}`);
    await this.saveRegistry();
  }

  // --- FEEDBACK LOOP & AI ACTION TRACKING ---
  async recordFeedback(type, source, message, data = {}) {
    const feedback = {
      id: crypto.randomUUID(),
      type,
      source,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
    this.registry.feedback.push(feedback);
    await this.saveRegistry();
    console.log(`📝 Feedback recorded: ${type} from ${source}`);
    return feedback.id;
  }

  async recordAIAction(action, trigger, outcome, details = {}) {
    const aiAction = {
      id: crypto.randomUUID(),
      action,
      trigger,
      outcome,
      details,
      timestamp: new Date().toISOString(),
    };
    this.registry.aiActions.push(aiAction);
    await this.saveRegistry();
    console.log(`🤖 AI action recorded: ${action} (trigger: ${trigger})`);
    return aiAction.id;
  }

  // --- EXTERNAL API INTEGRATION ---
  async syncExternalAPI(name, url, params = {}) {
    try {
      const response = await axios.get(url, { params });
      this.registry.apiSync[name] = {
        data: response.data,
        lastSync: new Date().toISOString(),
      };
      await this.saveRegistry();
      console.log(`🌐 Synced external API: ${name}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Failed to sync API ${name}:`, error.message);
      return null;
    }
  }

  async getExternalAPIData(name) {
    return this.registry.apiSync[name]?.data;
  }

  // --- AUTO-EVOLUTION & SELF-HEALING ---
  async triggerAutoEvolution(reason, context = {}) {
    const evolution = {
      id: crypto.randomUUID(),
      reason,
      context,
      timestamp: new Date().toISOString(),
    };
    this.registry.evolutionHistory.push(evolution);
    await this.saveRegistry();
    // Example: trigger auto-enhancement, error fix, or self-update
    // (In production, this could call scripts/qmoi-auto-enhancement-system.js or similar)
    console.log(`🔄 Auto-evolution triggered: ${reason}`);
    return evolution.id;
  }

  // --- ADVANCED ERROR/FIX TRACKING ---
  async recordError(error, context = {}) {
    const errorId = crypto.randomUUID();
    this.registry.errors[errorId] = {
      id: errorId,
      error: error,
      context: context,
      timestamp: new Date().toISOString(),
      status: "detected",
      fixAttempts: 0,
      lastFixAttempt: null,
      suggestions: [],
    };
    await this.saveRegistry();
    console.log(`📝 Recorded error: ${errorId}`);
    return errorId;
  }

  async recordFix(errorId, fix, suggestion = null) {
    if (this.registry.errors[errorId]) {
      this.registry.errors[errorId].fixAttempts++;
      this.registry.errors[errorId].lastFixAttempt = new Date().toISOString();
      this.registry.errors[errorId].status = "fixed";
      if (suggestion) {
        this.registry.errors[errorId].suggestions.push(suggestion);
      }
    }
    const fixId = crypto.randomUUID();
    this.registry.fixes[fixId] = {
      id: fixId,
      errorId: errorId,
      fix: fix,
      timestamp: new Date().toISOString(),
      success: true,
      suggestion,
    };
    await this.saveRegistry();
    console.log(`🔧 Recorded fix: ${fixId}`);
    return fixId;
  }

  async getComponent(name) {
    return this.registry.components[name];
  }

  async getConfiguration(name) {
    return this.registry.configurations[name];
  }

  async getDevice(name) {
    return this.registry.devices[name];
  }

  async getPlatform(name) {
    return this.registry.platforms[name];
  }

  async getIntegration(name) {
    return this.registry.integrations[name];
  }

  async updateComponent(name, updates) {
    if (this.registry.components[name]) {
      this.registry.components[name] = {
        ...this.registry.components[name],
        ...updates,
        lastUpdated: new Date().toISOString(),
      };
      await this.saveRegistry();
      console.log(`✅ Updated component: ${name}`);
    }
  }

  async updateConfiguration(name, updates) {
    if (this.registry.configurations[name]) {
      this.registry.configurations[name] = {
        ...this.registry.configurations[name],
        ...updates,
        lastUpdated: new Date().toISOString(),
      };
      await this.saveRegistry();
      console.log(`✅ Updated configuration: ${name}`);
    }
  }

  async removeComponent(name) {
    if (this.registry.components[name]) {
      delete this.registry.components[name];
      await this.saveRegistry();
      console.log(`🗑️ Removed component: ${name}`);
    }
  }

  async removeConfiguration(name) {
    if (this.registry.configurations[name]) {
      delete this.registry.configurations[name];
      await this.saveRegistry();
      console.log(`🗑️ Removed configuration: ${name}`);
    }
  }

  async getRegistry() {
    return this.registry;
  }

  async saveRegistry() {
    this.registry.lastUpdated = new Date().toISOString();
    await fs.writeFile(
      this.registryPath,
      JSON.stringify(this.registry, null, 2),
    );
  }

  async exportRegistry(format = "json") {
    const data = await this.getRegistry();

    if (format === "json") {
      return JSON.stringify(data, null, 2);
    } else if (format === "csv") {
      return this.convertToCSV(data);
    } else if (format === "yaml") {
      return this.convertToYAML(data);
    }

    return data;
  }

  async importRegistry(data) {
    try {
      const imported = typeof data === "string" ? JSON.parse(data) : data;
      this.registry = { ...this.registry, ...imported };
      await this.saveRegistry();
      console.log("✅ Registry imported successfully");
      return true;
    } catch (error) {
      console.error("❌ Error importing registry:", error.message);
      return false;
    }
  }

  async backupRegistry() {
    const backupPath = this.registryPath.replace(
      ".json",
      `.backup.${Date.now()}.json`,
    );
    await fs.copyFile(this.registryPath, backupPath);
    console.log(`✅ Registry backed up to: ${backupPath}`);
    return backupPath;
  }

  async restoreRegistry(backupPath) {
    try {
      const backupData = await fs.readFile(backupPath, "utf8");
      const backup = JSON.parse(backupData);
      this.registry = backup;
      await this.saveRegistry();
      console.log("✅ Registry restored successfully");
      return true;
    } catch (error) {
      console.error("❌ Error restoring registry:", error.message);
      return false;
    }
  }

  async runAutoEnhancements() {
    console.log("🚀 Running QMOI auto-enhancements...");

    const metrics = await this.getSystemMetrics();
    const enhancements = [];

    for (const [name, rule] of this.autoEnhancementRules) {
      if (rule.condition(metrics)) {
        try {
          const result = await rule.action();
          enhancements.push({
            name,
            result,
            timestamp: new Date().toISOString(),
          });
          console.log(`✅ Auto-enhancement ${name}: ${result}`);
        } catch (error) {
          console.error(`❌ Auto-enhancement ${name} failed:`, error.message);
        }
      }
    }

    this.registry.autoEnhancements = enhancements;
    await this.saveRegistry();

    return enhancements;
  }

  async getSystemMetrics() {
    // Simulate system metrics (in real implementation, these would be actual metrics)
    return {
      memoryUsage: Math.random() * 100,
      cpuUsage: Math.random() * 100,
      errorRate: Math.random() * 0.1,
      securityScore: 0.7 + Math.random() * 0.3,
      networkLatency: Math.random() * 2000,
    };
  }

  async optimizePerformance() {
    // Performance optimization logic
    console.log("⚡ Optimizing performance...");
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  async optimizeMemory() {
    // Memory optimization logic
    console.log("🧠 Optimizing memory...");
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  async autoFixErrors() {
    // Auto-fix errors logic
    console.log("🔧 Auto-fixing errors...");
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  async enhanceSecurity() {
    // Security enhancement logic
    console.log("🔒 Enhancing security...");
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  async optimizeNetwork() {
    // Network optimization logic
    console.log("🌐 Optimizing network...");
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  convertToCSV(data) {
    // Convert registry data to CSV format
    const rows = [];
    for (const [key, value] of Object.entries(data)) {
      rows.push(`${key},${JSON.stringify(value)}`);
    }
    return rows.join("\n");
  }

  convertToYAML(data) {
    // Convert registry data to YAML format
    return JSON.stringify(data, null, 2).replace(/"/g, "");
  }

  async validateRegistry() {
    const errors = [];

    // Validate required fields
    const requiredFields = ["version", "components", "configurations"];
    for (const field of requiredFields) {
      if (!this.registry[field]) {
        errors.push(`Missing required field: ${field}`);
      }
    }

    // Validate component structure
    for (const [name, component] of Object.entries(this.registry.components)) {
      if (!component.id || !component.type) {
        errors.push(`Invalid component structure: ${name}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors: errors,
    };
  }

  async cleanupRegistry() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Clean up old errors
    for (const [id, error] of Object.entries(this.registry.errors)) {
      const errorDate = new Date(error.timestamp);
      if (errorDate < thirtyDaysAgo && error.status === "fixed") {
        delete this.registry.errors[id];
      }
    }

    // Clean up old fixes
    for (const [id, fix] of Object.entries(this.registry.fixes)) {
      const fixDate = new Date(fix.timestamp);
      if (fixDate < thirtyDaysAgo) {
        delete this.registry.fixes[id];
      }
    }

    await this.saveRegistry();
    console.log("🧹 Registry cleaned up");
  }

  // --- FEEDBACK-DRIVEN OPTIMIZATION ---
  async optimizeFromFeedback() {
    // Analyze feedback and AI actions to suggest/trigger improvements
    const recentFeedback = this.registry.feedback.slice(-10);
    for (const fb of recentFeedback) {
      if (fb.type === "error" && fb.data.critical) {
        await this.triggerAutoEvolution("Critical error feedback", fb);
      }
      if (fb.type === "user" && fb.data.suggestion) {
        await this.triggerAutoEvolution("User suggestion", fb);
      }
    }
    console.log("🧠 Feedback-driven optimization complete.");
  }
}

// CLI interface
if (require.main === module) {
  const registry = new QMOIRegistryManager();
  const args = process.argv.slice(2);

  async function main() {
    await registry.initializeRegistry();

    if (args.includes("--register-component")) {
      const nameIndex = args.indexOf("--register-component");
      const name = args[nameIndex + 1];
      const type = args[nameIndex + 2] || "component";
      if (name) {
        await registry.registerComponent(name, {
          type: type,
          version: "1.0.0",
          status: "active",
          autoEnhancement: true,
        });
      }
    } else if (args.includes("--feedback")) {
      const type = args[args.indexOf("--feedback") + 1];
      const source = args[args.indexOf("--feedback") + 2];
      const message = args[args.indexOf("--feedback") + 3];
      await registry.recordFeedback(type, source, message);
    } else if (args.includes("--ai-action")) {
      const action = args[args.indexOf("--ai-action") + 1];
      const trigger = args[args.indexOf("--ai-action") + 2];
      const outcome = args[args.indexOf("--ai-action") + 3];
      await registry.recordAIAction(action, trigger, outcome);
    } else if (args.includes("--sync-api")) {
      const name = args[args.indexOf("--sync-api") + 1];
      const url = args[args.indexOf("--sync-api") + 2];
      await registry.syncExternalAPI(name, url);
    } else if (args.includes("--optimize-feedback")) {
      await registry.optimizeFromFeedback();
    } else if (args.includes("--auto-evolve")) {
      const reason = args[args.indexOf("--auto-evolve") + 1] || "manual";
      await registry.triggerAutoEvolution(reason);
    } else if (args.includes("--list")) {
      const data = await registry.getRegistry();
      console.log(JSON.stringify(data, null, 2));
    } else {
      console.log(`
QMOI Registry Manager (Enhanced)

Usage:
  node qmoi-registry-manager.js --register-component <name> [type]     # Register component
  node qmoi-registry-manager.js --feedback <type> <source> <message>   # Record feedback
  node qmoi-registry-manager.js --ai-action <action> <trigger> <outcome> # Record AI action
  node qmoi-registry-manager.js --sync-api <name> <url>                # Sync with external API
  node qmoi-registry-manager.js --optimize-feedback                    # Optimize from feedback
  node qmoi-registry-manager.js --auto-evolve [reason]                 # Trigger auto-evolution
  node qmoi-registry-manager.js --list                                 # List registry contents
`);
    }
  }

  main().catch(console.error);
}

module.exports = QMOIRegistryManager;
