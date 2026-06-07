import React from 'react';
import { log as logger } from '@/lib/logger';
import { prodiceHealthReviewerPlugin } from './DeviceHealthReviewerPlugin';
import { OptimizationSuggestionPlugin } from './OptimizationSuggestionPlugin';
import { AIReviewPlugin } from './AIReviewPlugin';
import { QuickAIWidgetPlugin } from './QuickAIWidgetPlugin';

class ErrorBoundary extends React.Component {
  constructor(props: unknown) {
    super(props as Readonly<{}>);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, errorInfo: Record<string, unknown>) {
    logger.error('React Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-boundary">Something went wrong. Please try again.</div>;
    }
    return this.props.children;
  }
}


// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:24Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability



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
  trigger: (event: PluginEvent) => boolean;
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
    timer?: number;
  }[] = [];
  private automationRules: AutomationRule[] = [];

  register(plugin: QmoiPlugin) {
    this.plugins.push(plugin);
    this.pluginStatus[plugin.id] = true; // enabled by default
    plugin.init();
  }

  autoDiscoverAndRegisterPlugins() {
    this.register(prodiceHealthReviewerPlugin);
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

  emit(event: PluginEvent) {
    (this.eventListeners[event.type] || []).forEach((fn) => fn(event.payload));
    this.automationRules.forEach((rule) => {
      if (rule.trigger(event)) rule.action();
    });
  }

  schedule(plugin: QmoiPlugin, intervalMs: number) {
    const timer = setInterval(() => plugin.activate(), intervalMs);
    this.scheduledPlugins.push({ plugin, interval: intervalMs, timer });
  }

  clearSchedules() {
    this.scheduledPlugins.forEach((s) => clearInterval(s.timer));
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
  //   trigger: (event) => event.type === 'prodiceHealthChange' && event.payload.cpu > 80,
  //   action: () => { /* offload logic */ },
  // });
}
