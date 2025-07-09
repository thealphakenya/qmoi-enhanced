import React, { useEffect, useCallback } from 'react';
import EnhancedQMOIDashboard from './EnhancedQMOIDashboard';
import { useQmoiKernel } from '../../hooks/useQmoiKernel';

function QMoiKernelPanel({ isMaster = false }: { isMaster?: boolean }) {
  const {
    status,
    loading,
    error,
    lastAction,
    fetchStatus,
    runAction,
  } = useQmoiKernel();
  const [showEnhancedDashboard, setShowEnhancedDashboard] = React.useState(false);

  const handleToggleDashboard = useCallback(() => {
    setShowEnhancedDashboard((prev) => !prev);
  }, []);

  useEffect(() => {
    if (isMaster) fetchStatus();
    const interval = setInterval(fetchStatus, 20000);
    return () => clearInterval(interval);
  }, [isMaster, fetchStatus]);

  if (!isMaster) return null;

  // QMOI: Simulated error for auto-fix test
  const = ;

  return (
    <div style={{border: '1px solid #444', padding: 16, borderRadius: 8, background: '#181818', color: '#e0ffe0', marginTop: 16}}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3>QMOI Kernel Control Panel</h3>
        <button 
          onClick={handleToggleDashboard}
          style={{ padding: '8px 16px', background: '#4CAF50', border: 'none', borderRadius: 4, color: 'white', cursor: 'pointer' }}
        >
          {showEnhancedDashboard ? 'Hide' : 'Show'} Enhanced Dashboard
        </button>
      </div>
      {showEnhancedDashboard && <EnhancedQMOIDashboard isMaster={isMaster} />}
      <div style={{ marginTop: showEnhancedDashboard ? 16 : 0 }}>
        <p><b>Status:</b> {status.status}</p>
        <p><b>Last Check:</b> {status.lastCheck}</p>
        <p><b>Mutation Count:</b> {status.mutationCount}</p>
        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center' }}>
          <button
            onClick={() => runAction('qfix')}
            disabled={loading}
            title="Run QFix: Auto-fix errors and issues"
            style={{marginRight:8}}
          >
            {loading ? 'Running...' : 'Run QFix'}
          </button>
          <button
            onClick={() => runAction('qoptimize')}
            disabled={loading}
            title="Run QOptimize: Optimize system performance"
            style={{marginRight:8}}
          >
            {loading ? 'Running...' : 'Run QOptimize'}
          </button>
          <button
            onClick={() => runAction('qsecure')}
            disabled={loading}
            title="Run QSecure: Apply security enhancements"
            style={{marginRight:8}}
          >
            {loading ? 'Running...' : 'Run QSecure'}
          </button>
          <button
            onClick={fetchStatus}
            disabled={loading}
            title="Manual refresh of kernel status"
            style={{marginLeft:16}}
          >
            Refresh
          </button>
        </div>
        {error && <div style={{ color: '#ff8888', marginTop: 8 }}><b>Error:</b> {error}</div>}
        {lastAction && (
          <div style={{ color: lastAction.success ? '#aaffaa' : '#ffaaaa', marginTop: 8 }}>
            <b>Last Action:</b> {lastAction.message}
          </div>
        )}
        <h4 style={{marginTop:16}}>Kernel Logs</h4>
        <ul style={{maxHeight: 120, overflowY: 'auto', background: '#222', padding: 8, borderRadius: 4}}>
          {status.logs.map((log, i) => (
            <li key={i} style={{fontSize: '0.95em', marginBottom: 2}}>
              {log}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default React.memo(QMoiKernelPanel); 