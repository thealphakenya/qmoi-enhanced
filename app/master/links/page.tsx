import React from "react";

export default function MasterLinksPage() {
  return (
    <main className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Master Links</h1>
        <p className="text-slate-300 mb-8">Manage global links and routing</p>
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <h2 className="text-xl font-bold text-white mb-4">Global Links</h2>
          <div className="text-slate-400">No links configured</div>
        </div>
      </div>
    </main>
  );
}
