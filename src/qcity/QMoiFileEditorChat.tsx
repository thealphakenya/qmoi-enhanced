"use client";
import React, { useState } from "react";
export default function QMoiFileEditorChat() {
  const [command, setCommand] = useState("");
  const [output, setOutput] = useState<string | null>(null);
  const runCommand = () => {
    if (!command.trim()) return;
    setOutput(`Executed: ${command.trim()}`);
    setCommand("");
  };
  return (
    <div className="space-y-6 p-6 rounded-3xl border border-slate-200 bg-white shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">File Editor Chat</h2>
      <p className="text-sm text-slate-500">Use commands to inspect or update files in the editor.</p>
      <div className="space-y-3">
        <input
          type="text"
          value={command}
          onChange={(event) => setCommand(event.target.value)}
          className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
          placeholder="Enter command like /read or /edit"
        />
        <button
          type="button"
          onClick={runCommand}
          className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
        >
          Run Command
        </button>
      </div>
      {output && <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">{output}</div>}
    </div>
  );
}
