"use client";
import React, { useEffect, useState } from "react";

interface ZeroRatedStatus {
  active: boolean;
  lastUsed: string;
  logs: Array<{ time: string; event: string }>;
}

const fetchZeroRatedStatus = async (): Promise<ZeroRatedStatus> => {
  return {
    active: true,
    lastUsed: new Date().toLocaleString(),
    logs: [
      { time: new Date().toLocaleString(), event: "Zero-rated mode activated" },
      { time: new Date().toLocaleString(), event: "Fallback to Wikipedia proxy" },
    ],
  };
};

export default function ZeroRatedPanel({ isMaster = true }: { isMaster?: boolean }) {
  const [status, setStatus] = useState<ZeroRatedStatus>({
    active: false,
    lastUsed: "",
    logs: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchZeroRatedStatus().then((data) => {
      setStatus(data);
      setLoading(false);
    });
  }, []);

  if (!isMaster) return null;

  return (
    <div className="zero-rated-panel" style={{ padding: 16, borderRadius: 12, background: "#0f172a", color: "#e2e8f0" }}>
      <h2>ZeroRated QMOI (Master Only)</h2>
      {loading ? (
        <div>Loading status...</div>
      ) : (
        <>
          <div>
            Status: <strong>{status.active ? "Active" : "Inactive"}</strong>
          </div>
          <div>Last Used: {status.lastUsed}</div>
          <div style={{ marginTop: 12, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => alert("Zero-rated mode forced")}
              style={{ padding: "8px 16px", borderRadius: 8, background: "#2563eb", color: "white", border: "none" }}
            >
              Force ZeroRated Mode
            </button>
            <button
              type="button"
              onClick={() => alert("Test endpoints triggered")}
              style={{ padding: "8px 16px", borderRadius: 8, background: "#10b981", color: "white", border: "none" }}
            >
              Test Endpoints
            </button>
          </div>
          <h4 style={{ marginTop: 16 }}>Logs</h4>
          <ul>
            {status.logs.map((log, i) => (
              <li key={i}>
                {log.time}: {log.event}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
