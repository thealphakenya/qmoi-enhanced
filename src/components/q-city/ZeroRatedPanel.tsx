import React, { useState, useEffect } from 'react';
import { useQMOIAuth } from './QMOIStateProvider';

const fetchZeroRatedStatus = async () => {
  // Placeholder: fetch status from backend or local state
  return {
    active: true,
    lastUsed: new Date().toLocaleString(),
    logs: [
      { time: new Date().toLocaleString(), event: 'Zero-rated mode activated' },
      { time: new Date().toLocaleString(), event: 'Fallback to Wikipedia proxy' },
    ],
  };
};

export default function ZeroRatedPanel() {
  const { isMaster } = useQMOIAuth();
  const [status, setStatus] = useState({ active: false, lastUsed: '', logs: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchZeroRatedStatus().then((data) => {
      setStatus(data);
      setLoading(false);
    });
  }, []);

  if (!isMaster) return null;

  return (
    <div className="zero-rated-panel">
      <h2>ZeroRated QMOI (Master Only)</h2>
      {loading ? (
        <div>Loading status...</div>
      ) : (
        <>
          <div>Status: <b>{status.active ? 'Active' : 'Inactive'}</b></div>
          <div>Last Used: {status.lastUsed}</div>
          <button onClick={() => alert('Force zero-rated mode (not implemented)')}>Force ZeroRated Mode</button>
          <button onClick={() => alert('Test endpoints (not implemented)')}>Test Endpoints</button>
          <h4>Logs</h4>
          <ul>
            {status.logs.map((log, i) => (
              <li key={i}>{log.time}: {log.event}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
} 