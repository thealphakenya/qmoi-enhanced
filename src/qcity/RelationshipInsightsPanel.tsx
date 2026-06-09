"use client";
import React from "react";
export default function RelationshipInsightsPanel() {
  return (
    <div className="space-y-6 p-6 rounded-3xl border border-slate-200 bg-white shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">Relationship Insights</h2>
      <p className="text-sm text-slate-500">Track behavior, preferences, and how QMOI adapts to your interactions.</p>
      <ul className="list-disc space-y-2 pl-6 text-sm text-slate-600">
        <li>User progress and achievements</li>
        <li>Preference analysis</li>
        <li>Adaptive learning insights</li>
      </ul>
      <div className="rounded-3xl bg-slate-100 p-4 text-sm text-slate-700">Deep relationship insights keep QMOI aligned to your goals.</div>
    </div>
  );
}
