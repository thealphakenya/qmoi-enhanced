import React, { useState } from 'react';

export default function QMoiFileEditorChat({ isMaster = false }: { isMaster?: boolean }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleCommand(cmd: string) {
    setLoading(true);
    let response = '';
    try {
      if (cmd.startsWith('/view ')) {
        const filePath = cmd.replace('/view ', '').trim();
        const res = await fetch('/api/qmoi/file', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'read', filePath })
        });
        const data = await res.json();
        response = data.success ? data.data : `Error: ${data.error}`;
      } else if (cmd.startsWith('/edit ')) {
        const [_, filePath, ...contentArr] = cmd.split(' ');
        const content = contentArr.join(' ');
        const res = await fetch('/api/qmoi/file', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'write', filePath, content })
        });
        const data = await res.json();
        response = data.success ? `File ${filePath} updated.` : `Error: ${data.error}`;
      } else if (cmd.startsWith('/append ')) {
        const [_, filePath, ...contentArr] = cmd.split(' ');
        const content = contentArr.join(' ');
        const res = await fetch('/api/qmoi/file', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'append', filePath, content })
        });
        const data = await res.json();
        response = data.success ? `Appended to ${filePath}.` : `Error: ${data.error}`;
      } else if (cmd.startsWith('/replace ')) {
        const [_, filePath, search, ...replaceArr] = cmd.split(' ');
        const content = replaceArr.join(' ');
        const res = await fetch('/api/qmoi/file', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'replace', filePath, replace: search, content })
        });
        const data = await res.json();
        response = data.success ? `Replaced in ${filePath}.` : `Error: ${data.error}`;
      } else {
        response = 'Unknown command. Use /view, /edit, /append, /replace.';
      }
    } catch (e: any) {
      response = `Error: ${e.message}`;
    }
    setMessages(msgs => [...msgs, { user: 'master', text: cmd }, { user: 'qmoi', text: response }]);
    setLoading(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    handleCommand(input.trim());
    setInput('');
  }

  if (!isMaster) return null;

  return (
    <div style={{border: '1px solid #444', padding: 16, borderRadius: 8, background: '#181818', color: '#e0ffe0', marginTop: 16, maxWidth: 700}}>
      <h3>QMOI File Editor Chat (Master Only)</h3>
      <div style={{maxHeight: 240, overflowY: 'auto', marginBottom: 12, background: '#222', padding: 8, borderRadius: 6}}>
        {messages.map((m, i) => (
          <div key={i} style={{marginBottom: 6, color: m.user === 'master' ? '#fff' : '#0f0'}}><b>{m.user}:</b> {m.text}</div>
        ))}
        {loading && <div style={{color: '#ff0'}}>Processing...</div>}
      </div>
      <form onSubmit={handleSubmit} style={{display: 'flex', gap: 8}}>
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="/view /edit /append /replace ..." style={{flex: 1, background: '#111', color: '#e0ffe0', border: '1px solid #333', borderRadius: 4, padding: 8}} />
        <button type="submit" style={{background: '#0f0', color: '#111', border: 'none', borderRadius: 4, padding: '0 16px', fontWeight: 600}}>Send</button>
      </form>
    </div>
  );
} 