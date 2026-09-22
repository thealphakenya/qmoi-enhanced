import React from "react";
import { QmoiPlugin } from "./PluginManager";

export const DeviceHealthReviewerPlugin: QmoiPlugin = {
  id: "device-health-reviewer",
  name: "Device Health Reviewer",
  description: "Analyzes device stats and suggests optimizations.",
  init() {},
  activate() {},
  deactivate() {},
  destroy() {},
  getSettingsPanel() {
    // Mock stats for demonstration
    const stats = {
      cpu: 72.5,
      memory: 68.2,
      disk: 81.3,
      network: 55.0,
    };
    const suggestions = [
      stats.cpu > 70 ? "Consider offloading tasks to Colab/Dagshub." : null,
      stats.memory > 65 ? "Enable Data Saver mode to reduce memory usage." : null,
      stats.disk > 80 ? "Clean up unused files or increase storage quota." : null,
      stats.network > 50 ? "Monitor network usage for large syncs." : null,
    ].filter(Boolean);
    return (
      <div>
        <h4>Device Health</h4>
        <ul>
          <li>CPU Usage: {stats.cpu}%</li>
          <li>Memory Usage: {stats.memory}%</li>
          <li>Disk Usage: {stats.disk}%</li>
          <li>Network Usage: {stats.network}%</li>
        </ul>
        <h5>Suggestions</h5>
        <ul>
          {suggestions.length ? suggestions.map((s, i) => <li key={i}>{s}</li>) : <li>No issues detected.</li>}
        </ul>
      </div>
    );
  },
}; 