import React, { useEffect, useState } from 'react';
import EnhancedQMOIDashboard from './EnhancedQMOIDashboard';

export default function QMoiKernelPanel({ isMaster = false }: { isMaster?: boolean }) {
  const [status, setStatus] = useState('Loading...');
  const [lastCheck, setLastCheck] = useState('');
  const [mutationCount, setMutationCount] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [showEnhancedDashboard, setShowEnhancedDashboard] = useState(false);

  async function fetchStatus() {
    const res = await fetch('/api/qmoi/status');
    if (res.ok) {
      const data = await res.json();
      setStatus(data.status);
      setLastCheck(data.last_check);
      setMutationCount(data.mutation_count);
      setLogs(data.logs || []);
    }
  }

  useEffect(() => {
    if (isMaster) fetchStatus();
    const interval = setInterval(fetchStatus, 20000);
    return () => clearInterval(interval);
  }, [isMaster]);

  if (!isMaster) return null;

  return (
    <div style={{border: '1px solid #444', padding: 16, borderRadius: 8, background: '#181818', color: '#e0ffe0', marginTop: 16}}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3>QMOI Kernel Control Panel</h3>
        <button 
          onClick={() => setShowEnhancedDashboard(!showEnhancedDashboard)}
          style={{ padding: '8px 16px', background: '#4CAF50', border: 'none', borderRadius: 4, color: 'white', cursor: 'pointer' }}
        >
          {showEnhancedDashboard ? 'Hide' : 'Show'} Enhanced Dashboard
        </button>
      </div>
      
      {showEnhancedDashboard && <EnhancedQMOIDashboard isMaster={isMaster} />}
      
      <div style={{ marginTop: showEnhancedDashboard ? 16 : 0 }}>
        <p><b>Status:</b> {status}</p>
        <p><b>Last Check:</b> {lastCheck}</p>
        <p><b>Mutation Count:</b> {mutationCount}</p>
        <div style={{ marginTop: 8 }}>
          <button onClick={() => fetch('/api/qmoi/payload?qfix', {method: 'POST'}).then(fetchStatus)}>Run QFix</button>
          <button onClick={() => fetch('/api/qmoi/payload?qoptimize', {method: 'POST'}).then(fetchStatus)} style={{marginLeft:8}}>Run QOptimize</button>
          <button onClick={() => fetch('/api/qmoi/payload?qsecure', {method: 'POST'}).then(fetchStatus)} style={{marginLeft:8}}>Run QSecure</button>
        </div>
        <h4>Kernel Logs</h4>
        <ul style={{maxHeight: 120, overflowY: 'auto'}}>
          {logs.map((log, i) => <li key={i}>{log}</li>)}
        </ul>
      </div>
    </div>
  );
} 