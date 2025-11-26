import React, { useEffect, useState } from "react";

export function GitStatus() {
  const [status, setStatus] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/git/status");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setStatus(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch git status");
      }
    };
    fetchStatus();
  }, []);

  return (
    <div className="p-2 border rounded bg-slate-900 text-sm">
      <h4 className="font-semibold">Git Status</h4>
      {error && <div className="text-red-400">{error}</div>}
      {!error && !status && <div className="text-gray-400">Loading…</div>}
      {status && (
        <div>
          <div>Branch: <b>{status.branch}</b></div>
          <div>Uncommitted: <b>{status.uncommitted || 0}</b></div>
          <div>Ahead: <b>{status.ahead || 0}</b></div>
        </div>
      )}
    </div>
  );
}

export default GitStatus;