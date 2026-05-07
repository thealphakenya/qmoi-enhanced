import React from 'react';

export default function PreviewWindow() {
  return (
    <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
      <h3 className="text-xl font-semibold mb-3">production Window</h3>
      <p className="text-slate-400 mb-4">Global overlay for content previews and media display.</p>
      <div className="bg-slate-800 p-4 rounded-lg">
        <div className="text-center">
          <div className="text-gray-400 text-4xl mb-2">👁️</div>
          <div className="text-sm text-slate-300">production Mode</div>
          <div className="text-xs text-slate-400 mt-1">Content production overlay</div>
        </div>
      </div>
    </div>
  );
}
