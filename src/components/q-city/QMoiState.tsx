import React, { useState, useEffect } from "react";

interface QMoiStateProps {
  session?: any;
  global?: any;
  minimized?: boolean;
  aiHealth?: { status: string; lastCheck: string; error?: string };
  isMaster?: boolean;
  isAdmin?: boolean;
}

export function QMoiState({
  session,
  global,
  minimized = false,
  aiHealth,
  isMaster = false,
  isAdmin = false
}: QMoiStateProps) {
  const [isMinimized, setIsMinimized] = useState(minimized);
  const [now, setNow] = useState(new Date());
  const [currentEmotion, setCurrentEmotion] = useState('focused');
  const [currentActivity, setCurrentActivity] = useState('processing');
  const [showActivityLog, setShowActivityLog] = useState(false);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [logError, setLogError] = useState<string | null>(null);
  const [logFilters, setLogFilters] = useState({ user: '', action: '', status: '', date: '' });
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate real-time Qmoi state updates
  useEffect(() => {
    const emotions = ['focused', 'creative', 'analytical', 'excited', 'calm', 'curious'];
    const activities = ['processing', 'learning', 'creating', 'analyzing', 'optimizing', 'planning'];
    
    const emotionTimer = setInterval(() => {
      setCurrentEmotion(emotions[Math.floor(Math.random() * emotions.length)]);
    }, 8000);

    const activityTimer = setInterval(() => {
      setCurrentActivity(activities[Math.floor(Math.random() * activities.length)]);
    }, 5000);

    return () => {
      clearInterval(emotionTimer);
      clearInterval(activityTimer);
    };
  }, []);

  useEffect(() => {
    if (!isMaster && !isAdmin) return;
    setLoadingLogs(true);
    setLogError(null);
    const params = new URLSearchParams({ ...logFilters, page: String(page), pageSize: String(pageSize) });
    fetch(`/api/qcity/audit-log?${params.toString()}`, {
      headers: { Authorization: token ? `Bearer ${token}` : '' }
    })
      .then(r => r.json())
      .then(data => {
        setAuditLogs(data.items || []);
        setTotalPages(data.totalPages || 1);
        setLoadingLogs(false);
      })
      .catch(e => {
        setLogError(e.message || 'Failed to load logs');
        setLoadingLogs(false);
      });
  }, [logFilters, page, isMaster, isAdmin]);

  const getEmotionEmoji = (emotion: string) => {
    switch (emotion) {
      case 'focused': return '🎯';
      case 'creative': return '🎨';
      case 'analytical': return '📊';
      case 'excited': return '🚀';
      case 'calm': return '🧘';
      case 'curious': return '🤔';
      default: return '🤖';
    }
  };

  const getActivityEmoji = (activity: string) => {
    switch (activity) {
      case 'processing': return '⚙️';
      case 'learning': return '📚';
      case 'creating': return '✨';
      case 'analyzing': return '🔍';
      case 'optimizing': return '⚡';
      case 'planning': return '📋';
      default: return '🔄';
    }
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'OK': return 'text-green-500';
      case 'Warning': return 'text-yellow-500';
      case 'Error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const exportToCSV = (logs: any[]) => {
    const header = 'Timestamp,User,Action,Device,Status,Command';
    const rows = logs.map((log: any) =>
      [log.timestamp, log.user, log.action, log.deviceId, log.status, log.command.replace(/"/g, '""')].map(x => `"${x || ''}"`).join(',')
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'qmoi_audit_log.csv';
    a.click();
  };

  const exportToJSON = (logs: any[]) => {
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'qmoi_audit_log.json';
    a.click();
  };

  if (isMinimized) {
    return (
      <div className="fixed top-5 right-5 w-20 h-10 bg-gray-900 text-white rounded-lg p-2 shadow-2xl border border-gray-700 cursor-pointer z-50">
        <div className="text-center">
          <div className="text-lg">🤖</div>
          <div className="text-xs">{getEmotionEmoji(currentEmotion)}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-5 right-5 w-80 h-96 bg-gray-900 text-white rounded-lg p-4 shadow-2xl border border-gray-700 z-50">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-cyan-400">
          🤖 Qmoi State
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsMinimized(true)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ➖
          </button>
          <button
            onClick={() => setIsMinimized(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ⚪
          </button>
        </div>
      </div>

      {/* Current Time */}
      <div className="mb-3 p-2 bg-gray-800 rounded">
        <div className="text-sm text-gray-400">Current Time</div>
        <div className="text-lg font-mono">
          {now.toLocaleTimeString('en-US', { 
            hour12: false,
            timeZone: 'Africa/Nairobi'
          })}
        </div>
        <div className="text-xs text-gray-500">Nairobi Time</div>
      </div>

      {/* Qmoi Status */}
      <div className="mb-3 p-2 bg-gray-800 rounded">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Status</span>
          <span className={`text-sm font-bold ${getHealthColor(aiHealth?.status || 'OK')}`}>
            {aiHealth?.status || 'OK'} {aiHealth?.status === 'OK' ? '🟢' : '🔴'}
          </span>
        </div>
        <div className="text-xs text-gray-500">
          Last Check: {aiHealth?.lastCheck ? new Date(aiHealth.lastCheck).toLocaleTimeString() : 'N/A'}
        </div>
      </div>

      {/* Current Emotion & Activity */}
      <div className="mb-3 p-2 bg-gray-800 rounded">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Emotion</span>
          <span className="text-lg">
            {getEmotionEmoji(currentEmotion)} {currentEmotion}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Activity</span>
          <span className="text-lg">
            {getActivityEmoji(currentActivity)} {currentActivity}
          </span>
        </div>
      </div>

      {/* Session Memory */}
      {session && (
        <div className="mb-3 p-2 bg-gray-800 rounded">
          <div className="text-sm text-gray-400 mb-1">Session Memory</div>
          <div className="text-xs text-gray-300">
            Tasks: {session.tasks || 0} | 
            Projects: {session.projects || 0} | 
            Errors: {session.errors || 0}
          </div>
        </div>
      )}

      {/* Global Stats */}
      {global && (
        <div className="mb-3 p-2 bg-gray-800 rounded">
          <div className="text-sm text-gray-400 mb-1">Global Stats</div>
          <div className="text-xs text-gray-300">
            Total Tasks: {global.totalTasks || 0} | 
            Success Rate: {global.successRate || 0}%
          </div>
        </div>
      )}

      {/* Master-only additional info */}
      {isMaster && (
        <div className="pt-2 border-t border-gray-700">
          <div className="text-xs text-gray-400">
            <div>Master Access: Active 👑</div>
            <div>System Health: Excellent</div>
            <div>Auto Projects: Running</div>
          </div>
        </div>
      )}

      {/* Add button for master to open Activity Log */}
      {isMaster && (
        <button className="mt-2 px-3 py-1 bg-cyan-700 text-white rounded" onClick={() => setShowActivityLog(true)}>
          QMOI Activity Log
        </button>
      )}

      {/* QMOI Activity Log Panel (master-only) */}
      {(isMaster || isAdmin) && showActivityLog && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-gray-900 p-6 rounded-lg w-2/3 h-2/3 overflow-y-auto relative">
            <h2 className="text-xl font-bold mb-4 text-cyan-400">QMOI Activity Log</h2>
            <button className="absolute top-4 right-8 text-white" onClick={() => setShowActivityLog(false)}>
              Close
            </button>
            <div className="mb-2 flex gap-2">
              <input placeholder="User" value={logFilters.user} onChange={e => setLogFilters(f => ({ ...f, user: e.target.value }))} className="px-2 py-1 rounded bg-gray-800 text-white" />
              <input placeholder="Action" value={logFilters.action} onChange={e => setLogFilters(f => ({ ...f, action: e.target.value }))} className="px-2 py-1 rounded bg-gray-800 text-white" />
              <input placeholder="Status" value={logFilters.status} onChange={e => setLogFilters(f => ({ ...f, status: e.target.value }))} className="px-2 py-1 rounded bg-gray-800 text-white" />
              <input type="date" value={logFilters.date} onChange={e => setLogFilters(f => ({ ...f, date: e.target.value }))} className="px-2 py-1 rounded bg-gray-800 text-white" />
              <button onClick={() => exportToCSV(auditLogs)} className="ml-2 px-2 py-1 bg-cyan-700 rounded text-white">Export CSV</button>
              <button onClick={() => exportToJSON(auditLogs)} className="px-2 py-1 bg-cyan-700 rounded text-white">Export JSON</button>
            </div>
            {loadingLogs ? <div className="text-gray-400">Loading...</div> : logError ? <div className="text-red-400">{logError}</div> : (
              <table className="w-full text-xs text-left text-gray-300">
                <thead>
                  <tr>
                    <th className="px-2 py-1">Timestamp</th>
                    <th className="px-2 py-1">User</th>
                    <th className="px-2 py-1">Action</th>
                    <th className="px-2 py-1">Device</th>
                    <th className="px-2 py-1">Status</th>
                    <th className="px-2 py-1">Command</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log, i) => (
                    <tr key={i}>
                      <td className="px-2 py-1">{log.timestamp}</td>
                      <td className="px-2 py-1">{log.user}</td>
                      <td className="px-2 py-1">{log.action}</td>
                      <td className="px-2 py-1">{log.deviceId}</td>
                      <td className="px-2 py-1">{log.status}</td>
                      <td className="px-2 py-1">{log.command}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div className="flex justify-between items-center mt-2">
              <button disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="px-2 py-1 bg-gray-800 rounded text-white">Prev</button>
              <span className="text-gray-400">Page {page} of {totalPages}</span>
              <button disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))} className="px-2 py-1 bg-gray-800 rounded text-white">Next</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 