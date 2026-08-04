// QMOI Plugin Manager Stub

import React from "react";
import { DeviceHealthReviewerPlugin } from "./DeviceHealthReviewerPlugin";
import { OptimizationSuggestionPlugin } from "./OptimizationSuggestionPlugin";
import { AIReviewPlugin } from "./AIReviewPlugin";
import { QuickAIWidgetPlugin } from "./QuickAIWidgetPlugin";

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
    this.register(DeviceHealthReviewerPlugin);
    this.register(OptimizationSuggestionPlugin);
    this.register(AIReviewPlugin);
    this.register(QuickAIWidgetPlugin);
  }

  activateAll() {
    this.plugins.forEach((p) => p.activate());
  }

  deactivateAll() {
    this.plugins.forEach((p) => p.deactivate());
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
    (this.eventListeners[event.type] || []).forEach((fn) => fn(event.payload));
    this.automationRules.forEach((rule) => {
      if (rule.trigger(_event)) rule.action();
    });
  }

  schedule(plugin: QmoiPlugin, intervalMs: number) {
    const timer = setInterval(() => plugin.activate(), intervalMs);
    this.scheduledPlugins.push({ plugin, interval: intervalMs, timer });
  }

  clearSchedules() {
    this.scheduledPlugins.forEach((s) => {
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
  // pluginManager.on('deviceHealthChange', (payload) => { ... });
  // pluginManager.emit({ type: 'deviceHealthChange', payload: { cpu: 90 } });
  // pluginManager.schedule(DeviceHealthReviewerPlugin, 60000); // every 60s
  // pluginManager.addAutomationRule({
  //   id: 'cpu-offload',
  //   description: 'Offload to cloud if CPU > 80%',
  //   trigger: (_event) => _event.type === 'deviceHealthChange' && _event.payload.cpu > 80,
  //   action: () => { /* offload logic */ },
  // });
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/plugins/PluginManager.ts -->
// QMOI Plugin Manager Stub

import React from "react";
import { DeviceHealthReviewerPlugin } from "./DeviceHealthReviewerPlugin";
import { OptimizationSuggestionPlugin } from "./OptimizationSuggestionPlugin";
import { AIReviewPlugin } from "./AIReviewPlugin";
import { QuickAIWidgetPlugin } from "./QuickAIWidgetPlugin";

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
    this.register(DeviceHealthReviewerPlugin);
    this.register(OptimizationSuggestionPlugin);
    this.register(AIReviewPlugin);
    this.register(QuickAIWidgetPlugin);
  }

  activateAll() {
    this.plugins.forEach((p) => p.activate());
  }

  deactivateAll() {
    this.plugins.forEach((p) => p.deactivate());
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
    (this.eventListeners[event.type] || []).forEach((fn) => fn(event.payload));
    this.automationRules.forEach((rule) => {
      if (rule.trigger(_event)) rule.action();
    });
  }

  schedule(plugin: QmoiPlugin, intervalMs: number) {
    const timer = setInterval(() => plugin.activate(), intervalMs);
    this.scheduledPlugins.push({ plugin, interval: intervalMs, timer });
  }

  clearSchedules() {
    this.scheduledPlugins.forEach((s) => {
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
  // pluginManager.on('deviceHealthChange', (payload) => { ... });
  // pluginManager.emit({ type: 'deviceHealthChange', payload: { cpu: 90 } });
  // pluginManager.schedule(DeviceHealthReviewerPlugin, 60000); // every 60s
  // pluginManager.addAutomationRule({
  //   id: 'cpu-offload',
  //   description: 'Offload to cloud if CPU > 80%',
  //   trigger: (_event) => _event.type === 'deviceHealthChange' && _event.payload.cpu > 80,
  //   action: () => { /* offload logic */ },
  // });
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/plugins/PluginManager.ts -->
// QMOI Plugin Manager Stub

import React from "react";
import { DeviceHealthReviewerPlugin } from "./DeviceHealthReviewerPlugin";
import { OptimizationSuggestionPlugin } from "./OptimizationSuggestionPlugin";
import { AIReviewPlugin } from "./AIReviewPlugin";
import { QuickAIWidgetPlugin } from "./QuickAIWidgetPlugin";

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
    this.register(DeviceHealthReviewerPlugin);
    this.register(OptimizationSuggestionPlugin);
    this.register(AIReviewPlugin);
    this.register(QuickAIWidgetPlugin);
  }

  activateAll() {
    this.plugins.forEach((p) => p.activate());
  }

  deactivateAll() {
    this.plugins.forEach((p) => p.deactivate());
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
    (this.eventListeners[event.type] || []).forEach((fn) => fn(event.payload));
    this.automationRules.forEach((rule) => {
      if (rule.trigger(_event)) rule.action();
    });
  }

  schedule(plugin: QmoiPlugin, intervalMs: number) {
    const timer = setInterval(() => plugin.activate(), intervalMs);
    this.scheduledPlugins.push({ plugin, interval: intervalMs, timer });
  }

  clearSchedules() {
    this.scheduledPlugins.forEach((s) => {
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
  // pluginManager.on('deviceHealthChange', (payload) => { ... });
  // pluginManager.emit({ type: 'deviceHealthChange', payload: { cpu: 90 } });
  // pluginManager.schedule(DeviceHealthReviewerPlugin, 60000); // every 60s
  // pluginManager.addAutomationRule({
  //   id: 'cpu-offload',
  //   description: 'Offload to cloud if CPU > 80%',
  //   trigger: (_event) => _event.type === 'deviceHealthChange' && _event.payload.cpu > 80,
  //   action: () => { /* offload logic */ },
  // });
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/plugins/PluginManager.ts -->
// QMOI Plugin Manager Stub

import React from "react";
import { DeviceHealthReviewerPlugin } from "./DeviceHealthReviewerPlugin";
import { OptimizationSuggestionPlugin } from "./OptimizationSuggestionPlugin";
import { AIReviewPlugin } from "./AIReviewPlugin";
import { QuickAIWidgetPlugin } from "./QuickAIWidgetPlugin";

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
    this.register(DeviceHealthReviewerPlugin);
    this.register(OptimizationSuggestionPlugin);
    this.register(AIReviewPlugin);
    this.register(QuickAIWidgetPlugin);
  }

  activateAll() {
    this.plugins.forEach((p) => p.activate());
  }

  deactivateAll() {
    this.plugins.forEach((p) => p.deactivate());
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
    (this.eventListeners[event.type] || []).forEach((fn) => fn(event.payload));
    this.automationRules.forEach((rule) => {
      if (rule.trigger(_event)) rule.action();
    });
  }

  schedule(plugin: QmoiPlugin, intervalMs: number) {
    const timer = setInterval(() => plugin.activate(), intervalMs);
    this.scheduledPlugins.push({ plugin, interval: intervalMs, timer });
  }

  clearSchedules() {
    this.scheduledPlugins.forEach((s) => {
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
  // pluginManager.on('deviceHealthChange', (payload) => { ... });
  // pluginManager.emit({ type: 'deviceHealthChange', payload: { cpu: 90 } });
  // pluginManager.schedule(DeviceHealthReviewerPlugin, 60000); // every 60s
  // pluginManager.addAutomationRule({
  //   id: 'cpu-offload',
  //   description: 'Offload to cloud if CPU > 80%',
  //   trigger: (_event) => _event.type === 'deviceHealthChange' && _event.payload.cpu > 80,
  //   action: () => { /* offload logic */ },
  // });
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/plugins/PluginManager.ts -->
// QMOI Plugin Manager Stub

import React from "react";
import { DeviceHealthReviewerPlugin } from "./DeviceHealthReviewerPlugin";
import { OptimizationSuggestionPlugin } from "./OptimizationSuggestionPlugin";
import { AIReviewPlugin } from "./AIReviewPlugin";
import { QuickAIWidgetPlugin } from "./QuickAIWidgetPlugin";

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
    this.register(DeviceHealthReviewerPlugin);
    this.register(OptimizationSuggestionPlugin);
    this.register(AIReviewPlugin);
    this.register(QuickAIWidgetPlugin);
  }

  activateAll() {
    this.plugins.forEach((p) => p.activate());
  }

  deactivateAll() {
    this.plugins.forEach((p) => p.deactivate());
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
    (this.eventListeners[event.type] || []).forEach((fn) => fn(event.payload));
    this.automationRules.forEach((rule) => {
      if (rule.trigger(_event)) rule.action();
    });
  }

  schedule(plugin: QmoiPlugin, intervalMs: number) {
    const timer = setInterval(() => plugin.activate(), intervalMs);
    this.scheduledPlugins.push({ plugin, interval: intervalMs, timer });
  }

  clearSchedules() {
    this.scheduledPlugins.forEach((s) => {
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
  // pluginManager.on('deviceHealthChange', (payload) => { ... });
  // pluginManager.emit({ type: 'deviceHealthChange', payload: { cpu: 90 } });
  // pluginManager.schedule(DeviceHealthReviewerPlugin, 60000); // every 60s
  // pluginManager.addAutomationRule({
  //   id: 'cpu-offload',
  //   description: 'Offload to cloud if CPU > 80%',
  //   trigger: (_event) => _event.type === 'deviceHealthChange' && _event.payload.cpu > 80,
  //   action: () => { /* offload logic */ },
  // });
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/plugins/PluginManager.ts -->
// QMOI Plugin Manager Stub

import React from "react";
import { DeviceHealthReviewerPlugin } from "./DeviceHealthReviewerPlugin";
import { OptimizationSuggestionPlugin } from "./OptimizationSuggestionPlugin";
import { AIReviewPlugin } from "./AIReviewPlugin";
import { QuickAIWidgetPlugin } from "./QuickAIWidgetPlugin";

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
    this.register(DeviceHealthReviewerPlugin);
    this.register(OptimizationSuggestionPlugin);
    this.register(AIReviewPlugin);
    this.register(QuickAIWidgetPlugin);
  }

  activateAll() {
    this.plugins.forEach((p) => p.activate());
  }

  deactivateAll() {
    this.plugins.forEach((p) => p.deactivate());
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
    (this.eventListeners[event.type] || []).forEach((fn) => fn(event.payload));
    this.automationRules.forEach((rule) => {
      if (rule.trigger(_event)) rule.action();
    });
  }

  schedule(plugin: QmoiPlugin, intervalMs: number) {
    const timer = setInterval(() => plugin.activate(), intervalMs);
    this.scheduledPlugins.push({ plugin, interval: intervalMs, timer });
  }

  clearSchedules() {
    this.scheduledPlugins.forEach((s) => {
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
  // pluginManager.on('deviceHealthChange', (payload) => { ... });
  // pluginManager.emit({ type: 'deviceHealthChange', payload: { cpu: 90 } });
  // pluginManager.schedule(DeviceHealthReviewerPlugin, 60000); // every 60s
  // pluginManager.addAutomationRule({
  //   id: 'cpu-offload',
  //   description: 'Offload to cloud if CPU > 80%',
  //   trigger: (_event) => _event.type === 'deviceHealthChange' && _event.payload.cpu > 80,
  //   action: () => { /* offload logic */ },
  // });
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/plugins/PluginManager.ts -->
// QMOI Plugin Manager Stub

import React from "react";
import { DeviceHealthReviewerPlugin } from "./DeviceHealthReviewerPlugin";
import { OptimizationSuggestionPlugin } from "./OptimizationSuggestionPlugin";
import { AIReviewPlugin } from "./AIReviewPlugin";
import { QuickAIWidgetPlugin } from "./QuickAIWidgetPlugin";

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
    this.register(DeviceHealthReviewerPlugin);
    this.register(OptimizationSuggestionPlugin);
    this.register(AIReviewPlugin);
    this.register(QuickAIWidgetPlugin);
  }

  activateAll() {
    this.plugins.forEach((p) => p.activate());
  }

  deactivateAll() {
    this.plugins.forEach((p) => p.deactivate());
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
    (this.eventListeners[event.type] || []).forEach((fn) => fn(event.payload));
    this.automationRules.forEach((rule) => {
      if (rule.trigger(_event)) rule.action();
    });
  }

  schedule(plugin: QmoiPlugin, intervalMs: number) {
    const timer = setInterval(() => plugin.activate(), intervalMs);
    this.scheduledPlugins.push({ plugin, interval: intervalMs, timer });
  }

  clearSchedules() {
    this.scheduledPlugins.forEach((s) => {
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
  // pluginManager.on('deviceHealthChange', (payload) => { ... });
  // pluginManager.emit({ type: 'deviceHealthChange', payload: { cpu: 90 } });
  // pluginManager.schedule(DeviceHealthReviewerPlugin, 60000); // every 60s
  // pluginManager.addAutomationRule({
  //   id: 'cpu-offload',
  //   description: 'Offload to cloud if CPU > 80%',
  //   trigger: (_event) => _event.type === 'deviceHealthChange' && _event.payload.cpu > 80,
  //   action: () => { /* offload logic */ },
  // });
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/plugins/PluginManager.ts -->
// QMOI Plugin Manager Stub

import React from "react";
import { DeviceHealthReviewerPlugin } from "./DeviceHealthReviewerPlugin";
import { OptimizationSuggestionPlugin } from "./OptimizationSuggestionPlugin";
import { AIReviewPlugin } from "./AIReviewPlugin";
import { QuickAIWidgetPlugin } from "./QuickAIWidgetPlugin";

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
    this.register(DeviceHealthReviewerPlugin);
    this.register(OptimizationSuggestionPlugin);
    this.register(AIReviewPlugin);
    this.register(QuickAIWidgetPlugin);
  }

  activateAll() {
    this.plugins.forEach((p) => p.activate());
  }

  deactivateAll() {
    this.plugins.forEach((p) => p.deactivate());
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
    (this.eventListeners[event.type] || []).forEach((fn) => fn(event.payload));
    this.automationRules.forEach((rule) => {
      if (rule.trigger(_event)) rule.action();
    });
  }

  schedule(plugin: QmoiPlugin, intervalMs: number) {
    const timer = setInterval(() => plugin.activate(), intervalMs);
    this.scheduledPlugins.push({ plugin, interval: intervalMs, timer });
  }

  clearSchedules() {
    this.scheduledPlugins.forEach((s) => {
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
  // pluginManager.on('deviceHealthChange', (payload) => { ... });
  // pluginManager.emit({ type: 'deviceHealthChange', payload: { cpu: 90 } });
  // pluginManager.schedule(DeviceHealthReviewerPlugin, 60000); // every 60s
  // pluginManager.addAutomationRule({
  //   id: 'cpu-offload',
  //   description: 'Offload to cloud if CPU > 80%',
  //   trigger: (_event) => _event.type === 'deviceHealthChange' && _event.payload.cpu > 80,
  //   action: () => { /* offload logic */ },
  // });
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/plugins/PluginManager.ts -->
// QMOI Plugin Manager Stub

import React from "react";
import { DeviceHealthReviewerPlugin } from "./DeviceHealthReviewerPlugin";
import { OptimizationSuggestionPlugin } from "./OptimizationSuggestionPlugin";
import { AIReviewPlugin } from "./AIReviewPlugin";
import { QuickAIWidgetPlugin } from "./QuickAIWidgetPlugin";

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
    this.register(DeviceHealthReviewerPlugin);
    this.register(OptimizationSuggestionPlugin);
    this.register(AIReviewPlugin);
    this.register(QuickAIWidgetPlugin);
  }

  activateAll() {
    this.plugins.forEach((p) => p.activate());
  }

  deactivateAll() {
    this.plugins.forEach((p) => p.deactivate());
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
    (this.eventListeners[event.type] || []).forEach((fn) => fn(event.payload));
    this.automationRules.forEach((rule) => {
      if (rule.trigger(_event)) rule.action();
    });
  }

  schedule(plugin: QmoiPlugin, intervalMs: number) {
    const timer = setInterval(() => plugin.activate(), intervalMs);
    this.scheduledPlugins.push({ plugin, interval: intervalMs, timer });
  }

  clearSchedules() {
    this.scheduledPlugins.forEach((s) => {
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
  // pluginManager.on('deviceHealthChange', (payload) => { ... });
  // pluginManager.emit({ type: 'deviceHealthChange', payload: { cpu: 90 } });
  // pluginManager.schedule(DeviceHealthReviewerPlugin, 60000); // every 60s
  // pluginManager.addAutomationRule({
  //   id: 'cpu-offload',
  //   description: 'Offload to cloud if CPU > 80%',
  //   trigger: (_event) => _event.type === 'deviceHealthChange' && _event.payload.cpu > 80,
  //   action: () => { /* offload logic */ },
  // });
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/plugins/PluginManager.ts -->
// QMOI Plugin Manager Stub

import React from "react";
import { DeviceHealthReviewerPlugin } from "./DeviceHealthReviewerPlugin";
import { OptimizationSuggestionPlugin } from "./OptimizationSuggestionPlugin";
import { AIReviewPlugin } from "./AIReviewPlugin";
import { QuickAIWidgetPlugin } from "./QuickAIWidgetPlugin";

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
    this.register(DeviceHealthReviewerPlugin);
    this.register(OptimizationSuggestionPlugin);
    this.register(AIReviewPlugin);
    this.register(QuickAIWidgetPlugin);
  }

  activateAll() {
    this.plugins.forEach((p) => p.activate());
  }

  deactivateAll() {
    this.plugins.forEach((p) => p.deactivate());
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
    (this.eventListeners[event.type] || []).forEach((fn) => fn(event.payload));
    this.automationRules.forEach((rule) => {
      if (rule.trigger(_event)) rule.action();
    });
  }

  schedule(plugin: QmoiPlugin, intervalMs: number) {
    const timer = setInterval(() => plugin.activate(), intervalMs);
    this.scheduledPlugins.push({ plugin, interval: intervalMs, timer });
  }

  clearSchedules() {
    this.scheduledPlugins.forEach((s) => {
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
  // pluginManager.on('deviceHealthChange', (payload) => { ... });
  // pluginManager.emit({ type: 'deviceHealthChange', payload: { cpu: 90 } });
  // pluginManager.schedule(DeviceHealthReviewerPlugin, 60000); // every 60s
  // pluginManager.addAutomationRule({
  //   id: 'cpu-offload',
  //   description: 'Offload to cloud if CPU > 80%',
  //   trigger: (_event) => _event.type === 'deviceHealthChange' && _event.payload.cpu > 80,
  //   action: () => { /* offload logic */ },
  // });
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/plugins/PluginManager.ts -->
// QMOI Plugin Manager Stub

import React from "react";
import { DeviceHealthReviewerPlugin } from "./DeviceHealthReviewerPlugin";
import { OptimizationSuggestionPlugin } from "./OptimizationSuggestionPlugin";
import { AIReviewPlugin } from "./AIReviewPlugin";
import { QuickAIWidgetPlugin } from "./QuickAIWidgetPlugin";

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
    this.register(DeviceHealthReviewerPlugin);
    this.register(OptimizationSuggestionPlugin);
    this.register(AIReviewPlugin);
    this.register(QuickAIWidgetPlugin);
  }

  activateAll() {
    this.plugins.forEach((p) => p.activate());
  }

  deactivateAll() {
    this.plugins.forEach((p) => p.deactivate());
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
    (this.eventListeners[event.type] || []).forEach((fn) => fn(event.payload));
    this.automationRules.forEach((rule) => {
      if (rule.trigger(_event)) rule.action();
    });
  }

  schedule(plugin: QmoiPlugin, intervalMs: number) {
    const timer = setInterval(() => plugin.activate(), intervalMs);
    this.scheduledPlugins.push({ plugin, interval: intervalMs, timer });
  }

  clearSchedules() {
    this.scheduledPlugins.forEach((s) => {
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
  // pluginManager.on('deviceHealthChange', (payload) => { ... });
  // pluginManager.emit({ type: 'deviceHealthChange', payload: { cpu: 90 } });
  // pluginManager.schedule(DeviceHealthReviewerPlugin, 60000); // every 60s
  // pluginManager.addAutomationRule({
  //   id: 'cpu-offload',
  //   description: 'Offload to cloud if CPU > 80%',
  //   trigger: (_event) => _event.type === 'deviceHealthChange' && _event.payload.cpu > 80,
  //   action: () => { /* offload logic */ },
  // });
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/plugins/PluginManager.ts -->
// QMOI Plugin Manager Stub

import React from "react";
import { DeviceHealthReviewerPlugin } from "./DeviceHealthReviewerPlugin";
import { OptimizationSuggestionPlugin } from "./OptimizationSuggestionPlugin";
import { AIReviewPlugin } from "./AIReviewPlugin";
import { QuickAIWidgetPlugin } from "./QuickAIWidgetPlugin";

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
    this.register(DeviceHealthReviewerPlugin);
    this.register(OptimizationSuggestionPlugin);
    this.register(AIReviewPlugin);
    this.register(QuickAIWidgetPlugin);
  }

  activateAll() {
    this.plugins.forEach((p) => p.activate());
  }

  deactivateAll() {
    this.plugins.forEach((p) => p.deactivate());
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
    (this.eventListeners[event.type] || []).forEach((fn) => fn(event.payload));
    this.automationRules.forEach((rule) => {
      if (rule.trigger(_event)) rule.action();
    });
  }

  schedule(plugin: QmoiPlugin, intervalMs: number) {
    const timer = setInterval(() => plugin.activate(), intervalMs);
    this.scheduledPlugins.push({ plugin, interval: intervalMs, timer });
  }

  clearSchedules() {
    this.scheduledPlugins.forEach((s) => {
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
  // pluginManager.on('deviceHealthChange', (payload) => { ... });
  // pluginManager.emit({ type: 'deviceHealthChange', payload: { cpu: 90 } });
  // pluginManager.schedule(DeviceHealthReviewerPlugin, 60000); // every 60s
  // pluginManager.addAutomationRule({
  //   id: 'cpu-offload',
  //   description: 'Offload to cloud if CPU > 80%',
  //   trigger: (_event) => _event.type === 'deviceHealthChange' && _event.payload.cpu > 80,
  //   action: () => { /* offload logic */ },
  // });
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/plugins/PluginManager.ts -->
// QMOI Plugin Manager Stub

import React from "react";
import { DeviceHealthReviewerPlugin } from "./DeviceHealthReviewerPlugin";
import { OptimizationSuggestionPlugin } from "./OptimizationSuggestionPlugin";
import { AIReviewPlugin } from "./AIReviewPlugin";
import { QuickAIWidgetPlugin } from "./QuickAIWidgetPlugin";

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
    this.register(DeviceHealthReviewerPlugin);
    this.register(OptimizationSuggestionPlugin);
    this.register(AIReviewPlugin);
    this.register(QuickAIWidgetPlugin);
  }

  activateAll() {
    this.plugins.forEach((p) => p.activate());
  }

  deactivateAll() {
    this.plugins.forEach((p) => p.deactivate());
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
    (this.eventListeners[event.type] || []).forEach((fn) => fn(event.payload));
    this.automationRules.forEach((rule) => {
      if (rule.trigger(_event)) rule.action();
    });
  }

  schedule(plugin: QmoiPlugin, intervalMs: number) {
    const timer = setInterval(() => plugin.activate(), intervalMs);
    this.scheduledPlugins.push({ plugin, interval: intervalMs, timer });
  }

  clearSchedules() {
    this.scheduledPlugins.forEach((s) => {
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
  // pluginManager.on('deviceHealthChange', (payload) => { ... });
  // pluginManager.emit({ type: 'deviceHealthChange', payload: { cpu: 90 } });
  // pluginManager.schedule(DeviceHealthReviewerPlugin, 60000); // every 60s
  // pluginManager.addAutomationRule({
  //   id: 'cpu-offload',
  //   description: 'Offload to cloud if CPU > 80%',
  //   trigger: (_event) => _event.type === 'deviceHealthChange' && _event.payload.cpu > 80,
  //   action: () => { /* offload logic */ },
  // });
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/plugins/PluginManager.ts -->
// QMOI Plugin Manager Stub

import React from "react";
import { DeviceHealthReviewerPlugin } from "./DeviceHealthReviewerPlugin";
import { OptimizationSuggestionPlugin } from "./OptimizationSuggestionPlugin";
import { AIReviewPlugin } from "./AIReviewPlugin";
import { QuickAIWidgetPlugin } from "./QuickAIWidgetPlugin";

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
    this.register(DeviceHealthReviewerPlugin);
    this.register(OptimizationSuggestionPlugin);
    this.register(AIReviewPlugin);
    this.register(QuickAIWidgetPlugin);
  }

  activateAll() {
    this.plugins.forEach((p) => p.activate());
  }

  deactivateAll() {
    this.plugins.forEach((p) => p.deactivate());
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
    (this.eventListeners[event.type] || []).forEach((fn) => fn(event.payload));
    this.automationRules.forEach((rule) => {
      if (rule.trigger(_event)) rule.action();
    });
  }

  schedule(plugin: QmoiPlugin, intervalMs: number) {
    const timer = setInterval(() => plugin.activate(), intervalMs);
    this.scheduledPlugins.push({ plugin, interval: intervalMs, timer });
  }

  clearSchedules() {
    this.scheduledPlugins.forEach((s) => {
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
  // pluginManager.on('deviceHealthChange', (payload) => { ... });
  // pluginManager.emit({ type: 'deviceHealthChange', payload: { cpu: 90 } });
  // pluginManager.schedule(DeviceHealthReviewerPlugin, 60000); // every 60s
  // pluginManager.addAutomationRule({
  //   id: 'cpu-offload',
  //   description: 'Offload to cloud if CPU > 80%',
  //   trigger: (_event) => _event.type === 'deviceHealthChange' && _event.payload.cpu > 80,
  //   action: () => { /* offload logic */ },
  // });
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/plugins/PluginManager.ts -->
// QMOI Plugin Manager Stub

import React from "react";
import { DeviceHealthReviewerPlugin } from "./DeviceHealthReviewerPlugin";
import { OptimizationSuggestionPlugin } from "./OptimizationSuggestionPlugin";
import { AIReviewPlugin } from "./AIReviewPlugin";
import { QuickAIWidgetPlugin } from "./QuickAIWidgetPlugin";

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
    this.register(DeviceHealthReviewerPlugin);
    this.register(OptimizationSuggestionPlugin);
    this.register(AIReviewPlugin);
    this.register(QuickAIWidgetPlugin);
  }

  activateAll() {
    this.plugins.forEach((p) => p.activate());
  }

  deactivateAll() {
    this.plugins.forEach((p) => p.deactivate());
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
    (this.eventListeners[event.type] || []).forEach((fn) => fn(event.payload));
    this.automationRules.forEach((rule) => {
      if (rule.trigger(_event)) rule.action();
    });
  }

  schedule(plugin: QmoiPlugin, intervalMs: number) {
    const timer = setInterval(() => plugin.activate(), intervalMs);
    this.scheduledPlugins.push({ plugin, interval: intervalMs, timer });
  }

  clearSchedules() {
    this.scheduledPlugins.forEach((s) => {
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
  // pluginManager.on('deviceHealthChange', (payload) => { ... });
  // pluginManager.emit({ type: 'deviceHealthChange', payload: { cpu: 90 } });
  // pluginManager.schedule(DeviceHealthReviewerPlugin, 60000); // every 60s
  // pluginManager.addAutomationRule({
  //   id: 'cpu-offload',
  //   description: 'Offload to cloud if CPU > 80%',
  //   trigger: (_event) => _event.type === 'deviceHealthChange' && _event.payload.cpu > 80,
  //   action: () => { /* offload logic */ },
  // });
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/plugins/PluginManager.ts -->
// QMOI Plugin Manager Stub

import React from "react";
import { DeviceHealthReviewerPlugin } from "./DeviceHealthReviewerPlugin";
import { OptimizationSuggestionPlugin } from "./OptimizationSuggestionPlugin";
import { AIReviewPlugin } from "./AIReviewPlugin";
import { QuickAIWidgetPlugin } from "./QuickAIWidgetPlugin";

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
    this.register(DeviceHealthReviewerPlugin);
    this.register(OptimizationSuggestionPlugin);
    this.register(AIReviewPlugin);
    this.register(QuickAIWidgetPlugin);
  }

  activateAll() {
    this.plugins.forEach((p) => p.activate());
  }

  deactivateAll() {
    this.plugins.forEach((p) => p.deactivate());
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
    (this.eventListeners[event.type] || []).forEach((fn) => fn(event.payload));
    this.automationRules.forEach((rule) => {
      if (rule.trigger(_event)) rule.action();
    });
  }

  schedule(plugin: QmoiPlugin, intervalMs: number) {
    const timer = setInterval(() => plugin.activate(), intervalMs);
    this.scheduledPlugins.push({ plugin, interval: intervalMs, timer });
  }

  clearSchedules() {
    this.scheduledPlugins.forEach((s) => {
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
  // pluginManager.on('deviceHealthChange', (payload) => { ... });
  // pluginManager.emit({ type: 'deviceHealthChange', payload: { cpu: 90 } });
  // pluginManager.schedule(DeviceHealthReviewerPlugin, 60000); // every 60s
  // pluginManager.addAutomationRule({
  //   id: 'cpu-offload',
  //   description: 'Offload to cloud if CPU > 80%',
  //   trigger: (_event) => _event.type === 'deviceHealthChange' && _event.payload.cpu > 80,
  //   action: () => { /* offload logic */ },
  // });
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/plugins/PluginManager.ts -->
// QMOI Plugin Manager Stub

import React from "react";
import { DeviceHealthReviewerPlugin } from "./DeviceHealthReviewerPlugin";
import { OptimizationSuggestionPlugin } from "./OptimizationSuggestionPlugin";
import { AIReviewPlugin } from "./AIReviewPlugin";
import { QuickAIWidgetPlugin } from "./QuickAIWidgetPlugin";

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
    this.register(DeviceHealthReviewerPlugin);
    this.register(OptimizationSuggestionPlugin);
    this.register(AIReviewPlugin);
    this.register(QuickAIWidgetPlugin);
  }

  activateAll() {
    this.plugins.forEach((p) => p.activate());
  }

  deactivateAll() {
    this.plugins.forEach((p) => p.deactivate());
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
    (this.eventListeners[event.type] || []).forEach((fn) => fn(event.payload));
    this.automationRules.forEach((rule) => {
      if (rule.trigger(_event)) rule.action();
    });
  }

  schedule(plugin: QmoiPlugin, intervalMs: number) {
    const timer = setInterval(() => plugin.activate(), intervalMs);
    this.scheduledPlugins.push({ plugin, interval: intervalMs, timer });
  }

  clearSchedules() {
    this.scheduledPlugins.forEach((s) => {
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
  // pluginManager.on('deviceHealthChange', (payload) => { ... });
  // pluginManager.emit({ type: 'deviceHealthChange', payload: { cpu: 90 } });
  // pluginManager.schedule(DeviceHealthReviewerPlugin, 60000); // every 60s
  // pluginManager.addAutomationRule({
  //   id: 'cpu-offload',
  //   description: 'Offload to cloud if CPU > 80%',
  //   trigger: (_event) => _event.type === 'deviceHealthChange' && _event.payload.cpu > 80,
  //   action: () => { /* offload logic */ },
  // });
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/plugins/PluginManager.ts -->
// QMOI Plugin Manager Stub

import React from "react";
import { DeviceHealthReviewerPlugin } from "./DeviceHealthReviewerPlugin";
import { OptimizationSuggestionPlugin } from "./OptimizationSuggestionPlugin";
import { AIReviewPlugin } from "./AIReviewPlugin";
import { QuickAIWidgetPlugin } from "./QuickAIWidgetPlugin";

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
    this.register(DeviceHealthReviewerPlugin);
    this.register(OptimizationSuggestionPlugin);
    this.register(AIReviewPlugin);
    this.register(QuickAIWidgetPlugin);
  }

  activateAll() {
    this.plugins.forEach((p) => p.activate());
  }

  deactivateAll() {
    this.plugins.forEach((p) => p.deactivate());
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
    (this.eventListeners[event.type] || []).forEach((fn) => fn(event.payload));
    this.automationRules.forEach((rule) => {
      if (rule.trigger(_event)) rule.action();
    });
  }

  schedule(plugin: QmoiPlugin, intervalMs: number) {
    const timer = setInterval(() => plugin.activate(), intervalMs);
    this.scheduledPlugins.push({ plugin, interval: intervalMs, timer });
  }

  clearSchedules() {
    this.scheduledPlugins.forEach((s) => {
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
  // pluginManager.on('deviceHealthChange', (payload) => { ... });
  // pluginManager.emit({ type: 'deviceHealthChange', payload: { cpu: 90 } });
  // pluginManager.schedule(DeviceHealthReviewerPlugin, 60000); // every 60s
  // pluginManager.addAutomationRule({
  //   id: 'cpu-offload',
  //   description: 'Offload to cloud if CPU > 80%',
  //   trigger: (_event) => _event.type === 'deviceHealthChange' && _event.payload.cpu > 80,
  //   action: () => { /* offload logic */ },
  // });
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/plugins/PluginManager.ts -->
// QMOI Plugin Manager Stub

import React from "react";
import { DeviceHealthReviewerPlugin } from "./DeviceHealthReviewerPlugin";
import { OptimizationSuggestionPlugin } from "./OptimizationSuggestionPlugin";
import { AIReviewPlugin } from "./AIReviewPlugin";
import { QuickAIWidgetPlugin } from "./QuickAIWidgetPlugin";

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
    this.register(DeviceHealthReviewerPlugin);
    this.register(OptimizationSuggestionPlugin);
    this.register(AIReviewPlugin);
    this.register(QuickAIWidgetPlugin);
  }

  activateAll() {
    this.plugins.forEach((p) => p.activate());
  }

  deactivateAll() {
    this.plugins.forEach((p) => p.deactivate());
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
    (this.eventListeners[event.type] || []).forEach((fn) => fn(event.payload));
    this.automationRules.forEach((rule) => {
      if (rule.trigger(_event)) rule.action();
    });
  }

  schedule(plugin: QmoiPlugin, intervalMs: number) {
    const timer = setInterval(() => plugin.activate(), intervalMs);
    this.scheduledPlugins.push({ plugin, interval: intervalMs, timer });
  }

  clearSchedules() {
    this.scheduledPlugins.forEach((s) => {
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
  // pluginManager.on('deviceHealthChange', (payload) => { ... });
  // pluginManager.emit({ type: 'deviceHealthChange', payload: { cpu: 90 } });
  // pluginManager.schedule(DeviceHealthReviewerPlugin, 60000); // every 60s
  // pluginManager.addAutomationRule({
  //   id: 'cpu-offload',
  //   description: 'Offload to cloud if CPU > 80%',
  //   trigger: (_event) => _event.type === 'deviceHealthChange' && _event.payload.cpu > 80,
  //   action: () => { /* offload logic */ },
  // });
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/plugins/PluginManager.ts -->
// QMOI Plugin Manager Stub

import React from "react";
import { DeviceHealthReviewerPlugin } from "./DeviceHealthReviewerPlugin";
import { OptimizationSuggestionPlugin } from "./OptimizationSuggestionPlugin";
import { AIReviewPlugin } from "./AIReviewPlugin";
import { QuickAIWidgetPlugin } from "./QuickAIWidgetPlugin";

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
    this.register(DeviceHealthReviewerPlugin);
    this.register(OptimizationSuggestionPlugin);
    this.register(AIReviewPlugin);
    this.register(QuickAIWidgetPlugin);
  }

  activateAll() {
    this.plugins.forEach((p) => p.activate());
  }

  deactivateAll() {
    this.plugins.forEach((p) => p.deactivate());
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
    (this.eventListeners[event.type] || []).forEach((fn) => fn(event.payload));
    this.automationRules.forEach((rule) => {
      if (rule.trigger(_event)) rule.action();
    });
  }

  schedule(plugin: QmoiPlugin, intervalMs: number) {
    const timer = setInterval(() => plugin.activate(), intervalMs);
    this.scheduledPlugins.push({ plugin, interval: intervalMs, timer });
  }

  clearSchedules() {
    this.scheduledPlugins.forEach((s) => {
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
  // pluginManager.on('deviceHealthChange', (payload) => { ... });
  // pluginManager.emit({ type: 'deviceHealthChange', payload: { cpu: 90 } });
  // pluginManager.schedule(DeviceHealthReviewerPlugin, 60000); // every 60s
  // pluginManager.addAutomationRule({
  //   id: 'cpu-offload',
  //   description: 'Offload to cloud if CPU > 80%',
  //   trigger: (_event) => _event.type === 'deviceHealthChange' && _event.payload.cpu > 80,
  //   action: () => { /* offload logic */ },
  // });
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/plugins/PluginManager.ts -->
// QMOI Plugin Manager Stub

import React from "react";
import { DeviceHealthReviewerPlugin } from "./DeviceHealthReviewerPlugin";
import { OptimizationSuggestionPlugin } from "./OptimizationSuggestionPlugin";
import { AIReviewPlugin } from "./AIReviewPlugin";
import { QuickAIWidgetPlugin } from "./QuickAIWidgetPlugin";

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
    this.register(DeviceHealthReviewerPlugin);
    this.register(OptimizationSuggestionPlugin);
    this.register(AIReviewPlugin);
    this.register(QuickAIWidgetPlugin);
  }

  activateAll() {
    this.plugins.forEach((p) => p.activate());
  }

  deactivateAll() {
    this.plugins.forEach((p) => p.deactivate());
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
    (this.eventListeners[event.type] || []).forEach((fn) => fn(event.payload));
    this.automationRules.forEach((rule) => {
      if (rule.trigger(_event)) rule.action();
    });
  }

  schedule(plugin: QmoiPlugin, intervalMs: number) {
    const timer = setInterval(() => plugin.activate(), intervalMs);
    this.scheduledPlugins.push({ plugin, interval: intervalMs, timer });
  }

  clearSchedules() {
    this.scheduledPlugins.forEach((s) => {
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
  // pluginManager.on('deviceHealthChange', (payload) => { ... });
  // pluginManager.emit({ type: 'deviceHealthChange', payload: { cpu: 90 } });
  // pluginManager.schedule(DeviceHealthReviewerPlugin, 60000); // every 60s
  // pluginManager.addAutomationRule({
  //   id: 'cpu-offload',
  //   description: 'Offload to cloud if CPU > 80%',
  //   trigger: (_event) => _event.type === 'deviceHealthChange' && _event.payload.cpu > 80,
  //   action: () => { /* offload logic */ },
  // });
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/plugins/PluginManager.ts -->
// QMOI Plugin Manager Stub

import React from "react";
import { DeviceHealthReviewerPlugin } from "./DeviceHealthReviewerPlugin";
import { OptimizationSuggestionPlugin } from "./OptimizationSuggestionPlugin";
import { AIReviewPlugin } from "./AIReviewPlugin";
import { QuickAIWidgetPlugin } from "./QuickAIWidgetPlugin";

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
    this.register(DeviceHealthReviewerPlugin);
    this.register(OptimizationSuggestionPlugin);
    this.register(AIReviewPlugin);
    this.register(QuickAIWidgetPlugin);
  }

  activateAll() {
    this.plugins.forEach((p) => p.activate());
  }

  deactivateAll() {
    this.plugins.forEach((p) => p.deactivate());
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
    (this.eventListeners[event.type] || []).forEach((fn) => fn(event.payload));
    this.automationRules.forEach((rule) => {
      if (rule.trigger(_event)) rule.action();
    });
  }

  schedule(plugin: QmoiPlugin, intervalMs: number) {
    const timer = setInterval(() => plugin.activate(), intervalMs);
    this.scheduledPlugins.push({ plugin, interval: intervalMs, timer });
  }

  clearSchedules() {
    this.scheduledPlugins.forEach((s) => {
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
  // pluginManager.on('deviceHealthChange', (payload) => { ... });
  // pluginManager.emit({ type: 'deviceHealthChange', payload: { cpu: 90 } });
  // pluginManager.schedule(DeviceHealthReviewerPlugin, 60000); // every 60s
  // pluginManager.addAutomationRule({
  //   id: 'cpu-offload',
  //   description: 'Offload to cloud if CPU > 80%',
  //   trigger: (_event) => _event.type === 'deviceHealthChange' && _event.payload.cpu > 80,
  //   action: () => { /* offload logic */ },
  // });
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/plugins/PluginManager.ts -->
// QMOI Plugin Manager Stub

import React from "react";
import { DeviceHealthReviewerPlugin } from "./DeviceHealthReviewerPlugin";
import { OptimizationSuggestionPlugin } from "./OptimizationSuggestionPlugin";
import { AIReviewPlugin } from "./AIReviewPlugin";
import { QuickAIWidgetPlugin } from "./QuickAIWidgetPlugin";

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
    this.register(DeviceHealthReviewerPlugin);
    this.register(OptimizationSuggestionPlugin);
    this.register(AIReviewPlugin);
    this.register(QuickAIWidgetPlugin);
  }

  activateAll() {
    this.plugins.forEach((p) => p.activate());
  }

  deactivateAll() {
    this.plugins.forEach((p) => p.deactivate());
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
    (this.eventListeners[event.type] || []).forEach((fn) => fn(event.payload));
    this.automationRules.forEach((rule) => {
      if (rule.trigger(_event)) rule.action();
    });
  }

  schedule(plugin: QmoiPlugin, intervalMs: number) {
    const timer = setInterval(() => plugin.activate(), intervalMs);
    this.scheduledPlugins.push({ plugin, interval: intervalMs, timer });
  }

  clearSchedules() {
    this.scheduledPlugins.forEach((s) => {
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
  // pluginManager.on('deviceHealthChange', (payload) => { ... });
  // pluginManager.emit({ type: 'deviceHealthChange', payload: { cpu: 90 } });
  // pluginManager.schedule(DeviceHealthReviewerPlugin, 60000); // every 60s
  // pluginManager.addAutomationRule({
  //   id: 'cpu-offload',
  //   description: 'Offload to cloud if CPU > 80%',
  //   trigger: (_event) => _event.type === 'deviceHealthChange' && _event.payload.cpu > 80,
  //   action: () => { /* offload logic */ },
  // });
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/plugins/PluginManager.ts -->
// QMOI Plugin Manager Stub

import React from "react";
import { DeviceHealthReviewerPlugin } from "./DeviceHealthReviewerPlugin";
import { OptimizationSuggestionPlugin } from "./OptimizationSuggestionPlugin";
import { AIReviewPlugin } from "./AIReviewPlugin";
import { QuickAIWidgetPlugin } from "./QuickAIWidgetPlugin";

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
    this.register(DeviceHealthReviewerPlugin);
    this.register(OptimizationSuggestionPlugin);
    this.register(AIReviewPlugin);
    this.register(QuickAIWidgetPlugin);
  }

  activateAll() {
    this.plugins.forEach((p) => p.activate());
  }

  deactivateAll() {
    this.plugins.forEach((p) => p.deactivate());
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
    (this.eventListeners[event.type] || []).forEach((fn) => fn(event.payload));
    this.automationRules.forEach((rule) => {
      if (rule.trigger(_event)) rule.action();
    });
  }

  schedule(plugin: QmoiPlugin, intervalMs: number) {
    const timer = setInterval(() => plugin.activate(), intervalMs);
    this.scheduledPlugins.push({ plugin, interval: intervalMs, timer });
  }

  clearSchedules() {
    this.scheduledPlugins.forEach((s) => {
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
  // pluginManager.on('deviceHealthChange', (payload) => { ... });
  // pluginManager.emit({ type: 'deviceHealthChange', payload: { cpu: 90 } });
  // pluginManager.schedule(DeviceHealthReviewerPlugin, 60000); // every 60s
  // pluginManager.addAutomationRule({
  //   id: 'cpu-offload',
  //   description: 'Offload to cloud if CPU > 80%',
  //   trigger: (_event) => _event.type === 'deviceHealthChange' && _event.payload.cpu > 80,
  //   action: () => { /* offload logic */ },
  // });
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/plugins/PluginManager.ts -->
// QMOI Plugin Manager Stub

import React from "react";
import { DeviceHealthReviewerPlugin } from "./DeviceHealthReviewerPlugin";
import { OptimizationSuggestionPlugin } from "./OptimizationSuggestionPlugin";
import { AIReviewPlugin } from "./AIReviewPlugin";
import { QuickAIWidgetPlugin } from "./QuickAIWidgetPlugin";

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
    this.register(DeviceHealthReviewerPlugin);
    this.register(OptimizationSuggestionPlugin);
    this.register(AIReviewPlugin);
    this.register(QuickAIWidgetPlugin);
  }

  activateAll() {
    this.plugins.forEach((p) => p.activate());
  }

  deactivateAll() {
    this.plugins.forEach((p) => p.deactivate());
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
    (this.eventListeners[event.type] || []).forEach((fn) => fn(event.payload));
    this.automationRules.forEach((rule) => {
      if (rule.trigger(_event)) rule.action();
    });
  }

  schedule(plugin: QmoiPlugin, intervalMs: number) {
    const timer = setInterval(() => plugin.activate(), intervalMs);
    this.scheduledPlugins.push({ plugin, interval: intervalMs, timer });
  }

  clearSchedules() {
    this.scheduledPlugins.forEach((s) => {
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
  // pluginManager.on('deviceHealthChange', (payload) => { ... });
  // pluginManager.emit({ type: 'deviceHealthChange', payload: { cpu: 90 } });
  // pluginManager.schedule(DeviceHealthReviewerPlugin, 60000); // every 60s
  // pluginManager.addAutomationRule({
  //   id: 'cpu-offload',
  //   description: 'Offload to cloud if CPU > 80%',
  //   trigger: (_event) => _event.type === 'deviceHealthChange' && _event.payload.cpu > 80,
  //   action: () => { /* offload logic */ },
  // });
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/plugins/PluginManager.ts -->
// QMOI Plugin Manager Stub

import React from "react";
import { DeviceHealthReviewerPlugin } from "./DeviceHealthReviewerPlugin";
import { OptimizationSuggestionPlugin } from "./OptimizationSuggestionPlugin";
import { AIReviewPlugin } from "./AIReviewPlugin";
import { QuickAIWidgetPlugin } from "./QuickAIWidgetPlugin";

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
    this.register(DeviceHealthReviewerPlugin);
    this.register(OptimizationSuggestionPlugin);
    this.register(AIReviewPlugin);
    this.register(QuickAIWidgetPlugin);
  }

  activateAll() {
    this.plugins.forEach((p) => p.activate());
  }

  deactivateAll() {
    this.plugins.forEach((p) => p.deactivate());
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
    (this.eventListeners[event.type] || []).forEach((fn) => fn(event.payload));
    this.automationRules.forEach((rule) => {
      if (rule.trigger(_event)) rule.action();
    });
  }

  schedule(plugin: QmoiPlugin, intervalMs: number) {
    const timer = setInterval(() => plugin.activate(), intervalMs);
    this.scheduledPlugins.push({ plugin, interval: intervalMs, timer });
  }

  clearSchedules() {
    this.scheduledPlugins.forEach((s) => {
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
  // pluginManager.on('deviceHealthChange', (payload) => { ... });
  // pluginManager.emit({ type: 'deviceHealthChange', payload: { cpu: 90 } });
  // pluginManager.schedule(DeviceHealthReviewerPlugin, 60000); // every 60s
  // pluginManager.addAutomationRule({
  //   id: 'cpu-offload',
  //   description: 'Offload to cloud if CPU > 80%',
  //   trigger: (_event) => _event.type === 'deviceHealthChange' && _event.payload.cpu > 80,
  //   action: () => { /* offload logic */ },
  // });
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/plugins/PluginManager.ts -->
// QMOI Plugin Manager Stub

import React from "react";
import { DeviceHealthReviewerPlugin } from "./DeviceHealthReviewerPlugin";
import { OptimizationSuggestionPlugin } from "./OptimizationSuggestionPlugin";
import { AIReviewPlugin } from "./AIReviewPlugin";
import { QuickAIWidgetPlugin } from "./QuickAIWidgetPlugin";

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
    this.register(DeviceHealthReviewerPlugin);
    this.register(OptimizationSuggestionPlugin);
    this.register(AIReviewPlugin);
    this.register(QuickAIWidgetPlugin);
  }

  activateAll() {
    this.plugins.forEach((p) => p.activate());
  }

  deactivateAll() {
    this.plugins.forEach((p) => p.deactivate());
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
    (this.eventListeners[event.type] || []).forEach((fn) => fn(event.payload));
    this.automationRules.forEach((rule) => {
      if (rule.trigger(_event)) rule.action();
    });
  }

  schedule(plugin: QmoiPlugin, intervalMs: number) {
    const timer = setInterval(() => plugin.activate(), intervalMs);
    this.scheduledPlugins.push({ plugin, interval: intervalMs, timer });
  }

  clearSchedules() {
    this.scheduledPlugins.forEach((s) => {
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
  // pluginManager.on('deviceHealthChange', (payload) => { ... });
  // pluginManager.emit({ type: 'deviceHealthChange', payload: { cpu: 90 } });
  // pluginManager.schedule(DeviceHealthReviewerPlugin, 60000); // every 60s
  // pluginManager.addAutomationRule({
  //   id: 'cpu-offload',
  //   description: 'Offload to cloud if CPU > 80%',
  //   trigger: (_event) => _event.type === 'deviceHealthChange' && _event.payload.cpu > 80,
  //   action: () => { /* offload logic */ },
  // });
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/plugins/PluginManager.ts -->
// QMOI Plugin Manager Stub

import React from "react";
import { DeviceHealthReviewerPlugin } from "./DeviceHealthReviewerPlugin";
import { OptimizationSuggestionPlugin } from "./OptimizationSuggestionPlugin";
import { AIReviewPlugin } from "./AIReviewPlugin";
import { QuickAIWidgetPlugin } from "./QuickAIWidgetPlugin";

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
    this.register(DeviceHealthReviewerPlugin);
    this.register(OptimizationSuggestionPlugin);
    this.register(AIReviewPlugin);
    this.register(QuickAIWidgetPlugin);
  }

  activateAll() {
    this.plugins.forEach((p) => p.activate());
  }

  deactivateAll() {
    this.plugins.forEach((p) => p.deactivate());
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
    (this.eventListeners[event.type] || []).forEach((fn) => fn(event.payload));
    this.automationRules.forEach((rule) => {
      if (rule.trigger(_event)) rule.action();
    });
  }

  schedule(plugin: QmoiPlugin, intervalMs: number) {
    const timer = setInterval(() => plugin.activate(), intervalMs);
    this.scheduledPlugins.push({ plugin, interval: intervalMs, timer });
  }

  clearSchedules() {
    this.scheduledPlugins.forEach((s) => {
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
  // pluginManager.on('deviceHealthChange', (payload) => { ... });
  // pluginManager.emit({ type: 'deviceHealthChange', payload: { cpu: 90 } });
  // pluginManager.schedule(DeviceHealthReviewerPlugin, 60000); // every 60s
  // pluginManager.addAutomationRule({
  //   id: 'cpu-offload',
  //   description: 'Offload to cloud if CPU > 80%',
  //   trigger: (_event) => _event.type === 'deviceHealthChange' && _event.payload.cpu > 80,
  //   action: () => { /* offload logic */ },
  // });
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/plugins/PluginManager.ts -->
// QMOI Plugin Manager Stub

import React from "react";
import { DeviceHealthReviewerPlugin } from "./DeviceHealthReviewerPlugin";
import { OptimizationSuggestionPlugin } from "./OptimizationSuggestionPlugin";
import { AIReviewPlugin } from "./AIReviewPlugin";
import { QuickAIWidgetPlugin } from "./QuickAIWidgetPlugin";

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
    this.register(DeviceHealthReviewerPlugin);
    this.register(OptimizationSuggestionPlugin);
    this.register(AIReviewPlugin);
    this.register(QuickAIWidgetPlugin);
  }

  activateAll() {
    this.plugins.forEach((p) => p.activate());
  }

  deactivateAll() {
    this.plugins.forEach((p) => p.deactivate());
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
    (this.eventListeners[event.type] || []).forEach((fn) => fn(event.payload));
    this.automationRules.forEach((rule) => {
      if (rule.trigger(_event)) rule.action();
    });
  }

  schedule(plugin: QmoiPlugin, intervalMs: number) {
    const timer = setInterval(() => plugin.activate(), intervalMs);
    this.scheduledPlugins.push({ plugin, interval: intervalMs, timer });
  }

  clearSchedules() {
    this.scheduledPlugins.forEach((s) => {
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
  // pluginManager.on('deviceHealthChange', (payload) => { ... });
  // pluginManager.emit({ type: 'deviceHealthChange', payload: { cpu: 90 } });
  // pluginManager.schedule(DeviceHealthReviewerPlugin, 60000); // every 60s
  // pluginManager.addAutomationRule({
  //   id: 'cpu-offload',
  //   description: 'Offload to cloud if CPU > 80%',
  //   trigger: (_event) => _event.type === 'deviceHealthChange' && _event.payload.cpu > 80,
  //   action: () => { /* offload logic */ },
  // });
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/plugins/PluginManager.ts -->
// QMOI Plugin Manager Stub

import React from "react";
import { DeviceHealthReviewerPlugin } from "./DeviceHealthReviewerPlugin";
import { OptimizationSuggestionPlugin } from "./OptimizationSuggestionPlugin";
import { AIReviewPlugin } from "./AIReviewPlugin";
import { QuickAIWidgetPlugin } from "./QuickAIWidgetPlugin";

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
    this.register(DeviceHealthReviewerPlugin);
    this.register(OptimizationSuggestionPlugin);
    this.register(AIReviewPlugin);
    this.register(QuickAIWidgetPlugin);
  }

  activateAll() {
    this.plugins.forEach((p) => p.activate());
  }

  deactivateAll() {
    this.plugins.forEach((p) => p.deactivate());
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
    (this.eventListeners[event.type] || []).forEach((fn) => fn(event.payload));
    this.automationRules.forEach((rule) => {
      if (rule.trigger(_event)) rule.action();
    });
  }

  schedule(plugin: QmoiPlugin, intervalMs: number) {
    const timer = setInterval(() => plugin.activate(), intervalMs);
    this.scheduledPlugins.push({ plugin, interval: intervalMs, timer });
  }

  clearSchedules() {
    this.scheduledPlugins.forEach((s) => {
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
  // pluginManager.on('deviceHealthChange', (payload) => { ... });
  // pluginManager.emit({ type: 'deviceHealthChange', payload: { cpu: 90 } });
  // pluginManager.schedule(DeviceHealthReviewerPlugin, 60000); // every 60s
  // pluginManager.addAutomationRule({
  //   id: 'cpu-offload',
  //   description: 'Offload to cloud if CPU > 80%',
  //   trigger: (_event) => _event.type === 'deviceHealthChange' && _event.payload.cpu > 80,
  //   action: () => { /* offload logic */ },
  // });
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/plugins/PluginManager.ts -->
// QMOI Plugin Manager Stub

import React from "react";
import { DeviceHealthReviewerPlugin } from "./DeviceHealthReviewerPlugin";
import { OptimizationSuggestionPlugin } from "./OptimizationSuggestionPlugin";
import { AIReviewPlugin } from "./AIReviewPlugin";
import { QuickAIWidgetPlugin } from "./QuickAIWidgetPlugin";

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
    this.register(DeviceHealthReviewerPlugin);
    this.register(OptimizationSuggestionPlugin);
    this.register(AIReviewPlugin);
    this.register(QuickAIWidgetPlugin);
  }

  activateAll() {
    this.plugins.forEach((p) => p.activate());
  }

  deactivateAll() {
    this.plugins.forEach((p) => p.deactivate());
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
    (this.eventListeners[event.type] || []).forEach((fn) => fn(event.payload));
    this.automationRules.forEach((rule) => {
      if (rule.trigger(_event)) rule.action();
    });
  }

  schedule(plugin: QmoiPlugin, intervalMs: number) {
    const timer = setInterval(() => plugin.activate(), intervalMs);
    this.scheduledPlugins.push({ plugin, interval: intervalMs, timer });
  }

  clearSchedules() {
    this.scheduledPlugins.forEach((s) => {
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
  // pluginManager.on('deviceHealthChange', (payload) => { ... });
  // pluginManager.emit({ type: 'deviceHealthChange', payload: { cpu: 90 } });
  // pluginManager.schedule(DeviceHealthReviewerPlugin, 60000); // every 60s
  // pluginManager.addAutomationRule({
  //   id: 'cpu-offload',
  //   description: 'Offload to cloud if CPU > 80%',
  //   trigger: (_event) => _event.type === 'deviceHealthChange' && _event.payload.cpu > 80,
  //   action: () => { /* offload logic */ },
  // });
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/plugins/PluginManager.ts -->
// QMOI Plugin Manager Stub

import React from "react";
import { DeviceHealthReviewerPlugin } from "./DeviceHealthReviewerPlugin";
import { OptimizationSuggestionPlugin } from "./OptimizationSuggestionPlugin";
import { AIReviewPlugin } from "./AIReviewPlugin";
import { QuickAIWidgetPlugin } from "./QuickAIWidgetPlugin";

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
    this.register(DeviceHealthReviewerPlugin);
    this.register(OptimizationSuggestionPlugin);
    this.register(AIReviewPlugin);
    this.register(QuickAIWidgetPlugin);
  }

  activateAll() {
    this.plugins.forEach((p) => p.activate());
  }

  deactivateAll() {
    this.plugins.forEach((p) => p.deactivate());
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
    (this.eventListeners[event.type] || []).forEach((fn) => fn(event.payload));
    this.automationRules.forEach((rule) => {
      if (rule.trigger(_event)) rule.action();
    });
  }

  schedule(plugin: QmoiPlugin, intervalMs: number) {
    const timer = setInterval(() => plugin.activate(), intervalMs);
    this.scheduledPlugins.push({ plugin, interval: intervalMs, timer });
  }

  clearSchedules() {
    this.scheduledPlugins.forEach((s) => {
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
  // pluginManager.on('deviceHealthChange', (payload) => { ... });
  // pluginManager.emit({ type: 'deviceHealthChange', payload: { cpu: 90 } });
  // pluginManager.schedule(DeviceHealthReviewerPlugin, 60000); // every 60s
  // pluginManager.addAutomationRule({
  //   id: 'cpu-offload',
  //   description: 'Offload to cloud if CPU > 80%',
  //   trigger: (_event) => _event.type === 'deviceHealthChange' && _event.payload.cpu > 80,
  //   action: () => { /* offload logic */ },
  // });
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/plugins/PluginManager.ts -->
// QMOI Plugin Manager Stub

import React from "react";
import { DeviceHealthReviewerPlugin } from "./DeviceHealthReviewerPlugin";
import { OptimizationSuggestionPlugin } from "./OptimizationSuggestionPlugin";
import { AIReviewPlugin } from "./AIReviewPlugin";
import { QuickAIWidgetPlugin } from "./QuickAIWidgetPlugin";

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
    this.register(DeviceHealthReviewerPlugin);
    this.register(OptimizationSuggestionPlugin);
    this.register(AIReviewPlugin);
    this.register(QuickAIWidgetPlugin);
  }

  activateAll() {
    this.plugins.forEach((p) => p.activate());
  }

  deactivateAll() {
    this.plugins.forEach((p) => p.deactivate());
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
    (this.eventListeners[event.type] || []).forEach((fn) => fn(event.payload));
    this.automationRules.forEach((rule) => {
      if (rule.trigger(_event)) rule.action();
    });
  }

  schedule(plugin: QmoiPlugin, intervalMs: number) {
    const timer = setInterval(() => plugin.activate(), intervalMs);
    this.scheduledPlugins.push({ plugin, interval: intervalMs, timer });
  }

  clearSchedules() {
    this.scheduledPlugins.forEach((s) => {
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
  // pluginManager.on('deviceHealthChange', (payload) => { ... });
  // pluginManager.emit({ type: 'deviceHealthChange', payload: { cpu: 90 } });
  // pluginManager.schedule(DeviceHealthReviewerPlugin, 60000); // every 60s
  // pluginManager.addAutomationRule({
  //   id: 'cpu-offload',
  //   description: 'Offload to cloud if CPU > 80%',
  //   trigger: (_event) => _event.type === 'deviceHealthChange' && _event.payload.cpu > 80,
  //   action: () => { /* offload logic */ },
  // });
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/plugins/PluginManager.ts -->
// QMOI Plugin Manager Stub

import React from "react";
import { DeviceHealthReviewerPlugin } from "./DeviceHealthReviewerPlugin";
import { OptimizationSuggestionPlugin } from "./OptimizationSuggestionPlugin";
import { AIReviewPlugin } from "./AIReviewPlugin";
import { QuickAIWidgetPlugin } from "./QuickAIWidgetPlugin";

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
    this.register(DeviceHealthReviewerPlugin);
    this.register(OptimizationSuggestionPlugin);
    this.register(AIReviewPlugin);
    this.register(QuickAIWidgetPlugin);
  }

  activateAll() {
    this.plugins.forEach((p) => p.activate());
  }

  deactivateAll() {
    this.plugins.forEach((p) => p.deactivate());
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
    (this.eventListeners[event.type] || []).forEach((fn) => fn(event.payload));
    this.automationRules.forEach((rule) => {
      if (rule.trigger(_event)) rule.action();
    });
  }

  schedule(plugin: QmoiPlugin, intervalMs: number) {
    const timer = setInterval(() => plugin.activate(), intervalMs);
    this.scheduledPlugins.push({ plugin, interval: intervalMs, timer });
  }

  clearSchedules() {
    this.scheduledPlugins.forEach((s) => {
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
  // pluginManager.on('deviceHealthChange', (payload) => { ... });
  // pluginManager.emit({ type: 'deviceHealthChange', payload: { cpu: 90 } });
  // pluginManager.schedule(DeviceHealthReviewerPlugin, 60000); // every 60s
  // pluginManager.addAutomationRule({
  //   id: 'cpu-offload',
  //   description: 'Offload to cloud if CPU > 80%',
  //   trigger: (_event) => _event.type === 'deviceHealthChange' && _event.payload.cpu > 80,
  //   action: () => { /* offload logic */ },
  // });
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/plugins/PluginManager.ts -->
// QMOI Plugin Manager Stub

import React from "react";
import { DeviceHealthReviewerPlugin } from "./DeviceHealthReviewerPlugin";
import { OptimizationSuggestionPlugin } from "./OptimizationSuggestionPlugin";
import { AIReviewPlugin } from "./AIReviewPlugin";
import { QuickAIWidgetPlugin } from "./QuickAIWidgetPlugin";

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
    this.register(DeviceHealthReviewerPlugin);
    this.register(OptimizationSuggestionPlugin);
    this.register(AIReviewPlugin);
    this.register(QuickAIWidgetPlugin);
  }

  activateAll() {
    this.plugins.forEach((p) => p.activate());
  }

  deactivateAll() {
    this.plugins.forEach((p) => p.deactivate());
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
    (this.eventListeners[event.type] || []).forEach((fn) => fn(event.payload));
    this.automationRules.forEach((rule) => {
      if (rule.trigger(_event)) rule.action();
    });
  }

  schedule(plugin: QmoiPlugin, intervalMs: number) {
    const timer = setInterval(() => plugin.activate(), intervalMs);
    this.scheduledPlugins.push({ plugin, interval: intervalMs, timer });
  }

  clearSchedules() {
    this.scheduledPlugins.forEach((s) => {
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
  // pluginManager.on('deviceHealthChange', (payload) => { ... });
  // pluginManager.emit({ type: 'deviceHealthChange', payload: { cpu: 90 } });
  // pluginManager.schedule(DeviceHealthReviewerPlugin, 60000); // every 60s
  // pluginManager.addAutomationRule({
  //   id: 'cpu-offload',
  //   description: 'Offload to cloud if CPU > 80%',
  //   trigger: (_event) => _event.type === 'deviceHealthChange' && _event.payload.cpu > 80,
  //   action: () => { /* offload logic */ },
  // });
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/plugins/PluginManager.ts -->
// QMOI Plugin Manager Stub

import React from "react";
import { DeviceHealthReviewerPlugin } from "./DeviceHealthReviewerPlugin";
import { OptimizationSuggestionPlugin } from "./OptimizationSuggestionPlugin";
import { AIReviewPlugin } from "./AIReviewPlugin";
import { QuickAIWidgetPlugin } from "./QuickAIWidgetPlugin";

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
    this.register(DeviceHealthReviewerPlugin);
    this.register(OptimizationSuggestionPlugin);
    this.register(AIReviewPlugin);
    this.register(QuickAIWidgetPlugin);
  }

  activateAll() {
    this.plugins.forEach((p) => p.activate());
  }

  deactivateAll() {
    this.plugins.forEach((p) => p.deactivate());
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
    (this.eventListeners[event.type] || []).forEach((fn) => fn(event.payload));
    this.automationRules.forEach((rule) => {
      if (rule.trigger(_event)) rule.action();
    });
  }

  schedule(plugin: QmoiPlugin, intervalMs: number) {
    const timer = setInterval(() => plugin.activate(), intervalMs);
    this.scheduledPlugins.push({ plugin, interval: intervalMs, timer });
  }

  clearSchedules() {
    this.scheduledPlugins.forEach((s) => {
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
  // pluginManager.on('deviceHealthChange', (payload) => { ... });
  // pluginManager.emit({ type: 'deviceHealthChange', payload: { cpu: 90 } });
  // pluginManager.schedule(DeviceHealthReviewerPlugin, 60000); // every 60s
  // pluginManager.addAutomationRule({
  //   id: 'cpu-offload',
  //   description: 'Offload to cloud if CPU > 80%',
  //   trigger: (_event) => _event.type === 'deviceHealthChange' && _event.payload.cpu > 80,
  //   action: () => { /* offload logic */ },
  // });
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/plugins/PluginManager.ts -->
// QMOI Plugin Manager Stub

import React from "react";
import { DeviceHealthReviewerPlugin } from "./DeviceHealthReviewerPlugin";
import { OptimizationSuggestionPlugin } from "./OptimizationSuggestionPlugin";
import { AIReviewPlugin } from "./AIReviewPlugin";
import { QuickAIWidgetPlugin } from "./QuickAIWidgetPlugin";

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
    this.register(DeviceHealthReviewerPlugin);
    this.register(OptimizationSuggestionPlugin);
    this.register(AIReviewPlugin);
    this.register(QuickAIWidgetPlugin);
  }

  activateAll() {
    this.plugins.forEach((p) => p.activate());
  }

  deactivateAll() {
    this.plugins.forEach((p) => p.deactivate());
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
    (this.eventListeners[event.type] || []).forEach((fn) => fn(event.payload));
    this.automationRules.forEach((rule) => {
      if (rule.trigger(_event)) rule.action();
    });
  }

  schedule(plugin: QmoiPlugin, intervalMs: number) {
    const timer = setInterval(() => plugin.activate(), intervalMs);
    this.scheduledPlugins.push({ plugin, interval: intervalMs, timer });
  }

  clearSchedules() {
    this.scheduledPlugins.forEach((s) => {
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
  // pluginManager.on('deviceHealthChange', (payload) => { ... });
  // pluginManager.emit({ type: 'deviceHealthChange', payload: { cpu: 90 } });
  // pluginManager.schedule(DeviceHealthReviewerPlugin, 60000); // every 60s
  // pluginManager.addAutomationRule({
  //   id: 'cpu-offload',
  //   description: 'Offload to cloud if CPU > 80%',
  //   trigger: (_event) => _event.type === 'deviceHealthChange' && _event.payload.cpu > 80,
  //   action: () => { /* offload logic */ },
  // });
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/plugins/PluginManager.ts -->
// QMOI Plugin Manager Stub

import React from "react";
import { DeviceHealthReviewerPlugin } from "./DeviceHealthReviewerPlugin";
import { OptimizationSuggestionPlugin } from "./OptimizationSuggestionPlugin";
import { AIReviewPlugin } from "./AIReviewPlugin";
import { QuickAIWidgetPlugin } from "./QuickAIWidgetPlugin";

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
    this.register(DeviceHealthReviewerPlugin);
    this.register(OptimizationSuggestionPlugin);
    this.register(AIReviewPlugin);
    this.register(QuickAIWidgetPlugin);
  }

  activateAll() {
    this.plugins.forEach((p) => p.activate());
  }

  deactivateAll() {
    this.plugins.forEach((p) => p.deactivate());
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
    (this.eventListeners[event.type] || []).forEach((fn) => fn(event.payload));
    this.automationRules.forEach((rule) => {
      if (rule.trigger(_event)) rule.action();
    });
  }

  schedule(plugin: QmoiPlugin, intervalMs: number) {
    const timer = setInterval(() => plugin.activate(), intervalMs);
    this.scheduledPlugins.push({ plugin, interval: intervalMs, timer });
  }

  clearSchedules() {
    this.scheduledPlugins.forEach((s) => {
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
  // pluginManager.on('deviceHealthChange', (payload) => { ... });
  // pluginManager.emit({ type: 'deviceHealthChange', payload: { cpu: 90 } });
  // pluginManager.schedule(DeviceHealthReviewerPlugin, 60000); // every 60s
  // pluginManager.addAutomationRule({
  //   id: 'cpu-offload',
  //   description: 'Offload to cloud if CPU > 80%',
  //   trigger: (_event) => _event.type === 'deviceHealthChange' && _event.payload.cpu > 80,
  //   action: () => { /* offload logic */ },
  // });
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/plugins/PluginManager.ts -->
// QMOI Plugin Manager Stub

import React from "react";
import { DeviceHealthReviewerPlugin } from "./DeviceHealthReviewerPlugin";
import { OptimizationSuggestionPlugin } from "./OptimizationSuggestionPlugin";
import { AIReviewPlugin } from "./AIReviewPlugin";
import { QuickAIWidgetPlugin } from "./QuickAIWidgetPlugin";

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
    this.register(DeviceHealthReviewerPlugin);
    this.register(OptimizationSuggestionPlugin);
    this.register(AIReviewPlugin);
    this.register(QuickAIWidgetPlugin);
  }

  activateAll() {
    this.plugins.forEach((p) => p.activate());
  }

  deactivateAll() {
    this.plugins.forEach((p) => p.deactivate());
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
    (this.eventListeners[event.type] || []).forEach((fn) => fn(event.payload));
    this.automationRules.forEach((rule) => {
      if (rule.trigger(_event)) rule.action();
    });
  }

  schedule(plugin: QmoiPlugin, intervalMs: number) {
    const timer = setInterval(() => plugin.activate(), intervalMs);
    this.scheduledPlugins.push({ plugin, interval: intervalMs, timer });
  }

  clearSchedules() {
    this.scheduledPlugins.forEach((s) => {
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
  // pluginManager.on('deviceHealthChange', (payload) => { ... });
  // pluginManager.emit({ type: 'deviceHealthChange', payload: { cpu: 90 } });
  // pluginManager.schedule(DeviceHealthReviewerPlugin, 60000); // every 60s
  // pluginManager.addAutomationRule({
  //   id: 'cpu-offload',
  //   description: 'Offload to cloud if CPU > 80%',
  //   trigger: (_event) => _event.type === 'deviceHealthChange' && _event.payload.cpu > 80,
  //   action: () => { /* offload logic */ },
  // });
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/plugins/PluginManager.ts -->
// QMOI Plugin Manager Stub

import React from "react";
import { DeviceHealthReviewerPlugin } from "./DeviceHealthReviewerPlugin";
import { OptimizationSuggestionPlugin } from "./OptimizationSuggestionPlugin";
import { AIReviewPlugin } from "./AIReviewPlugin";
import { QuickAIWidgetPlugin } from "./QuickAIWidgetPlugin";

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
    this.register(DeviceHealthReviewerPlugin);
    this.register(OptimizationSuggestionPlugin);
    this.register(AIReviewPlugin);
    this.register(QuickAIWidgetPlugin);
  }

  activateAll() {
    this.plugins.forEach((p) => p.activate());
  }

  deactivateAll() {
    this.plugins.forEach((p) => p.deactivate());
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
    (this.eventListeners[event.type] || []).forEach((fn) => fn(event.payload));
    this.automationRules.forEach((rule) => {
      if (rule.trigger(_event)) rule.action();
    });
  }

  schedule(plugin: QmoiPlugin, intervalMs: number) {
    const timer = setInterval(() => plugin.activate(), intervalMs);
    this.scheduledPlugins.push({ plugin, interval: intervalMs, timer });
  }

  clearSchedules() {
    this.scheduledPlugins.forEach((s) => {
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
  // pluginManager.on('deviceHealthChange', (payload) => { ... });
  // pluginManager.emit({ type: 'deviceHealthChange', payload: { cpu: 90 } });
  // pluginManager.schedule(DeviceHealthReviewerPlugin, 60000); // every 60s
  // pluginManager.addAutomationRule({
  //   id: 'cpu-offload',
  //   description: 'Offload to cloud if CPU > 80%',
  //   trigger: (_event) => _event.type === 'deviceHealthChange' && _event.payload.cpu > 80,
  //   action: () => { /* offload logic */ },
  // });
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/plugins/PluginManager.ts -->
// QMOI Plugin Manager Stub

import React from "react";
import { DeviceHealthReviewerPlugin } from "./DeviceHealthReviewerPlugin";
import { OptimizationSuggestionPlugin } from "./OptimizationSuggestionPlugin";
import { AIReviewPlugin } from "./AIReviewPlugin";
import { QuickAIWidgetPlugin } from "./QuickAIWidgetPlugin";

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
    this.register(DeviceHealthReviewerPlugin);
    this.register(OptimizationSuggestionPlugin);
    this.register(AIReviewPlugin);
    this.register(QuickAIWidgetPlugin);
  }

  activateAll() {
    this.plugins.forEach((p) => p.activate());
  }

  deactivateAll() {
    this.plugins.forEach((p) => p.deactivate());
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
    (this.eventListeners[event.type] || []).forEach((fn) => fn(event.payload));
    this.automationRules.forEach((rule) => {
      if (rule.trigger(_event)) rule.action();
    });
  }

  schedule(plugin: QmoiPlugin, intervalMs: number) {
    const timer = setInterval(() => plugin.activate(), intervalMs);
    this.scheduledPlugins.push({ plugin, interval: intervalMs, timer });
  }

  clearSchedules() {
    this.scheduledPlugins.forEach((s) => {
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
  // pluginManager.on('deviceHealthChange', (payload) => { ... });
  // pluginManager.emit({ type: 'deviceHealthChange', payload: { cpu: 90 } });
  // pluginManager.schedule(DeviceHealthReviewerPlugin, 60000); // every 60s
  // pluginManager.addAutomationRule({
  //   id: 'cpu-offload',
  //   description: 'Offload to cloud if CPU > 80%',
  //   trigger: (_event) => _event.type === 'deviceHealthChange' && _event.payload.cpu > 80,
  //   action: () => { /* offload logic */ },
  // });
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/plugins/PluginManager.ts -->
// QMOI Plugin Manager Stub

import React from "react";
import { DeviceHealthReviewerPlugin } from "./DeviceHealthReviewerPlugin";
import { OptimizationSuggestionPlugin } from "./OptimizationSuggestionPlugin";
import { AIReviewPlugin } from "./AIReviewPlugin";
import { QuickAIWidgetPlugin } from "./QuickAIWidgetPlugin";

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
    this.register(DeviceHealthReviewerPlugin);
    this.register(OptimizationSuggestionPlugin);
    this.register(AIReviewPlugin);
    this.register(QuickAIWidgetPlugin);
  }

  activateAll() {
    this.plugins.forEach((p) => p.activate());
  }

  deactivateAll() {
    this.plugins.forEach((p) => p.deactivate());
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
    (this.eventListeners[event.type] || []).forEach((fn) => fn(event.payload));
    this.automationRules.forEach((rule) => {
      if (rule.trigger(_event)) rule.action();
    });
  }

  schedule(plugin: QmoiPlugin, intervalMs: number) {
    const timer = setInterval(() => plugin.activate(), intervalMs);
    this.scheduledPlugins.push({ plugin, interval: intervalMs, timer });
  }

  clearSchedules() {
    this.scheduledPlugins.forEach((s) => {
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
  // pluginManager.on('deviceHealthChange', (payload) => { ... });
  // pluginManager.emit({ type: 'deviceHealthChange', payload: { cpu: 90 } });
  // pluginManager.schedule(DeviceHealthReviewerPlugin, 60000); // every 60s
  // pluginManager.addAutomationRule({
  //   id: 'cpu-offload',
  //   description: 'Offload to cloud if CPU > 80%',
  //   trigger: (_event) => _event.type === 'deviceHealthChange' && _event.payload.cpu > 80,
  //   action: () => { /* offload logic */ },
  // });
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/plugins/PluginManager.ts -->
// QMOI Plugin Manager Stub

import React from "react";
import { DeviceHealthReviewerPlugin } from "./DeviceHealthReviewerPlugin";
import { OptimizationSuggestionPlugin } from "./OptimizationSuggestionPlugin";
import { AIReviewPlugin } from "./AIReviewPlugin";
import { QuickAIWidgetPlugin } from "./QuickAIWidgetPlugin";

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
    this.register(DeviceHealthReviewerPlugin);
    this.register(OptimizationSuggestionPlugin);
    this.register(AIReviewPlugin);
    this.register(QuickAIWidgetPlugin);
  }

  activateAll() {
    this.plugins.forEach((p) => p.activate());
  }

  deactivateAll() {
    this.plugins.forEach((p) => p.deactivate());
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
    (this.eventListeners[event.type] || []).forEach((fn) => fn(event.payload));
    this.automationRules.forEach((rule) => {
      if (rule.trigger(_event)) rule.action();
    });
  }

  schedule(plugin: QmoiPlugin, intervalMs: number) {
    const timer = setInterval(() => plugin.activate(), intervalMs);
    this.scheduledPlugins.push({ plugin, interval: intervalMs, timer });
  }

  clearSchedules() {
    this.scheduledPlugins.forEach((s) => {
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
  // pluginManager.on('deviceHealthChange', (payload) => { ... });
  // pluginManager.emit({ type: 'deviceHealthChange', payload: { cpu: 90 } });
  // pluginManager.schedule(DeviceHealthReviewerPlugin, 60000); // every 60s
  // pluginManager.addAutomationRule({
  //   id: 'cpu-offload',
  //   description: 'Offload to cloud if CPU > 80%',
  //   trigger: (_event) => _event.type === 'deviceHealthChange' && _event.payload.cpu > 80,
  //   action: () => { /* offload logic */ },
  // });
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/plugins/PluginManager.ts -->
// QMOI Plugin Manager Stub

import React from "react";
import { DeviceHealthReviewerPlugin } from "./DeviceHealthReviewerPlugin";
import { OptimizationSuggestionPlugin } from "./OptimizationSuggestionPlugin";
import { AIReviewPlugin } from "./AIReviewPlugin";
import { QuickAIWidgetPlugin } from "./QuickAIWidgetPlugin";

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
    this.register(DeviceHealthReviewerPlugin);
    this.register(OptimizationSuggestionPlugin);
    this.register(AIReviewPlugin);
    this.register(QuickAIWidgetPlugin);
  }

  activateAll() {
    this.plugins.forEach((p) => p.activate());
  }

  deactivateAll() {
    this.plugins.forEach((p) => p.deactivate());
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
    (this.eventListeners[event.type] || []).forEach((fn) => fn(event.payload));
    this.automationRules.forEach((rule) => {
      if (rule.trigger(_event)) rule.action();
    });
  }

  schedule(plugin: QmoiPlugin, intervalMs: number) {
    const timer = setInterval(() => plugin.activate(), intervalMs);
    this.scheduledPlugins.push({ plugin, interval: intervalMs, timer });
  }

  clearSchedules() {
    this.scheduledPlugins.forEach((s) => {
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
  // pluginManager.on('deviceHealthChange', (payload) => { ... });
  // pluginManager.emit({ type: 'deviceHealthChange', payload: { cpu: 90 } });
  // pluginManager.schedule(DeviceHealthReviewerPlugin, 60000); // every 60s
  // pluginManager.addAutomationRule({
  //   id: 'cpu-offload',
  //   description: 'Offload to cloud if CPU > 80%',
  //   trigger: (_event) => _event.type === 'deviceHealthChange' && _event.payload.cpu > 80,
  //   action: () => { /* offload logic */ },
  // });
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/plugins/PluginManager.ts -->
// QMOI Plugin Manager Stub

import React from "react";
import { DeviceHealthReviewerPlugin } from "./DeviceHealthReviewerPlugin";
import { OptimizationSuggestionPlugin } from "./OptimizationSuggestionPlugin";
import { AIReviewPlugin } from "./AIReviewPlugin";
import { QuickAIWidgetPlugin } from "./QuickAIWidgetPlugin";

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
    this.register(DeviceHealthReviewerPlugin);
    this.register(OptimizationSuggestionPlugin);
    this.register(AIReviewPlugin);
    this.register(QuickAIWidgetPlugin);
  }

  activateAll() {
    this.plugins.forEach((p) => p.activate());
  }

  deactivateAll() {
    this.plugins.forEach((p) => p.deactivate());
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
    (this.eventListeners[event.type] || []).forEach((fn) => fn(event.payload));
    this.automationRules.forEach((rule) => {
      if (rule.trigger(_event)) rule.action();
    });
  }

  schedule(plugin: QmoiPlugin, intervalMs: number) {
    const timer = setInterval(() => plugin.activate(), intervalMs);
    this.scheduledPlugins.push({ plugin, interval: intervalMs, timer });
  }

  clearSchedules() {
    this.scheduledPlugins.forEach((s) => {
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
  // pluginManager.on('deviceHealthChange', (payload) => { ... });
  // pluginManager.emit({ type: 'deviceHealthChange', payload: { cpu: 90 } });
  // pluginManager.schedule(DeviceHealthReviewerPlugin, 60000); // every 60s
  // pluginManager.addAutomationRule({
  //   id: 'cpu-offload',
  //   description: 'Offload to cloud if CPU > 80%',
  //   trigger: (_event) => _event.type === 'deviceHealthChange' && _event.payload.cpu > 80,
  //   action: () => { /* offload logic */ },
  // });
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/plugins/PluginManager.ts -->
// QMOI Plugin Manager Stub

import React from "react";
import { DeviceHealthReviewerPlugin } from "./DeviceHealthReviewerPlugin";
import { OptimizationSuggestionPlugin } from "./OptimizationSuggestionPlugin";
import { AIReviewPlugin } from "./AIReviewPlugin";
import { QuickAIWidgetPlugin } from "./QuickAIWidgetPlugin";

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
    this.register(DeviceHealthReviewerPlugin);
    this.register(OptimizationSuggestionPlugin);
    this.register(AIReviewPlugin);
    this.register(QuickAIWidgetPlugin);
  }

  activateAll() {
    this.plugins.forEach((p) => p.activate());
  }

  deactivateAll() {
    this.plugins.forEach((p) => p.deactivate());
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
    (this.eventListeners[event.type] || []).forEach((fn) => fn(event.payload));
    this.automationRules.forEach((rule) => {
      if (rule.trigger(_event)) rule.action();
    });
  }

  schedule(plugin: QmoiPlugin, intervalMs: number) {
    const timer = setInterval(() => plugin.activate(), intervalMs);
    this.scheduledPlugins.push({ plugin, interval: intervalMs, timer });
  }

  clearSchedules() {
    this.scheduledPlugins.forEach((s) => {
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
  // pluginManager.on('deviceHealthChange', (payload) => { ... });
  // pluginManager.emit({ type: 'deviceHealthChange', payload: { cpu: 90 } });
  // pluginManager.schedule(DeviceHealthReviewerPlugin, 60000); // every 60s
  // pluginManager.addAutomationRule({
  //   id: 'cpu-offload',
  //   description: 'Offload to cloud if CPU > 80%',
  //   trigger: (_event) => _event.type === 'deviceHealthChange' && _event.payload.cpu > 80,
  //   action: () => { /* offload logic */ },
  // });
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/plugins/PluginManager.ts -->
// QMOI Plugin Manager Stub

import React from "react";
import { DeviceHealthReviewerPlugin } from "./DeviceHealthReviewerPlugin";
import { OptimizationSuggestionPlugin } from "./OptimizationSuggestionPlugin";
import { AIReviewPlugin } from "./AIReviewPlugin";
import { QuickAIWidgetPlugin } from "./QuickAIWidgetPlugin";

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
    this.register(DeviceHealthReviewerPlugin);
    this.register(OptimizationSuggestionPlugin);
    this.register(AIReviewPlugin);
    this.register(QuickAIWidgetPlugin);
  }

  activateAll() {
    this.plugins.forEach((p) => p.activate());
  }

  deactivateAll() {
    this.plugins.forEach((p) => p.deactivate());
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
    (this.eventListeners[event.type] || []).forEach((fn) => fn(event.payload));
    this.automationRules.forEach((rule) => {
      if (rule.trigger(_event)) rule.action();
    });
  }

  schedule(plugin: QmoiPlugin, intervalMs: number) {
    const timer = setInterval(() => plugin.activate(), intervalMs);
    this.scheduledPlugins.push({ plugin, interval: intervalMs, timer });
  }

  clearSchedules() {
    this.scheduledPlugins.forEach((s) => {
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
  // pluginManager.on('deviceHealthChange', (payload) => { ... });
  // pluginManager.emit({ type: 'deviceHealthChange', payload: { cpu: 90 } });
  // pluginManager.schedule(DeviceHealthReviewerPlugin, 60000); // every 60s
  // pluginManager.addAutomationRule({
  //   id: 'cpu-offload',
  //   description: 'Offload to cloud if CPU > 80%',
  //   trigger: (_event) => _event.type === 'deviceHealthChange' && _event.payload.cpu > 80,
  //   action: () => { /* offload logic */ },
  // });
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/plugins/PluginManager.ts -->
// QMOI Plugin Manager Stub

import React from "react";
import { DeviceHealthReviewerPlugin } from "./DeviceHealthReviewerPlugin";
import { OptimizationSuggestionPlugin } from "./OptimizationSuggestionPlugin";
import { AIReviewPlugin } from "./AIReviewPlugin";
import { QuickAIWidgetPlugin } from "./QuickAIWidgetPlugin";

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
    this.register(DeviceHealthReviewerPlugin);
    this.register(OptimizationSuggestionPlugin);
    this.register(AIReviewPlugin);
    this.register(QuickAIWidgetPlugin);
  }

  activateAll() {
    this.plugins.forEach((p) => p.activate());
  }

  deactivateAll() {
    this.plugins.forEach((p) => p.deactivate());
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
    (this.eventListeners[event.type] || []).forEach((fn) => fn(event.payload));
    this.automationRules.forEach((rule) => {
      if (rule.trigger(_event)) rule.action();
    });
  }

  schedule(plugin: QmoiPlugin, intervalMs: number) {
    const timer = setInterval(() => plugin.activate(), intervalMs);
    this.scheduledPlugins.push({ plugin, interval: intervalMs, timer });
  }

  clearSchedules() {
    this.scheduledPlugins.forEach((s) => {
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
  // pluginManager.on('deviceHealthChange', (payload) => { ... });
  // pluginManager.emit({ type: 'deviceHealthChange', payload: { cpu: 90 } });
  // pluginManager.schedule(DeviceHealthReviewerPlugin, 60000); // every 60s
  // pluginManager.addAutomationRule({
  //   id: 'cpu-offload',
  //   description: 'Offload to cloud if CPU > 80%',
  //   trigger: (_event) => _event.type === 'deviceHealthChange' && _event.payload.cpu > 80,
  //   action: () => { /* offload logic */ },
  // });
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/plugins/PluginManager.ts -->
// QMOI Plugin Manager Stub

import React from "react";
import { DeviceHealthReviewerPlugin } from "./DeviceHealthReviewerPlugin";
import { OptimizationSuggestionPlugin } from "./OptimizationSuggestionPlugin";
import { AIReviewPlugin } from "./AIReviewPlugin";
import { QuickAIWidgetPlugin } from "./QuickAIWidgetPlugin";

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
    this.register(DeviceHealthReviewerPlugin);
    this.register(OptimizationSuggestionPlugin);
    this.register(AIReviewPlugin);
    this.register(QuickAIWidgetPlugin);
  }

  activateAll() {
    this.plugins.forEach((p) => p.activate());
  }

  deactivateAll() {
    this.plugins.forEach((p) => p.deactivate());
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
    (this.eventListeners[event.type] || []).forEach((fn) => fn(event.payload));
    this.automationRules.forEach((rule) => {
      if (rule.trigger(_event)) rule.action();
    });
  }

  schedule(plugin: QmoiPlugin, intervalMs: number) {
    const timer = setInterval(() => plugin.activate(), intervalMs);
    this.scheduledPlugins.push({ plugin, interval: intervalMs, timer });
  }

  clearSchedules() {
    this.scheduledPlugins.forEach((s) => {
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
  // pluginManager.on('deviceHealthChange', (payload) => { ... });
  // pluginManager.emit({ type: 'deviceHealthChange', payload: { cpu: 90 } });
  // pluginManager.schedule(DeviceHealthReviewerPlugin, 60000); // every 60s
  // pluginManager.addAutomationRule({
  //   id: 'cpu-offload',
  //   description: 'Offload to cloud if CPU > 80%',
  //   trigger: (_event) => _event.type === 'deviceHealthChange' && _event.payload.cpu > 80,
  //   action: () => { /* offload logic */ },
  // });
}
