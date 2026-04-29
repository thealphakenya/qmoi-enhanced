import React from "react";

export default function DevPage() {
  return (
    <main className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-6">Developer Utilities</h1>
        <p className="text-slate-300 mb-8">Launch internal tools, diagnostics, and development helpers safely.</p>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-900 p-6 border border-slate-700">
            <h2 className="text-lg font-semibold text-white mb-3">API Endpoint Tester</h2>
            <p className="text-slate-400">Validate internal API endpoints without exposing production traffic.</p>
          </div>
          <div className="rounded-2xl bg-slate-900 p-6 border border-slate-700">
            <h2 className="text-lg font-semibold text-white mb-3">Debug Console</h2>
            <p className="text-slate-400">Review logs, diagnostics, and runtime health checks from this workspace.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
