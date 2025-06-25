import React, { useEffect, useState } from 'react';

interface Table {
  name: string;
}

interface Schema {
  sql: string;
}

export default function QMoiDatabaseDashboard({ isMaster }: { isMaster: boolean }) {
  const [tables, setTables] = useState<Table[]>([]);
  const [schema, setSchema] = useState<Schema[]>([]);
  const [newTable, setNewTable] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (!isMaster) return;
    fetch('/api/qmoi-database/route?tables=true', { headers: { 'x-qmoi-master': 'true' } })
      .then(res => res.json())
      .then(data => setTables(data.tables || []));
    fetch('/api/qmoi-database/route?schema=true', { headers: { 'x-qmoi-master': 'true' } })
      .then(res => res.json())
      .then(data => setSchema(data.schema || []));
  }, [isMaster]);

  const handleCreateTable = async () => {
    if (!newTable) return;
    const sql = `CREATE TABLE IF NOT EXISTS ${newTable} (id INTEGER PRIMARY KEY AUTOINCREMENT)`;
    const res = await fetch('/api/qmoi-database/route', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-qmoi-master': 'true' },
      body: JSON.stringify({ createTable: sql })
    });
    const data = await res.json();
    setStatus(data.status || data.error);
    setNewTable('');
  };

  if (!isMaster) return null;
  return (
    <div style={{ padding: 24 }}>
      <h2>QMOI Database Dashboard (Master Only)</h2>
      <div>
        <input value={newTable} onChange={e => setNewTable(e.target.value)} placeholder="New table name" />
        <button onClick={handleCreateTable}>Create Table</button>
      </div>
      <div>
        <h3>Tables</h3>
        <ul>{tables.map(t => <li key={t.name}>{t.name}</li>)}</ul>
      </div>
      <div>
        <h3>Schema</h3>
        <pre>{schema.map(s => s.sql).join('\n\n')}</pre>
      </div>
      <div>
        <h3>Status</h3>
        <pre>{status}</pre>
      </div>
      <div>
        <h3>Coming Soon</h3>
        <ul>
          <li>Real-time updates</li>
          <li>Advanced feature enhancement</li>
          <li>Row CRUD UI</li>
          <li>Triggers and functions</li>
        </ul>
      </div>
    </div>
  );
} 