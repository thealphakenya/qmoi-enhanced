import React, { useEffect, useState } from "react";

function exportToCSV(logs: any[]) {
  const header = "Timestamp,Action,Result\n";
  const rows = logs
    .map(
      (log) =>
        `"${log.timestamp}","${log.action}","${log.result.replace(/"/g, '""')}"`,
    )
    .join("\n");
  const csv = header + rows;
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "qmoi_audit_log.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function exportToJSON(logs: any[]) {
  const blob = new Blob([JSON.stringify(logs, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "qmoi_audit_log.json";
  a.click();
  URL.revokeObjectURL(url);
}

const DEPLOY_PLATFORMS = [
  { value: "vercel", label: "Vercel" },
  { value: "heroku", label: "Heroku" },
  { value: "aws", label: "AWS" },
  { value: "azure", label: "Azure" },
  { value: "gcp", label: "GCP" },
];

export default function QMoiAutoDevPanel({
  isMaster = false,
}: {
  isMaster?: boolean;
}) {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [daemonAction, setDaemonAction] = useState<"start" | "stop" | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logFilter, setLogFilter] = useState<"all" | "fix" | "cicd">("all");
  const [deployPlatform, setDeployPlatform] = useState("vercel");
  const [forceRunLoading, setForceRunLoading] = useState(false);
  const [forceRunResult, setForceRunResult] = useState<any>(null);

  async function fetchStatus() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/qmoi/autodev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "full_status" }),
      });
      const data = await res.json();
      setStatus(data);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }

  async function handleDaemonControl(action: "start" | "stop") {
    setDaemonAction(action);
    setError(null);
    try {
      const res = await fetch("/api/qmoi/autodev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action:
            action === "start"
              ? "continuous_autofix_start"
              : "continuous_autofix_stop",
        }),
      });
      const data = await res.json();
      setStatus((prev: any) => ({
        ...prev,
        daemon: data.status,
        running: data.status?.running,
      }));
    } catch (e: any) {
      setError(e.message);
    }
    setDaemonAction(null);
  }

  async function fetchLogs() {
    setLogsLoading(true);
    setError(null);
    try {
      if (status?.lastResult?.fixResults) {
        const logEntries = [];
        if (status.lastResult.fixResults.length > 0) {
          status.lastResult.fixResults.forEach((fix: any, idx: number) => {
            logEntries.push({
              timestamp: status.lastRun,
              action: `Fix Cycle #${idx + 1}`,
              type: "fix",
              result: JSON.stringify(fix, null, 2),
            });
          });
        }
        if (status.lastResult.cicdResults) {
          logEntries.push({
            timestamp: status.lastRun,
            action: "CI/CD",
            type: "cicd",
            result: JSON.stringify(status.lastResult.cicdResults, null, 2),
          });
        }
        setLogs(logEntries.slice(-20));
      } else {
        setLogs([]);
      }
    } catch (e: any) {
      setError(e.message);
    }
    setLogsLoading(false);
  }

  async function handleForceRun() {
    setForceRunLoading(true);
    setError(null);
    setForceRunResult(null);
    try {
      const res = await fetch("/api/qmoi/autodev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "force_run", platform: deployPlatform }),
      });
      const data = await res.json();
      setForceRunResult(data);
      fetchStatus();
      fetchLogs();
    } catch (e: any) {
      setError(e.message);
    }
    setForceRunLoading(false);
  }

  useEffect(() => {
    if (isMaster) fetchStatus();
  }, [isMaster]);
  useEffect(() => {
    if (isMaster) fetchLogs();
  }, [status]);

  if (!isMaster) return null;

  // Filtering logic
  const filteredLogs = logs.filter((log) => {
    if (logFilter === "all") return true;
    if (logFilter === "fix") return log.type === "fix";
    if (logFilter === "cicd") return log.type === "cicd";
    return true;
  });

  return (
    <div
      style={{
        border: "1px solid #444",
        padding: 16,
        borderRadius: 8,
        background: "#181818",
        color: "#e0ffe0",
        marginTop: 16,
      }}
    >
      <h3>QMOI Auto-Dev Project Manager</h3>
      <div
        style={{
          marginBottom: 12,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <button
          onClick={fetchStatus}
          style={{
            background: "#222",
            color: "#0f0",
            border: "1px solid #0f0",
            borderRadius: 4,
            padding: "4px 12px",
          }}
        >
          Refresh Status
        </button>
        {status?.running ? (
          <button
            onClick={() => handleDaemonControl("stop")}
            disabled={daemonAction === "stop"}
            style={{
              background: "#f33",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              padding: "4px 12px",
            }}
          >
            {daemonAction === "stop" ? "Stopping..." : "Stop Daemon"}
          </button>
        ) : (
          <button
            onClick={() => handleDaemonControl("start")}
            disabled={daemonAction === "start"}
            style={{
              background: "#0f0",
              color: "#111",
              border: "none",
              borderRadius: 4,
              padding: "4px 12px",
            }}
          >
            {daemonAction === "start" ? "Starting..." : "Start Daemon"}
          </button>
        )}
        <label style={{ marginLeft: 16, color: "#ccc" }}>
          Deploy Platform:
        </label>
        <select
          value={deployPlatform}
          onChange={(e) => setDeployPlatform(e.target.value)}
          style={{
            background: "#111",
            color: "#0ff",
            border: "1px solid #0ff",
            borderRadius: 4,
            padding: "2px 8px",
          }}
        >
          {DEPLOY_PLATFORMS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
        <button
          onClick={handleForceRun}
          disabled={forceRunLoading}
          style={{
            background: "#09f",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            padding: "4px 16px",
            fontWeight: 600,
          }}
        >
          {forceRunLoading ? "Running..." : "Force Run"}
        </button>
      </div>
      {forceRunResult && (
        <div
          style={{
            background: "#222",
            color: forceRunResult.success ? "#0f0" : "#f33",
            padding: 8,
            borderRadius: 6,
            marginBottom: 8,
          }}
        >
          <b>Force Run Result:</b> {forceRunResult.message}
          {forceRunResult.platform && (
            <span style={{ marginLeft: 8, color: "#0ff" }}>
              ({forceRunResult.platform})
            </span>
          )}
        </div>
      )}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "#f66" }}>{error}</p>
      ) : (
        <div style={{ background: "#222", padding: 12, borderRadius: 8 }}>
          <div>
            <b>Daemon Running:</b>{" "}
            {status?.running ? (
              <span style={{ color: "#0f0" }}>Yes</span>
            ) : (
              <span style={{ color: "#f33" }}>No</span>
            )}
          </div>
          <div>
            <b>Last Run:</b> {status?.lastRun || "N/A"}
          </div>
          <div style={{ marginTop: 8 }}>
            <b>Last Result:</b>
          </div>
          {status?.lastResult ? (
            <div
              style={{
                fontSize: "0.95em",
                background: "#181818",
                padding: 8,
                borderRadius: 6,
                marginBottom: 8,
              }}
            >
              <div>
                <b>Errors:</b> {status.lastResult.errors?.length || 0}
              </div>
              <div>
                <b>Test Result:</b>{" "}
                {status.lastResult.testResult?.success ? (
                  <span style={{ color: "#0f0" }}>Passed</span>
                ) : (
                  <span style={{ color: "#f33" }}>Failed</span>
                )}
              </div>
              <div>
                <b>Commit/Push:</b>{" "}
                {status.lastResult.cicdResults?.commitResult?.success ? (
                  <span style={{ color: "#0f0" }}>Success</span>
                ) : (
                  <span style={{ color: "#f33" }}>Failed</span>
                )}{" "}
                {status.lastResult.cicdResults?.commitResult?.message && (
                  <span style={{ color: "#ccc", marginLeft: 8 }}>
                    {status.lastResult.cicdResults?.commitResult?.message}
                  </span>
                )}
              </div>
              <div>
                <b>Deploy:</b>{" "}
                {status.lastResult.cicdResults?.deployResult?.success ? (
                  <span style={{ color: "#0f0" }}>Success</span>
                ) : (
                  <span style={{ color: "#f33" }}>Failed</span>
                )}{" "}
                {status.lastResult.cicdResults?.deployResult?.message && (
                  <span style={{ color: "#ccc", marginLeft: 8 }}>
                    {status.lastResult.cicdResults?.deployResult?.message}
                  </span>
                )}
              </div>
              <div>
                <b>Monitor:</b>{" "}
                {status.lastResult.cicdResults?.monitorResult?.success ? (
                  <span style={{ color: "#0f0" }}>Healthy</span>
                ) : (
                  <span style={{ color: "#f33" }}>Unhealthy</span>
                )}{" "}
                {status.lastResult.cicdResults?.monitorResult?.message && (
                  <span style={{ color: "#ccc", marginLeft: 8 }}>
                    {status.lastResult.cicdResults?.monitorResult?.message}
                  </span>
                )}
              </div>
              <div style={{ marginTop: 8 }}>
                <b>Fix Results:</b>
                <pre
                  style={{
                    background: "#111",
                    color: "#0ff",
                    borderRadius: 4,
                    padding: 8,
                    overflowX: "auto",
                  }}
                >
                  {JSON.stringify(status.lastResult.fixResults, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <div style={{ color: "#888" }}>No recent results.</div>
          )}
        </div>
      )}
      <div style={{ marginTop: 24 }}>
        <h4>Audit Log / History</h4>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 8,
          }}
        >
          <button
            onClick={fetchLogs}
            style={{
              background: "#222",
              color: "#0ff",
              border: "1px solid #0ff",
              borderRadius: 4,
              padding: "2px 10px",
            }}
          >
            Refresh Logs
          </button>
          <button
            onClick={() => exportToCSV(filteredLogs)}
            style={{
              background: "#222",
              color: "#ff0",
              border: "1px solid #ff0",
              borderRadius: 4,
              padding: "2px 10px",
            }}
          >
            Export CSV
          </button>
          <button
            onClick={() => exportToJSON(filteredLogs)}
            style={{
              background: "#222",
              color: "#0f0",
              border: "1px solid #0f0",
              borderRadius: 4,
              padding: "2px 10px",
            }}
          >
            Export JSON
          </button>
          <label style={{ marginLeft: 16, color: "#ccc" }}>Filter: </label>
          <select
            value={logFilter}
            onChange={(e) => setLogFilter(e.target.value as any)}
            style={{
              background: "#111",
              color: "#0ff",
              border: "1px solid #0ff",
              borderRadius: 4,
              padding: "2px 8px",
            }}
          >
            <option value="all">All</option>
            <option value="fix">Fix Cycles</option>
            <option value="cicd">CI/CD</option>
          </select>
        </div>
        {logsLoading ? (
          <div style={{ color: "#ff0" }}>Loading logs...</div>
        ) : (
          <div
            style={{
              maxHeight: 220,
              overflowY: "auto",
              background: "#181818",
              border: "1px solid #333",
              borderRadius: 6,
              padding: 8,
            }}
          >
            {filteredLogs.length === 0 ? (
              <div style={{ color: "#888" }}>No logs available.</div>
            ) : (
              filteredLogs.map((log, i) => (
                <div
                  key={i}
                  style={{
                    marginBottom: 10,
                    borderBottom: "1px solid #333",
                    paddingBottom: 6,
                  }}
                >
                  <div style={{ color: "#0ff", fontSize: "0.95em" }}>
                    <b>{log.timestamp}</b>{" "}
                    <span style={{ color: "#fff" }}>{log.action}</span>
                  </div>
                  <pre
                    style={{
                      background: "#111",
                      color: "#eee",
                      borderRadius: 4,
                      padding: 6,
                      marginTop: 2,
                      fontSize: "0.92em",
                      overflowX: "auto",
                    }}
                  >
                    {log.result}
                  </pre>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
