import React, { useEffect, useState, useContext } from 'react';
// To use Chart.js, install with: npm install chart.js react-chartjs-2
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
// Example: import { MasterContext } from '../context/MasterContext';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function DeploymentStatusDashboard({ isMaster = false }: { isMaster?: boolean }) {
  // const { isMaster } = useContext(MasterContext); // If using context
  const [status, setStatus] = useState('Loading...');
  const [lastDeploy, setLastDeploy] = useState('');
  const [health, setHealth] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [history, setHistory] = useState<{timestamp: string, status: string, version: string}[]>([]);

  async function fetchStatus() {
    const res = await fetch('/api/deployment-status');
    if (res.ok) {
      const data = await res.json();
      setStatus(data.status);
      setLastDeploy(data.lastDeploy);
      setHealth(data.health);
      setLogs(data.logs || []);
      setHistory(data.history || []);
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
    labels: history.map(h => h.timestamp),
    datasets: [
      {
        label: 'Deployment Success',
        data: history.map(h => h.status === 'Success' ? 1 : 0),
        borderColor: 'green',
        backgroundColor: 'rgba(0,255,0,0.1)',
        fill: true,
      },
      {
        label: 'Deployment Failure',
        data: history.map(h => h.status === 'Failed' ? 1 : 0),
        borderColor: 'red',
        backgroundColor: 'rgba(255,0,0,0.1)',
        fill: true,
      },
      {
        label: 'Rollback',
        data: history.map(h => h.status === 'Rollback' ? 1 : 0),
        borderColor: 'orange',
        backgroundColor: 'rgba(255,165,0,0.1)',
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Deployment Success/Failure/Rollback Over Time' },
    },
    scales: {
      y: { beginAtZero: true, max: 1, ticks: { stepSize: 1 } },
    },
  };

  return (
    <div style={{border: '1px solid #ccc', padding: 16, borderRadius: 8, maxWidth: 700}}>
      <h2>Deployment & Health Status</h2>
      <p><b>Status:</b> {status}</p>
      <p><b>Last Deployment:</b> {lastDeploy}</p>
      <p><b>Health:</b> {health}</p>
      <h4>Deployment Analytics</h4>
      <Line data={chartData} options={chartOptions} />
      <h4>Rollback & Version History</h4>
      <table style={{width: '100%', background: '#222', color: '#ccffcc', borderCollapse: 'collapse'}}>
        <thead>
          <tr><th>Timestamp</th><th>Status</th><th>Version</th></tr>
        </thead>
        <tbody>
          {history.map((h, i) => (
            <tr key={i} style={{borderBottom: '1px solid #444'}}>
              <td>{h.timestamp}</td>
              <td>{h.status}</td>
              <td>{h.version}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h4>Notification Logs:</h4>
      <ul style={{maxHeight: 120, overflowY: 'auto'}}>
        {logs.map((log, i) => <li key={i}>{log}</li>)}
      </ul>
    </div>
  );
} 