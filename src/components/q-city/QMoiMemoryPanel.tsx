import React, { useEffect, useState } from 'react';

export default function QMoiMemoryPanel({ isMaster = false }: { isMaster?: boolean }) {
  const [memory, setMemory] = useState<any>(null);
  const [feedback, setFeedback] = useState('');
  const [correction, setCorrection] = useState('');
  const [message, setMessage] = useState('');

  async function fetchMemory() {
    const res = await fetch('/api/qmoi/memory');
    if (res.ok) setMemory(await res.json());
  }

  async function submitFeedback() {
    const res = await fetch('/api/qmoi/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ feedback, correction: correction ? { custom: correction } : undefined })
    });
    if (res.ok) {
      setMessage('Feedback submitted!');
      fetchMemory();
    } else {
      setMessage('Error submitting feedback.');
    }
  }

  async function backupMemory() {
    const res = await fetch('/api/qmoi/memory-backup');
    if (res.ok) setMessage('Memory backup created!');
    else setMessage('Backup failed.');
  }

  useEffect(() => { if (isMaster) fetchMemory(); }, [isMaster]);
  if (!isMaster) return null;

  return (
    <div style={{border: '1px solid #444', padding: 16, borderRadius: 8, background: '#181818', color: '#e0ffe0', marginTop: 16}}>
      <h3>QMOI Memory & Personality</h3>
      {memory ? (
        <>
          <p><b>Personality:</b> {JSON.stringify(memory.personality)}</p>
          <p><b>Recent Feedback:</b></p>
          <ul>{(memory.master_feedback || []).slice(-5).map((f: any, i: number) => <li key={i}>{JSON.stringify(f)}</li>)}</ul>
          <p><b>Recent Interactions:</b></p>
          <ul>{(memory.history || []).slice(-5).map((h: any, i: number) => <li key={i}>{h.input} ({h.emotion})</li>)}</ul>
        </>
      ) : <p>Loading...</p>}
      <div style={{marginTop: 12}}>
        <input value={feedback} onChange={e => setFeedback(e.target.value)} placeholder="Feedback (praise/correction)" style={{marginRight:8}} />
        <input value={correction} onChange={e => setCorrection(e.target.value)} placeholder="Correction (optional)" style={{marginRight:8}} />
        <button onClick={submitFeedback}>Submit Feedback</button>
        <button onClick={backupMemory} style={{marginLeft:8}}>Backup Memory</button>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
} 