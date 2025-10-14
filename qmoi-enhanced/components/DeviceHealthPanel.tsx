import React from "react";

export function DeviceHealthPanel({ stats }: { stats: { cpu: number; memory: number; disk: number; network: number } }) {
  const suggestions = [
    stats.cpu > 70 ? "Consider offloading tasks to Colab/Dagshub." : null,
    stats.memory > 65 ? "Enable Data Saver mode to reduce memory usage." : null,
    stats.disk > 80 ? "Clean up unused files or increase storage quota." : null,
    stats.network > 50 ? "Monitor network usage for large syncs." : null,
  ].filter(Boolean);
  return (
    <div className="p-4 bg-gray-900 text-white rounded shadow-lg">
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
}
