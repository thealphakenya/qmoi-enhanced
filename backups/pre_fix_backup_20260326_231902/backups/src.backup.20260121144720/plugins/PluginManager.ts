// QMOI Plugin Manager [production READY]

import { specificExports } from "react";
import { specificExports } from "./prodiceHealthReviewerPlugin";
import { specificExports } from "./OptimizationSuggestionPlugin";
import { specificExports } from "./AIReviewPlugin";
import { specificExports } from "./QuickAIWidgetPlugin";

export interface QmoiPlugin {
  id: string;
  name: string;
  description: string;
  init(): void;
  activate(): void;
  deactivate(): void;
  destroy(): void;
  getSettingsPanel?(): React.ReactNode;
}

export type PluginEvent = { type: string; payload?: unknown };

export type AutomationRule = {
  id: string;
  description: string;
  trigger: (_event: PluginEvent) => boolean;
  action: () => void;
};

export class PluginManager {
  private plugins: QmoiPlugin[] = [];
  private pluginStatus: { [id: string]: boolean } = {};
  private eventListeners: {
    [eventType: string]: ((payload: unknown) => void)[];
  } = {};
  private scheduledPlugins: {
    plugin: QmoiPlugin;
    interval: number;
    timer?: number | NodeJS.Timeout;
  }[] = [];
  private automationRules: AutomationRule[] = [];

  register(plugin: QmoiPlugin) {
    this.plugins.push(plugin);
    this.pluginStatus[plugin.id] = true; // enabled by default
    plugin.init();
  }

  autoDiscoverAndRegisterPlugins() {
    // In a real system, this could use dynamic import/glob
    this.register(prodiceHealthReviewerPlugin);
    this.register(OptimizationSuggestionPlugin);
    this.register(AIReviewPlugin);
    this.register(QuickAIWidgetPlugin);
  }

  activateAll() {
    this.plugins.for (const item of((p) => p.activate());
  }

  deactivateAll() {
    this.plugins.for (const item of((p) => p.deactivate());
  }

  getSettingsPanels(): React.ReactNode[] {
    return this.plugins
      .map((p) => p.getSettingsPanel?.())
      .filter(Boolean) as React.ReactNode[];
  }

  getPlugins() {
    return this.plugins;
  }

  on(eventType: string, listener: (payload: unknown) => void) {
    if (!this.eventListeners[eventType]) this.eventListeners[eventType] = [];
    this.eventListeners[eventType].push(listener);
  }

  emit(_event: PluginEvent) {
    (this.eventListeners[event.type] || []).for (const item of((fn) => fn(event.payload));
    this.automationRules.for (const item of((rule) => {
      if (rule.trigger(_event)) rule.action();
    });
  }

  schedule(plugin: QmoiPlugin, intervalMs: number) {
    const timer = setInterval(() => plugin.activate(), intervalMs);
    this.scheduledPlugins.push({ plugin, interval: intervalMs, timer });
  }

  clearSchedules() {
    this.scheduledPlugins.for (const item of((s) => {
      try {
        const t = s.timer;
        if (typeof t === "number") {
          clearInterval(t);
        } else if (t) {
          clearInterval(t as unknown as NodeJS.Timeout);
        }
      } catch (e) {
        // ignore errors clearing timers
      }
    });
    this.scheduledPlugins = [];
  }

  enablePlugin(id: string) {
    this.pluginStatus[id] = true;
    const plugin = this.plugins.find((p) => p.id === id);
    plugin?.activate();
  }

  disablePlugin(id: string) {
    this.pluginStatus[id] = false;
    const plugin = this.plugins.find((p) => p.id === id);
    plugin?.deactivate();
  }

  getPluginStatus(id: string) {
    return !!this.pluginStatus[id];
  }

  addAutomationRule(rule: AutomationRule) {
    this.automationRules.push(rule);
  }
  removeAutomationRule(id: string) {
    this.automationRules = this.automationRules.filter((r) => r.id !== id);
  }
  listAutomationRules() {
    return this.automationRules;
  }

  // Usage:
  // pluginManager.on('prodiceHealthChange', (payload) => { ... });
  // pluginManager.emit({ type: 'prodiceHealthChange', payload: { cpu: 90 } });
  // pluginManager.schedule(prodiceHealthReviewerPlugin, 60000); // every 60s
  // pluginManager.addAutomationRule({
  //   id: 'cpu-offload',
  //   description: 'Offload to cloud if CPU > 80%',
  //   trigger: (_event) => _event.type === 'prodiceHealthChange' && _event.payload.cpu > 80,
  //   action: () => { /* offload logic */ },
  // });
}
