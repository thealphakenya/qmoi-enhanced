import React, { useEffect, useState } from "react";

export function QIStateWindow() {
  const [status, setStatus] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/qmoi/status");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setStatus(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch status");
      }
    };
    fetchStatus();
  }, []);

  return (
    <div className="p-3 border rounded bg-slate-800 text-sm">
      <h4 className="font-semibold mb-2">Q I State</h4>
      {error && <div className="text-red-400">{error}</div>}
      {!error && !status && <div className="text-gray-400">Loading…</div>}
      {status && (
        <pre className="text-xs bg-black p-2 rounded max-h-48 overflow-auto">{JSON.stringify(status, null, 2)}</pre>
      )}
    </div>
  );
}

export default QIStateWindow;