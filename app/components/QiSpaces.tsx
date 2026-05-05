import React from 'react';

export default function QiSpaces() {
  return (
    <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
      <h3 className="text-xl font-semibold mb-3">Qi Spaces</h3>
      <p className="text-slate-400 mb-4">Spatial workspace and community collaboration modules.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-800 p-4 rounded-lg">
          <div className="text-purple-400 text-2xl mb-2">🌌</div>
          <div className="text-sm text-slate-300">Quantum Space</div>
          <div className="text-xs text-slate-400 mt-1">AI-enhanced collaboration</div>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg">
          <div className="text-indigo-400 text-2xl mb-2">🔗</div>
          <div className="text-sm text-slate-300">Connected Networks</div>
          <div className="text-xs text-slate-400 mt-1">Multi-user spaces</div>
        </div>
      </div>
    </div>
  );
}