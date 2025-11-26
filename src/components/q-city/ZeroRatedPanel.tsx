import React, { useState, useEffect } from "react";
import { useQMOIAuth } from "./QMOIStateProvider";

const fetchZeroRatedStatus = async () => {
  try {
    const res = await fetch("/api/qmoi/zerorated");
    if (!res.ok) throw new Error("no remote status");
    return await res.json();
  } catch (err) {
    // Fallback: local mock
    return {
      active: true,
      lastUsed: new Date().toLocaleString(),
      logs: [
        { time: new Date().toLocaleString(), event: "Zero-rated mode activated" },
        {
          time: new Date().toLocaleString(),
          event: "Fallback to Wikipedia proxy",
        },
      ],
    };
  }
};

export default function ZeroRatedPanel() {
  const { isMaster } = useQMOIAuth();
  const [status, setStatus] = useState({
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

  const toggleZeroRated = async (newActive: boolean) => {
    setLoading(true);
    try {
      const res = await fetch("/api/qmoi/zerorated", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: newActive }),
      });
      if (!res.ok) throw new Error("Failed to toggle zerorated");
      const data = await res.json();
      setStatus(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isMaster) return null;

  return (
    <div className="zero-rated-panel">
      <h2>ZeroRated QMOI (Master Only)</h2>
      {loading ? (
        <div>Loading status...</div>
      ) : (
        <>
          <div>
            Status: <b>{status.active ? "Active" : "Inactive"}</b>
          </div>
          <div>Last Used: {status.lastUsed}</div>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => toggleZeroRated(true)}
              className="px-2 py-1 bg-cyan-700 rounded text-white"
            >
              Activate
            </button>
            <button
              onClick={() => toggleZeroRated(false)}
              className="px-2 py-1 bg-gray-700 rounded text-white"
            >
              Deactivate
            </button>
            <button
              onClick={() => alert("Test endpoints (not implemented)")}
              className="px-2 py-1 bg-gray-700 rounded text-white"
            >
              Test Endpoints
            </button>
          </div>
          <h4>Logs</h4>
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
