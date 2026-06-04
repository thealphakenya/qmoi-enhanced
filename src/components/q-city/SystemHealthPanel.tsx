"use client";
import React, { useEffect, useState } from "react";
import apiClient from "@/api/client";

export default function SystemHealthPanel(): any {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [uiHealth, setUiHealth] = useState<string>("Unknown");
  const [uiTestTime, setUiTestTime] = useState<string>("Never");
  const [uiTestRunning, setUiTestRunning] = useState(false);

  const fetchStatus = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get("/api/qmoi/status");
      const json = await res.json();
      setData(json);
    } catch (err: unknown) {
      setError((err as Error)?.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const runAllFixes = async (): Promise<void> => {
    setActionMsg("Running all fixes");
    await apiClient.post("/api/qmoi/fix/all", undefined, { headers: { "Content-Type": "application/json" } });
    setActionMsg("All fixes triggered. Refreshing status");
    setTimeout(fetchStatus, 3000);
  };

  const repairConnectivity = async (): Promise<void> => {
    setActionMsg("Repairing connectivity");
    await apiClient.post("/api/qmoi/fix/connectivity", undefined, { headers: { "Content-Type": "application/json" } });
    setActionMsg("Connectivity repair triggered. Refreshing status");
    setTimeout(fetchStatus, 3000);
  };

  const runUiHealthCheck = async (): Promise<void> => {
    setUiTestRunning(true);
    setActionMsg("Running UI health check");
    try {
      const res = await apiClient.post("/api/qmoi/ui-health-check", undefined, { headers: { "Content-Type": "application/json" } });
      const json = await res.json();
      setUiHealth(json.status || "Unknown");
      setUiTestTime(new Date().toLocaleString());
      setActionMsg("UI health check complete.");
    } catch (err: unknown) {
      setUiHealth("Error");
      setActionMsg("UI health check failed.");
    } finally {
      setUiTestRunning(false);
    }
  };

  const triggerUiSelfHealing = async (): Promise<void> => {
    setActionMsg("Triggering UI self-healing");
    await apiClient.post("/api/qmoi/fix/ui", undefined, { headers: { "Content-Type": "application/json" } });
    setActionMsg("UI self-healing triggered.");
    setTimeout(runUiHealthCheck, 3000);
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 20000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading system health</div>;
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
        <b>Status:</b> {data?.status}
      </p>
      <p>
        <b>Last Check:</b> {data?.last_check}
      </p>
      <div style={{ margin: "12px 0" }}>
        <button
          onClick={runAllFixes}
          style={{ marginRight: 8, background: "#0af", color: "#fff", padding: "6px 16px", borderRadius: 4 }}
        >
          Run All Fixes
        </button>
        <button
          onClick={repairConnectivity}
          style={{ background: "#0fa", color: "#222", padding: "6px 16px", borderRadius: 4 }}
        >
          Repair Connectivity
        </button>
        {actionMsg && <span style={{ marginLeft: 16, color: "#ff0" }}>{actionMsg}</span>}
      </div>
      <div>
        <h3>Pre-Activity</h3>
        <pre style={{ background: "#222", color: "#fff", padding: 8, borderRadius: 4, maxHeight: 200, overflowY: "auto" }}>
          {JSON.stringify(data?.preActivity, null, 2)}
        </pre>
        <h3>Connectivity Status</h3>
        <pre style={{ background: "#222", color: "#fff", padding: 8, borderRadius: 4, maxHeight: 200, overflowY: "auto" }}>
          {JSON.stringify(data?.connectivity, null, 2)}
        </pre>
        <h3>Cloud Status</h3>
        <pre style={{ background: "#222", color: "#fff", padding: 8, borderRadius: 4, maxHeight: 200, overflowY: "auto" }}>
          {JSON.stringify(data?.cloud, null, 2)}
        </pre>
        <div>
          <h3 className="font-semibold mb-2">UI Health Status</h3>
          <div>Status: {uiHealth}</div>
          <div>Last Test: {uiTestTime}</div>
          <button onClick={runUiHealthCheck} disabled={uiTestRunning} style={{ marginRight: 8 }}>
            {uiTestRunning ? "Running" : "Run UI Health Check"}
          </button>
          <button onClick={triggerUiSelfHealing}>Trigger UI Self-Healing</button>
        </div>
      </div>
    </div>
  );
}
