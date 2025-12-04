import React, { useState } from 'react';
import { sendMail } from '@/adapters/clientAdapters';

export const GlobalMail: React.FC = () => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    const payload = { to, subject, body };
    try {
      const ok = await sendMail(payload);
      setSent(Boolean(ok));
      if (ok) {
        setTo(''); setSubject(''); setBody('');
        setTimeout(() => setSent(false), 2000);
      }
    } catch (err) {
      console.error('sendMail failed', err);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h3>Global Mail</h3>
      <input
        type="email"
        placeholder="Recipient Email"
        value={to}
        onChange={e => setTo(e.target.value)}
        style={{ marginBottom: 8, width: '100%' }}
      />
      <input
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={e => setSubject(e.target.value)}
        style={{ marginBottom: 8, width: '100%' }}
      />
      <textarea
        placeholder="Message Body"
        value={body}
        onChange={e => setBody(e.target.value)}
        style={{ marginBottom: 8, width: '100%' }}
        rows={4}
      />
      <button onClick={handleSend} disabled={!to || !subject || !body || sent}>
        {sent ? 'Sent!' : 'Send Mail'}
      </button>
      <div style={{ marginTop: 12, fontSize: 12, color: '#888' }}>
        {sent && 'Mail sent successfully'}
      </div>
    </div>
  );
};
