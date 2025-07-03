import React, { useEffect, useState } from 'react';

export default function DevicePanel() {
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', host: '', port: 22, username: '', password: '', privateKey: '' });
  const [editing, setEditing] = useState<any>(null);
  const [testResult, setTestResult] = useState('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const fetchDevices = () => {
    setLoading(true);
    fetch('/api/qcity/devices', { headers: { Authorization: token ? `Bearer ${token}` : '' } })
      .then(r => r.json())
      .then(data => setDevices(data.items || []))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchDevices(); }, []);

  const save = () => {
    setLoading(true);
    fetch('/api/qcity/devices', {
      method: editing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' },
      body: JSON.stringify(editing ? { ...form, id: editing.id } : form)
    })
      .then(fetchDevices)
      .then(() => { setForm({ name: '', host: '', port: 22, username: '', password: '', privateKey: '' }); setEditing(null); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  const del = (id: string) => {
    setLoading(true);
    fetch('/api/qcity/devices', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' },
      body: JSON.stringify({ id })
    })
      .then(fetchDevices)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  const test = (id: string) => {
    setTestResult('Testing...');
    fetch('/api/qcity/devices?action=test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' },
      body: JSON.stringify({ id })
    })
      .then(r => r.json())
      .then(data => setTestResult(data.success ? 'Success' : data.error || 'Failed'))
      .catch(e => setTestResult(e.message));
  };

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">Devices</h2>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      <form className="mb-4 flex flex-wrap gap-2" onSubmit={e => { e.preventDefault(); save(); }}>
        <input placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="px-2 py-1 rounded bg-gray-800 text-white" />
        <input placeholder="Host" value={form.host} onChange={e => setForm(f => ({ ...f, host: e.target.value }))} className="px-2 py-1 rounded bg-gray-800 text-white" />
        <input placeholder="Port" type="number" value={form.port} onChange={e => setForm(f => ({ ...f, port: Number(e.target.value) }))} className="px-2 py-1 rounded bg-gray-800 text-white" />
        <input placeholder="Username" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} className="px-2 py-1 rounded bg-gray-800 text-white" />
        <input placeholder="Password" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} className="px-2 py-1 rounded bg-gray-800 text-white" />
        <input placeholder="Private Key" value={form.privateKey} onChange={e => setForm(f => ({ ...f, privateKey: e.target.value }))} className="px-2 py-1 rounded bg-gray-800 text-white" />
        <button type="submit" className="px-3 py-1 bg-cyan-700 rounded text-white">{editing ? 'Update' : 'Add'}</button>
        {editing && <button type="button" onClick={() => { setEditing(null); setForm({ name: '', host: '', port: 22, username: '', password: '', privateKey: '' }); }} className="px-3 py-1 bg-gray-700 rounded text-white">Cancel</button>}
      </form>
      {testResult && <div className="text-xs text-cyan-400 mb-2">{testResult}</div>}
      {loading ? <div className="text-gray-400">Loading...</div> : (
        <table className="w-full text-xs text-left text-gray-300">
          <thead>
            <tr>
              <th>Name</th><th>Host</th><th>Port</th><th>Username</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((dev, i) => (
              <tr key={i}>
                <td>{dev.name}</td>
                <td>{dev.host}</td>
                <td>{dev.port}</td>
                <td>{dev.username}</td>
                <td>
                  <button onClick={() => { setEditing(dev); setForm(dev); }} className="px-2 py-1 bg-gray-700 rounded text-white mr-1">Edit</button>
                  <button onClick={() => del(dev.id)} className="px-2 py-1 bg-red-700 rounded text-white mr-1">Delete</button>
                  <button onClick={() => test(dev.id)} className="px-2 py-1 bg-cyan-700 rounded text-white">Test</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
} 