import React, { useState, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";

// QCity SelfHealPanel: Admin-only panel to trigger and view results of the NPM self-healing script via the backend API. Integrate into Dashboard for enterprise automation and troubleshooting.
// Usage: <SelfHealPanel />
// Only visible to admin/master roles.

const API_URL = "/api/qcity/selfheal-npm";

const SelfHealPanel: React.FC = () => {
  const { user, loading } = useAuth();
  const [running, setRunning] = useState(false);
  const [log, setLog] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [options, setOptions] = useState({
    forceClean: false,
    essentialsOnly: false,
    diagnosticsOnly: false,
  });
  const [history, setHistory] = useState<any[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("selfHealHistory") || "[]");
    } catch {
      return [];
    }
  });
  const eventSourceRef = useRef<EventSource | null>(null);

  const handleSelfHeal = async () => {
    setRunning(true);
    setLog("");
    setError(null);
    setSuccess(null);
    try {
      const token = localStorage.getItem("jwtToken");
      const es = new EventSource(
        API_URL +
          "?token=" +
          encodeURIComponent(token) +
          "&opts=" +
          encodeURIComponent(JSON.stringify(options)),
      );
      eventSourceRef.current = es;
      let logBuffer = "";
      es.onmessage = (event) => {
        if (event.data === "[DONE]") {
          es.close();
          setRunning(false);
          setSuccess(!logBuffer.includes("[ERROR]"));
          const entry = {
            ts: new Date().toISOString(),
            log: logBuffer,
            options,
          };
          const newHistory = [entry, ...history].slice(0, 10);
          setHistory(newHistory);
          localStorage.setItem("selfHealHistory", JSON.stringify(newHistory));
        } else {
          logBuffer += event.data + "\n";
          setLog(logBuffer);
        }
      };
      es.onerror = (e) => {
        setError("Stream error");
        setRunning(false);
        es.close();
      };
    } catch (err: any) {
      setError(err.message || "Request failed");
      setSuccess(false);
      setRunning(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([log], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "qcity_npm_selfheal.log";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleOptionChange = (opt: string) => {
    setOptions((prev) => ({ ...prev, [opt]: !prev[opt] }));
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem("selfHealHistory");
  };

  // Scheduling UI (placeholder)
  const handleSchedule = () => {
    alert("Scheduling feature coming soon!");
  };

  if (loading) return <div>Loading...</div>;
  if (!user || (user.role !== "admin" && user.role !== "master")) return null;

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: 8,
        padding: 16,
        margin: 16,
      }}
    >
      <h3>QCity NPM Self-Heal</h3>
      <div style={{ marginBottom: 8 }}>
        <label>
          <input
            type="checkbox"
            checked={options.forceClean}
            onChange={() => handleOptionChange("forceClean")}
          />{" "}
          Force Clean
        </label>
        <label style={{ marginLeft: 12 }}>
          <input
            type="checkbox"
            checked={options.essentialsOnly}
            onChange={() => handleOptionChange("essentialsOnly")}
          />{" "}
          Essentials Only
        </label>
        <label style={{ marginLeft: 12 }}>
          <input
            type="checkbox"
            checked={options.diagnosticsOnly}
            onChange={() => handleOptionChange("diagnosticsOnly")}
          />{" "}
          Diagnostics Only
        </label>
      </div>
      <button
        onClick={handleSelfHeal}
        disabled={running}
        style={{ padding: "8px 16px", fontWeight: "bold" }}
      >
        {running ? "Running..." : "Self-Heal NPM"}
      </button>
      <button onClick={handleSchedule} style={{ marginLeft: 8 }}>
        Schedule
      </button>
      <button onClick={handleClearHistory} style={{ marginLeft: 8 }}>
        Clear History
      </button>
      {success && (
        <div style={{ color: "green", marginTop: 8 }}>
          Self-heal completed successfully.
        </div>
      )}
      {error && (
        <div style={{ color: "red", marginTop: 8 }}>Error: {error}</div>
      )}
      {log && (
        <div style={{ marginTop: 16 }}>
          <h4>Log Output</h4>
          <pre
            style={{
              maxHeight: 300,
              overflow: "auto",
              background: "#f9f9f9",
              padding: 8,
            }}
          >
            {log}
          </pre>
          <button onClick={handleDownload} style={{ marginTop: 8 }}>
            Download Log
          </button>
        </div>
      )}
      <div style={{ marginTop: 24 }}>
        <h4>Error/Fix History</h4>
        {history.length === 0 ? (
          <div>No history yet.</div>
        ) : (
          <ul
            style={{
              maxHeight: 120,
              overflow: "auto",
              background: "#f4f4f4",
              padding: 8,
            }}
          >
            {history.map((h, i) => (
              <li key={i} style={{ marginBottom: 6 }}>
                <b>{h.ts}</b> - <span>{JSON.stringify(h.options)}</span>
                <button style={{ marginLeft: 8 }} onClick={() => setLog(h.log)}>
                  View Log
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SelfHealPanel;
