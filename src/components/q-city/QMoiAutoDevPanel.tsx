"use client";
import React, { useState } from "react";
const sampleLogs = [
  { timestamp: "09:12", action: "Auto-fix started" },
  { timestamp: "09:15", action: "CI/CD pipeline triggered" },
];
export default function QMoiAutoDevPanel() {
  const [logs] = useState(sampleLogs);
  return (
    <div className="space-y-6 p-6 rounded-3xl border border-slate-200 bg-white shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">AutoDev Panel</h2>
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
        {logs.length === 0 ? (
          <div className="text-sm text-slate-500">No logs available.</div>
        ) : (
          <div className="space-y-3">
            {logs.map((log, index) => (
              <div key={index} className="rounded-2xl bg-white p-3 text-sm text-slate-700">
                <div className="font-medium text-slate-900">{log.action}</div>
                <div className="text-slate-500">{log.timestamp}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
