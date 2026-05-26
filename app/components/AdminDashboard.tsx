import React from "react";
export default function AdminDashboard() {
  return (
    <section className="rounded-3xl border border-slate-700 bg-slate-900 p-6">
      <h2 className="text-2xl font-semibold text-white mb-3">Admin Dashboard</h2>
      <p className="text-slate-400">Control center for administrative workflows, logging, and system health.</p>
      <div className="mt-5 rounded-2xl bg-slate-950 p-4 text-slate-300">Operational metrics and alerts will appear here.</div>
    </section>
  );
}
