import React from 'react';

export default function FloatingPreviewWindow() {
  return (
    <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
      <h3 className="text-xl font-semibold mb-3">Floating production Window</h3>
      <p className="text-slate-400 mb-4">Dynamic production overlay for content and data visualization.</p>
      <div className="bg-slate-800 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <span className="text-slate-300 text-sm">production Mode</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded text-xs">Minimize</button>
            <button className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded text-xs">Maximize</button>
            <button className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs">Close</button>
          </div>
        </div>
        <div className="bg-slate-700 p-4 rounded border-2 border-dashed border-slate-600 text-center">
          <div className="text-slate-400 text-sm">production Content Area</div>
          <div className="mt-2 text-xs text-slate-500">Dynamic content will be displayed here</div>
        </div>
      </div>
    </div>
  );
}
