import React, { useEffect, useState } from 'react';

export default function AuditLogPanel() {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState({ action: '', user: '', deviceId: '', status: '' });
  const [format, setFormat] = useState('json');
  const [loading, setLoading] = useState(false);
  useEffect(() => { fetchLogs(); }, [filter]);
  function fetchLogs() {
    setLoading(true);
    const params = new URLSearchParams({ ...filter, format });
    fetch(`/api/qcity/audit-log?${params.toString()}`, {
      headers: { 'x-qcity-admin-key': localStorage.getItem('qcity-admin-key') || '' },
    })
      .then(r => format === 'csv' ? r.text() : r.json())
      .then(data => {
        setLogs(format === 'csv' ? data.split('\n').map(l => l.split(',')) : data.logs || []);
        setLoading(false);
      });
  }
  function exportLogs(fmt: string) {
    setFormat(fmt); fetchLogs();
  }
  return (
    <div className="p-4 bg-gray-900 text-white rounded shadow-lg">
      <h3 className="font-bold text-cyan-400 mb-2">Audit Log Panel</h3>
      <div className="flex gap-2 mb-2">
        <input placeholder="Action" value={filter.action} onChange={e => setFilter(f => ({ ...f, action: e.target.value }))} className="bg-gray-800 p-1 rounded" />
        <input placeholder="User" value={filter.user} onChange={e => setFilter(f => ({ ...f, user: e.target.value }))} className="bg-gray-800 p-1 rounded" />
        <input placeholder="Device" value={filter.deviceId} onChange={e => setFilter(f => ({ ...f, deviceId: e.target.value }))} className="bg-gray-800 p-1 rounded" />
        <input placeholder="Status" value={filter.status} onChange={e => setFilter(f => ({ ...f, status: e.target.value }))} className="bg-gray-800 p-1 rounded" />
        <button onClick={() => exportLogs('json')} className="bg-cyan-700 px-2 py-1 rounded">Export JSON</button>
        <button onClick={() => exportLogs('csv')} className="bg-cyan-700 px-2 py-1 rounded">Export CSV</button>
      </div>
      <div className="overflow-x-auto text-xs" aria-live="polite">
        {loading ? 'Loading...' : (
          <table className="w-full">
            <thead>
              <tr>
                <th>Time</th><th>Action</th><th>User</th><th>Device</th><th>Status</th><th>Command</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l: any, i) => (
                <tr key={i}>
                  <td>{l.timestamp || ''}</td>
                  <td>{l.action || ''}</td>
                  <td>{l.user || ''}</td>
                  <td>{l.deviceId || ''}</td>
                  <td>{l.status || ''}</td>
                  <td>{l.cmd || ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
} 