// import fs from 'fs';
import path from 'path';

const PLUGIN_DIR = path.resolve(process.cwd(), 'plugins');

function loadPlugins() {
  if (!fs.existsSync(PLUGIN_DIR)) return [];
  const files = fs.readdirSync(PLUGIN_DIR).filter(f => f.endsWith('.js') || f.endsWith('.ts'));
  const plugins = [];
  for (const file of files) {
    const pluginPath = path.join(PLUGIN_DIR, file);
    try {
      const plugin = require(pluginPath);
      if (typeof plugin.register === 'function') {
        plugin.register();
        plugins.push(file);
        console.log(`[PLUGIN] Loaded: ${file}`);
      }
    } catch (e) {
      console.error(`[PLUGIN] Failed to load ${file}:`, e);
    }
  }
  return plugins;
}

loadPlugins(); 