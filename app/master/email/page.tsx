import React from "react";

export default function MasterEmailPage() {
  return (
    <main className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Master Email Configuration</h1>
        <p className="text-slate-300 mb-8">Configure global email settings and templates</p>
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <h2 className="text-xl font-bold text-white mb-4">Email Settings</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">SMTP Server</label>
              <input type="text" className="w-full bg-slate-700 text-white px-4 py-2 rounded border border-slate-600" placeholder="smtp.${EXAMPLE_HOST}" />
            </div>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition">Save</button>
          </form>
        </div>
      </div>
    </main>
  );
}
