import React, { useEffect, useState } from 'react';

export default function QMoiAutoDevPanel({ isMaster = false }: { isMaster?: boolean }) {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchProjects() {
    // TODO: Replace with real API call
    setLoading(true);
    setTimeout(() => {
      setProjects([
        { name: 'QWebApp', type: 'web', status: 'healthy', last_checked: '2024-06-01T12:00:00Z' },
        { name: 'QMobileAI', type: 'mobile', status: 'unhealthy', last_checked: '2024-06-01T12:05:00Z' },
        { name: 'QAutomation', type: 'automation', status: 'healthy', last_checked: '2024-06-01T12:10:00Z' },
      ]);
      setLoading(false);
    }, 800);
  }

  useEffect(() => { if (isMaster) fetchProjects(); }, [isMaster]);
  if (!isMaster) return null;

  return (
    <div style={{border: '1px solid #444', padding: 16, borderRadius: 8, background: '#181818', color: '#e0ffe0', marginTop: 16}}>
      <h3>QMOI Auto-Dev Project Manager</h3>
      {loading ? <p>Loading...</p> : (
        <table style={{width: '100%', background: '#222', color: '#ccffcc', borderCollapse: 'collapse'}}>
          <thead>
            <tr><th>Name</th><th>Type</th><th>Status</th><th>Last Checked</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {projects.map((p, i) => (
              <tr key={i} style={{borderBottom: '1px solid #444'}}>
                <td>{p.name}</td>
                <td>{p.type}</td>
                <td style={{color: p.status === 'healthy' ? '#0f0' : '#ff0'}}>{p.status}</td>
                <td>{p.last_checked}</td>
                <td>
                  <button style={{marginRight: 8}}>Auto-Fix</button>
                  <button style={{marginRight: 8}}>Build</button>
                  <button>Logs</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
} 