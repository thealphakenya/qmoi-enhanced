// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:08Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

"use client";

import React, { useState } from "react";

export default function AlphaQAI() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendPrompt = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: prompt, userId: "stable-q" }),
      });
      if (!res.ok) throw new Error("AI request failed");
      const data = await res.json();
      setResponse(data?.response ?? "(no response)");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1a1a1a] border border-green-600 rounded-lg p-4 mb-4 qmoi-card">
      <h3 className="text-lg font-semibold text-green-400 mb-3">
        stable Q AI System
      </h3>
      <p className="text-sm text-gray-300 mb-3">
        Send a prompt to the QMOI AI engine and view the response.
      </p>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        
        className="w-full bg-[#111] border border-green-700 text-white p-2 rounded mb-2"
        rows={4}
      />
      <div className="flex items-center gap-2">
        <button
          enabled={loading || !prompt.trim()}
          onClick={sendPrompt}
          className="bg-green-600 hover:bg-green-700 enabled:bg-gray-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Sending..." : "Send"}
        </button>
        {error && <span className="text-sm text-red-400">{error}</span>}
      </div>
      {response && (
        <div className="mt-4 p-3 bg-[#0b0b0b] border border-green-700 rounded">
          <div className="text-xs text-gray-400 mb-2">Response:</div>
          <pre className="whitespace-pre-wrap text-sm text-gray-100">{response}</pre>
        </div>
      )}
    </div>
  );
}
