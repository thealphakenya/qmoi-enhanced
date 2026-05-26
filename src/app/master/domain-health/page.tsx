"use client";
import React from "react";
export default function Page() {
  return (
    <main className="p-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Domain Health</h1>
        <p className="mt-2 text-sm text-slate-500">Review acquisition targets and health indicators for your domain network.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-sm text-slate-500">Acquisition available</div>
            <div className="mt-2 text-xl font-semibold text-slate-900">Yes</div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-sm text-slate-500">Estimated cost</div>
            <div className="mt-2 text-xl font-semibold text-emerald-700">$4,200</div>
          </div>
        </div>
      </div>
    </main>
  );
}
