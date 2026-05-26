"use client";

import { useState } from "react";

export default function StableQAI() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendPrompt = async () => {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: trimmedPrompt, userId: "latest-q" }),
      });

      const data = await res.json();
      setResponse(data?.response ?? "(no response)");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1a1a1a] border border-green-600 rounded-lg p-4 mb-4 qmoi-card">
      <h3 className="text-lg font-semibold text-green-400 mb-3">
        latest Q AI System
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
          disabled={loading || !prompt.trim()}
          onClick={sendPrompt}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Sending" : "Send"}
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
