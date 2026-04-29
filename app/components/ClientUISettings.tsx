import React from "react";

export default function ClientUISettings() {
  return (
    <section className="rounded-3xl border border-slate-700 bg-slate-900 p-6">
      <h2 className="text-2xl font-semibold text-white mb-3">Client UI Settings</h2>
      <p className="text-slate-400">Adjust the interface theme, layout density, and accessibility settings.</p>
      <div className="mt-5 space-y-3 text-slate-300">
        <div className="rounded-2xl bg-slate-950 p-4">Theme: Dark</div>
        <div className="rounded-2xl bg-slate-950 p-4">Font size: Medium</div>
      </div>
    </section>
  );
}
