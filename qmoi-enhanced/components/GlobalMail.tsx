import React, { useState } from 'react';

/**
 * GlobalMail
 * Production-ready mail UI scaffold:
 * - Sends POST to configurable backend endpoint (REACT_APP_MAIL_SERVICE_URL or /api/mail/send)
 * - Supports dry-run via REACT_APP_MAIL_DRY_RUN=true
 * - Attaches Authorization header from localStorage auth_token if present
 */
export const GlobalMail: React.FC = () => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endpoint = (process.env.REACT_APP_MAIL_SERVICE_URL as string) || '/api/mail/send';
  const dryRun = (process.env.REACT_APP_MAIL_DRY_RUN || 'false').toLowerCase() === 'true';

  const handleSend = async () => {
    setError(null);
    if (!to || !subject || !body) return;
    setSent(true);

    const payload = { to, subject, body };

    if (dryRun) {
      // Record dry-run locally for audit
      try {
        const logDir = (window as any).__QMOINTERNAL__?.validationPath || '/tmp';
        // best-effort: write to localStorage audit log
        const audits = JSON.parse(localStorage.getItem('qmoi_mail_audits' ) || '[]');
        audits.push({ payload, timestamp: new Date().toISOString(), dryRun: true });
        localStorage.setItem('qmoi_mail_audits', JSON.stringify(audits));
      } catch (e) {
        // ignore
      }
      setTimeout(() => setSent(false), 1500);
      return;
    }

    try {
      const headers: Record<string,string> = { 'Content-Type': 'application/json' };
      const token = localStorage.getItem('auth_token') || (window as any).AUTH_TOKEN;
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const resp = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`${resp.status} ${resp.statusText} — ${text}`);
      }

      setTimeout(() => setSent(false), 1500);
    } catch (e: any) {
      setError(String(e));
      setSent(false);
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
        {sent ? 'Sending...' : 'Send Mail'}
      </button>
      <div style={{ marginTop: 12, fontSize: 12, color: error ? '#a00' : '#888' }}>
        {error ? `Error: ${error}` : sent ? 'Mail send queued' : 'Ready'}
      </div>
    </div>
  );
};

export default GlobalMail;
