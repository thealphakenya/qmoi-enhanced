import React, { useEffect, useState } from "react";

export default function SystemHealthPanel() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [uiHealth, setUiHealth] = useState<string>("Unknown");
  const [uiTestTime, setUiTestTime] = useState<string>("Never");
  const [uiTestRunning, setUiTestRunning] = useState(false);

  async function fetchStatus() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/qmoi/status");
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  async function runAllFixes() {
    setActionMsg("Running all fixes...");
    await fetch("/api/qmoi/fix/all", { method: "POST" });
    setActionMsg("All fixes triggered. Refreshing status...");
    setTimeout(fetchStatus, 3000);
  }

  async function repairConnectivity() {
    setActionMsg("Repairing connectivity...");
    await fetch("/api/qmoi/fix/connectivity", { method: "POST" });
    setActionMsg("Connectivity repair triggered. Refreshing status...");
    setTimeout(fetchStatus, 3000);
  }

  async function runUiHealthCheck() {
    setUiTestRunning(true);
    setActionMsg("Running UI health check...");
    try {
      const res = await fetch("/api/qmoi/ui-health-check", { method: "POST" });
      const json = await res.json();
      setUiHealth(json.status || "Unknown");
      setUiTestTime(new Date().toLocaleString());
      setActionMsg("UI health check complete.");
    } catch (err) {
      setUiHealth("Error");
      setActionMsg("UI health check failed.");
    } finally {
      setUiTestRunning(false);
    }
  }

  async function triggerUiSelfHealing() {
    setActionMsg("Triggering UI self-healing...");
    await fetch("/api/qmoi/fix/ui", { method: "POST" });
    setActionMsg("UI self-healing triggered.");
    setTimeout(runUiHealthCheck, 3000);
  }

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 20000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading system health...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  return (
    <div
      style={{
        border: "1px solid #444",
        borderRadius: 8,
        padding: 16,
        background: "#181818",
        color: "#e0ffe0",
      }}
    >
      <h2>QMOI System Health</h2>
      <p>
        <b>Status:</b> {data.status}
      </p>
      <p>
        <b>Last Check:</b> {data.last_check}
      </p>
      <div style={{ margin: "12px 0" }}>
        <button
          onClick={runAllFixes}
          style={{
            marginRight: 8,
            background: "#0af",
            color: "#fff",
            padding: "6px 16px",
            borderRadius: 4,
          }}
        >
          Run All Fixes
        </button>
        <button
          onClick={repairConnectivity}
          style={{
            background: "#0fa",
            color: "#222",
            padding: "6px 16px",
            borderRadius: 4,
          }}
        >
          Repair Connectivity
        </button>
        {actionMsg && (
          <span style={{ marginLeft: 16, color: "#ff0" }}>{actionMsg}</span>
        )}
      </div>
      <h3>Pre-Activity Check</h3>
      <pre
        style={{
          background: "#222",
          color: "#fff",
          padding: 8,
          borderRadius: 4,
          maxHeight: 200,
          overflowY: "auto",
        }}
      >
        {JSON.stringify(data.preActivity, null, 2)}
      </pre>
      <h3>Connectivity Status</h3>
      <pre
        style={{
          background: "#222",
          color: "#fff",
          padding: 8,
          borderRadius: 4,
          maxHeight: 200,
          overflowY: "auto",
        }}
      >
        {JSON.stringify(data.connectivity, null, 2)}
      </pre>
      <h3>Cloud Status</h3>
      <pre
        style={{
          background: "#222",
          color: "#fff",
          padding: 8,
          borderRadius: 4,
          maxHeight: 200,
          overflowY: "auto",
        }}
      >
        {JSON.stringify(data.cloud, null, 2)}
      </pre>
      <div>
        <h3 className="font-semibold mb-2">UI Health Status</h3>
        <div>Status: {uiHealth}</div>
        <div>Last Test: {uiTestTime}</div>
        <button
          onClick={runUiHealthCheck}
          disabled={uiTestRunning}
          style={{ marginRight: 8 }}
        >
          {uiTestRunning ? "Running..." : "Run UI Health Check"}
        </button>
        <button onClick={triggerUiSelfHealing}>Trigger UI Self-Healing</button>
      </div>
    </div>
  );
}
