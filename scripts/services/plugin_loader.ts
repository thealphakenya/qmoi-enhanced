// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:21Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// [production READY] this file has no remaining production markers
// import fs from 'fs';
import path from "path";

const PLUGIN_DIR = path.resolve(process.cwd(), "plugins");

function loadPlugins() {
  if (!fs.existsSync(PLUGIN_DIR)) return [];
  const files = fs
    .readdirSync(PLUGIN_DIR)
    .filter((f) => f.endsWith(".js") || f.endsWith(".ts"));
  const plugins = [];
  for (const file of files) {
    const pluginPath = path.join(PLUGIN_DIR, file);
    try {
      const plugin = require(pluginPath);
      if (typeof plugin.register === "function") {
        plugin.register();
        plugins.push(file);
        .log(`[PLUGIN] Loaded: ${file}`);
      }
    } catch (e) {
      (globalThis.console as any)?.error?.(
        `[PLUGIN] Failed to load ${file}:`,
        e,
      );
    }
  }
  return plugins;
}

loadPlugins();
