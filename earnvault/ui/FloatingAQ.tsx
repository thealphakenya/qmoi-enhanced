"use client";
import React, { useEffect, useState } from "react";
export default function FloatingAQ() {
  const [open, setOpen] = useState(true);
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const submitQuery = () => {
    if (!query.trim()) return;
    setHistory((prev) => [query.trim(), ...prev].slice(0, 10));
    setQuery("");
  };
  useEffect(() => {
    const timer = window.setInterval(() => {
      if (open) {
        setHistory((prev) => prev);
      }
    }, 60000);
    return () => window.clearInterval(timer);
  }, [open]);
  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 rounded-3xl border border-slate-200 bg-white shadow-2xl">
      <div className="flex items-center justify-between rounded-t-3xl bg-slate-900 px-4 py-3 text-white">
        <div className="text-sm font-semibold">Floating AQ</div>
        <button type="button" onClick={() => setOpen((prev) => !prev)} className="text-sm opacity-80 hover:opacity-100">
          {open ? "Hide" : "Show"}
        </button>
      </div>
      {open && (
        <div className="space-y-4 p-4">
          <div className="text-sm text-slate-600">Ask questions, inspect current AI status, or view recent activity.</div>
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900"
              placeholder="Type your query..."
            />
            <button type="button" onClick={submitQuery} className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
              Ask
            </button>
          </div>
          <div className="space-y-2 text-sm text-slate-700">
            {history.length === 0 ? (
              <div className="text-slate-500">No recent queries yet.</div>
            ) : (
              history.map((item, index) => (
                <div key={index} className="rounded-2xl bg-slate-100 p-3">
                  {item}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
