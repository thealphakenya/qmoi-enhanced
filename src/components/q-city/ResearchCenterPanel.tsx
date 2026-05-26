"use client";
import React from "react";
export default function ResearchCenterPanel() {
  return (
    <div className="space-y-6 p-6 rounded-3xl border border-slate-200 bg-white shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">Research Center</h2>
      <p className="text-sm text-slate-500">Search, validate, and explore research insights from QMOI.</p>
      <ul className="list-disc space-y-2 pl-6 text-sm text-slate-600">
        <li>Research and verification workflows</li>
        <li>Fact checking and citations</li>
        <li>Opportunity discovery tools</li>
      </ul>
      <div className="rounded-3xl bg-slate-100 p-4 text-sm text-slate-700">Access research resources and verification data from one place.</div>
    </div>
  );
}
