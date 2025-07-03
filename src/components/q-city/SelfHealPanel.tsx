import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

// QCity SelfHealPanel: Admin-only panel to trigger and view results of the NPM self-healing script via the backend API. Integrate into Dashboard for enterprise automation and troubleshooting.
// Usage: <SelfHealPanel />
// Only visible to admin/master roles.

const API_URL = '/api/qcity/selfheal-npm';

const SelfHealPanel: React.FC = () => {
  const { user, loading } = useAuth();
  const [running, setRunning] = useState(false);
  const [log, setLog] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  const handleSelfHeal = async () => {
    setRunning(true);
    setLog('');
    setError(null);
    setSuccess(null);
    try {
      const token = localStorage.getItem('jwtToken');
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.status === 'success') {
        setLog(data.log);
        setSuccess(true);
      } else {
        setLog(data.log || '');
        setError(data.error || 'Unknown error');
        setSuccess(false);
      }
    } catch (err: any) {
      setError(err.message || 'Request failed');
      setSuccess(false);
    } finally {
      setRunning(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([log], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qcity_npm_selfheal.log';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div>Loading...</div>;
  if (!user || (user.role !== 'admin' && user.role !== 'master')) return null;

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16, margin: 16 }}>
      <h3>QCity NPM Self-Heal</h3>
      <button onClick={handleSelfHeal} disabled={running} style={{ padding: '8px 16px', fontWeight: 'bold' }}>
        {running ? 'Running...' : 'Self-Heal NPM'}
      </button>
      {success && <div style={{ color: 'green', marginTop: 8 }}>Self-heal completed successfully.</div>}
      {error && <div style={{ color: 'red', marginTop: 8 }}>Error: {error}</div>}
      {log && (
        <div style={{ marginTop: 16 }}>
          <h4>Log Output</h4>
          <pre style={{ maxHeight: 300, overflow: 'auto', background: '#f9f9f9', padding: 8 }}>{log}</pre>
          <button onClick={handleDownload} style={{ marginTop: 8 }}>Download Log</button>
        </div>
      )}
    </div>
  );
};

export default SelfHealPanel; 