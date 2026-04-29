import React from "react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">QMOI Enhanced</h1>
        <p className="text-slate-300 mb-8">Production-grade AI-powered platform with full automation capabilities.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-slate-700 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-white mb-2">Dashboard</h2>
            <p className="text-slate-300">Real-time system monitoring and analytics</p>
          </div>
          <div className="bg-slate-700 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-white mb-2">Automation</h2>
            <p className="text-slate-300">Advanced workflow automation and task scheduling</p>
          </div>
          <div className="bg-slate-700 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-white mb-2">Analytics</h2>
            <p className="text-slate-300">Comprehensive data analytics and reporting</p>
          </div>
        </div>
      </div>
    </main>
  );
}
