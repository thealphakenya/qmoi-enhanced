import React from "react";

export default function QVillagePage() {
  return (
    <main className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">QVillage</h1>
        <p className="text-slate-300 mb-8">Community-driven Data Management Platform</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4">Datasets</h2>
            <p className="text-slate-300">Manage, share, and analyze community datasets</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4">Models</h2>
            <p className="text-slate-300">Collaborative AI model development and deployment</p>
          </div>
        </div>
      </div>
    </main>
  );
}
