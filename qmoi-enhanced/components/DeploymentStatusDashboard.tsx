import React, { useEffect, useState, useContext } from "react";
// To use Chart.js, install with: npm install chart.js react-chartjs-2
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
// Example: import { MasterContext } from '../context/MasterContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

export default function DeploymentStatusDashboard({
  isMaster = false,
}: {
  isMaster?: boolean;
}) {
  // const { isMaster } = useContext(MasterContext); // If using context
  const [status, setStatus] = useState("Loading...");
  const [lastDeploy, setLastDeploy] = useState("");
  const [health, setHealth] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]); // Accepts extra fields
  const [envManagerStatus, setEnvManagerStatus] = useState<any>(null);
  const [huggingfaceStatus, setHuggingfaceStatus] = useState<any>(null);

  async function fetchStatus() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/deployment-status");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setStatus(data.status);
      setLastDeploy(data.lastDeploy);
      setHealth(data.health);
      setLogs(data.logs || []);
      setHistory(data.history || []);
      setEnvManagerStatus(data.envManagerStatus || null);
      setHuggingfaceStatus(data.huggingfaceStatus || null);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!isMaster) return null;

  // Prepare chart data
  const chartData = {
    labels: history.map((h) => h.timestamp),
    datasets: [
      {
        label: "Deployment Success",
        data: history.map((h) => (h.status === "Success" ? 1 : 0)),
        borderColor: "green",
        backgroundColor: "rgba(0,255,0,0.1)",
        fill: true,
      },
      {
        label: "Deployment Failure",
        data: history.map((h) => (h.status === "Failed" ? 1 : 0)),
        borderColor: "red",
        backgroundColor: "rgba(255,0,0,0.1)",
        fill: true,
      },
      {
        label: "Rollback",
        data: history.map((h) => (h.status === "Rollback" ? 1 : 0)),
        borderColor: "orange",
        backgroundColor: "rgba(255,165,0,0.1)",
        fill: true,
      },
    ],
  };

  // New: Chart for deployment duration
  const durationChartData = {
    labels: history.map((h) => h.timestamp),
    datasets: [
      {
        label: "Deployment Duration (s)",
        data: history.map((h) => h.duration || 0),
        borderColor: "blue",
        backgroundColor: "rgba(0,0,255,0.1)",
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: {
        display: true,
        text: "Deployment Success/Failure/Rollback Over Time",
      },
    },
    scales: {
      y: { beginAtZero: true, max: 1, ticks: { stepSize: 1 } },
    },
  };

  const durationChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Deployment Duration Over Time (seconds)" },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: 16,
        borderRadius: 8,
        maxWidth: 900,
        background: "#181818",
        color: "#e0ffe0",
      }}
    >
      <h2>Deployment & Health Status</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>Error: {error}</p>
      ) : (
        <>
          <p>
            <b>Status:</b> {status}
          </p>
          <p>
            <b>Last Deployment:</b> {lastDeploy}
          </p>
          <p>
            <b>Health:</b> {health}
          </p>
          <h4>Deployment Analytics</h4>
          <Line data={chartData} options={chartOptions} />
          <h4>Deployment Duration</h4>
          <Line data={durationChartData} options={durationChartOptions} />
          <h4>Rollback & Version History</h4>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                background: "#222",
                color: "#ccffcc",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Status</th>
                  <th>Version</th>
                  <th>Duration (s)</th>
                  <th>Files Changed</th>
                  <th>User</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #444" }}>
                    <td>{h.timestamp}</td>
                    <td>{h.status}</td>
                    <td>{h.version}</td>
                    <td>{h.duration ?? "-"}</td>
                    <td>{h.filesChanged ?? "-"}</td>
                    <td>{h.user ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h4>Notification Logs:</h4>
          <ul style={{ maxHeight: 120, overflowY: "auto" }}>
            {logs.map((log, i) => (
              <li key={i}>{log}</li>
            ))}
          </ul>
          {envManagerStatus && (
            <div
              style={{
                marginTop: 16,
                padding: 12,
                background: "#222",
                borderRadius: 8,
              }}
            >
              <h4>Environment Manager Status</h4>
              <p>
                <b>Status:</b> {envManagerStatus.status}
              </p>
              <p>
                <b>Last Checked:</b> {envManagerStatus.timestamp}
              </p>
              {envManagerStatus.missing &&
                envManagerStatus.missing.length > 0 && (
                  <p style={{ color: "orange" }}>
                    <b>Missing Vars:</b> {envManagerStatus.missing.join(", ")}
                  </p>
                )}
            </div>
          )}
          {huggingfaceStatus && (
            <div
              style={{
                marginTop: 16,
                padding: 12,
                background: "#222",
                borderRadius: 8,
              }}
            >
              <h4>HuggingFace Spaces Status</h4>
              <p>
                <b>Status:</b> {huggingfaceStatus.status}
              </p>
              <p>
                <b>Action:</b> {huggingfaceStatus.action}
              </p>
              <p>
                <b>Last Update:</b> {huggingfaceStatus.timestamp}
              </p>
              {huggingfaceStatus.error && (
                <p style={{ color: "red" }}>
                  <b>Error:</b> {huggingfaceStatus.error}
                </p>
              )}
              {huggingfaceStatus.autoRepair !== undefined && (
                <p>
                  <b>Auto-Repair Attempted:</b>{" "}
                  {huggingfaceStatus.autoRepair ? "Yes" : "No"}
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
