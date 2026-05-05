import React from 'react';

export default function QVillageDatasetsPanel() {
  return (
    <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
      <h3 className="text-xl font-semibold mb-3">QVillage Datasets Panel</h3>
      <p className="text-slate-400 mb-4">Community dataset catalogs, sharing tools, and AI model marketplace integration.</p>
      <div className="space-y-3">
        <div className="bg-slate-800 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-300">QMOI AI Conversations</span>
            <span className="text-green-400 text-sm">Free</span>
          </div>
          <div className="text-xs text-slate-400">1.2M chat interactions, anonymized</div>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-300">Device Performance Metrics</span>
            <span className="text-yellow-400 text-sm">$25</span>
          </div>
          <div className="text-xs text-slate-400">500K device logs, 6 months</div>
        </div>
      </div>
    </div>
  );
}