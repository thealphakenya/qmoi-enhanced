import React, { useEffect, useState } from 'react';

function App() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      const res = await fetch('http://localhost:4000/api/status');
      const data = await res.json();
      setStatus(data);
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!status) return <div>Loading QMOI status...</div>;

  return (
    <div style={{ fontFamily: 'sans-serif', padding: 24 }}>
      <h2>QMOI Real-Time Dashboard</h2>
      <p><b>Projects Running:</b> {status.projects}</p>
      <p><b>Deals in Progress:</b> {status.deals}</p>
      <p><b>Device Health:</b> {status.deviceHealth}</p>
      <p><b>Cloud Usage:</b> {status.cloudUsage}</p>
      <p><b>Last Update:</b> {status.lastUpdate}</p>
      <h4>Notifications</h4>
      <ul>
        {status.notifications.map((n, i) => <li key={i}>{n}</li>)}
      </ul>
    </div>
  );
}

export default App; 