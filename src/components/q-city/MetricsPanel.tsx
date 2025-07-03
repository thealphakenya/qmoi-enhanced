import React, { useEffect, useState } from 'react';

export default function MetricsPanel() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    setLoading(true);
    fetch('/api/qcity/metrics', { headers: { Authorization: token ? `Bearer ${token}` : '' } })
      .then(r => r.json())
      .then(data => setMetrics(data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">System Metrics</h2>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {loading ? <div className="text-gray-400">Loading...</div> : metrics && (
        <div className="text-xs text-gray-300">
          <div>Hostname: {metrics.hostname}</div>
          <div>Platform: {metrics.platform} ({metrics.arch})</div>
          <div>Uptime: {Math.round(metrics.uptime / 60)} min</div>
          <div>CPU Cores: {metrics.cpus.length}</div>
          <div>Load Avg: {metrics.load.join(', ')}</div>
          <div>Total Mem: {(metrics.totalMem / 1e9).toFixed(2)} GB</div>
          <div>Free Mem: {(metrics.freeMem / 1e9).toFixed(2)} GB</div>
        </div>
      )}
    </div>
  );
} 