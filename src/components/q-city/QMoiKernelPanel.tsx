import React, { useEffect, useState } from 'react';

export default function QMoiKernelPanel({ isMaster = false }: { isMaster?: boolean }) {
  const [status, setStatus] = useState('Loading...');
  const [lastCheck, setLastCheck] = useState('');
  const [mutationCount, setMutationCount] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

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
      <h3>QMOI Kernel Control Panel</h3>
      <p><b>Status:</b> {status}</p>
      <p><b>Last Check:</b> {lastCheck}</p>
      <p><b>Mutation Count:</b> {mutationCount}</p>
      <button onClick={() => fetch('/api/qmoi/payload?qfix', {method: 'POST'}).then(fetchStatus)}>Run QFix</button>
      <button onClick={() => fetch('/api/qmoi/payload?qoptimize', {method: 'POST'}).then(fetchStatus)} style={{marginLeft:8}}>Run QOptimize</button>
      <button onClick={() => fetch('/api/qmoi/payload?qsecure', {method: 'POST'}).then(fetchStatus)} style={{marginLeft:8}}>Run QSecure</button>
      <h4>Kernel Logs</h4>
      <ul style={{maxHeight: 120, overflowY: 'auto'}}>
        {logs.map((log, i) => <li key={i}>{log}</li>)}
      </ul>
    </div>
  );
} 