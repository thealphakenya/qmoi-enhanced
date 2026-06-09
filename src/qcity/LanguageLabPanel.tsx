"use client";
import React from "react";
export default function LanguageLabPanel() {
  return (
    <div className="space-y-6 p-6 rounded-3xl border border-slate-200 bg-white shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">Language Lab</h2>
      <p className="text-sm text-slate-500">Practice multilingual chat and speech features with QMOI.</p>
      <ul className="list-disc space-y-2 pl-6 text-sm text-slate-600">
        <li>Multilingual chat and speech</li>
        <li>Text-to-speech and speech-to-text</li>
        <li>Translation and pronunciation guides</li>
      </ul>
      <div className="rounded-3xl bg-slate-100 p-4 text-sm text-slate-700">Language learning and communication tools are available in this lab.</div>
    </div>
  );
}
