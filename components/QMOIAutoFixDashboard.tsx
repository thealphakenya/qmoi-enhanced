"use client";
import React, { useMemo, useState } from "react";
interface FixDetail {
  id: string;
  issue: string;
  status: "pending" | "running" | "completed" | "error";
}
const initialFixes: FixDetail[] = [
  { id: "fix-1", issue: "Repair broken data sync", status: "pending" },
  { id: "fix-2", issue: "Resolve deployment warnings", status: "completed" },
  { id: "fix-3", issue: "Validate asset integrity", status: "running" },
];
export default function QMOIAutoFixDashboard() {
  const [fixes, setFixes] = useState<FixDetail[]>(initialFixes);
  const [autoMode, setAutoMode] = useState(false);
  const summary = useMemo(
    () => ({
      total: fixes.length,
      completed: fixes.filter((item) => item.status === "completed").length,
      running: fixes.filter((item) => item.status === "running").length,
      pending: fixes.filter((item) => item.status === "pending").length,
    }),
    [fixes],
  );
  const toggleAutoMode = () => setAutoMode((prev) => !prev);
  const runFix = (id: string) => {
    setFixes((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "running" } : item,
      ),
    );
    setTimeout(() => {
      setFixes((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: "completed" } : item,
        ),
      );
    }, 1000);
  };
  return (
    <div className="space-y-6 p-6 bg-slate-50 rounded-3xl border border-slate-200 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">QMOI Auto-Fix Dashboard</h2>
          <p className="text-sm text-slate-500">Monitor and manage automatic issue remediation tasks.</p>
        </div>
        <button
          type="button"
          onClick={toggleAutoMode}
          className={`rounded-2xl px-4 py-2 text-sm font-semibold text-white ${autoMode ? "bg-emerald-600" : "bg-slate-900"}`}
        >
          {autoMode ? "Auto-Fix Enabled" : "Enable Auto-Fix"}
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Total fixes</p>
          <div className="mt-2 text-3xl font-semibold text-slate-900">{summary.total}</div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Completed</p>
          <div className="mt-2 text-3xl font-semibold text-emerald-700">{summary.completed}</div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Active</p>
          <div className="mt-2 text-3xl font-semibold text-amber-600">{summary.running}</div>
        </div>
      </div>
      <div className="space-y-4">
        {fixes.map((fix) => (
          <div key={fix.id} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-sm font-medium text-slate-900">{fix.issue}</div>
                <div className="text-xs text-slate-500">Status: {fix.status}</div>
              </div>
              <button
                type="button"
                onClick={() => runFix(fix.id)}
                disabled={fix.status === "running" || fix.status === "completed"}
                className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                {fix.status === "completed" ? "Done" : "Run Fix"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
