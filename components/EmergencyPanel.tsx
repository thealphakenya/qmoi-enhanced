import React, { useState } from 'react';

export const EmergencyPanel: React.FC = () => {
  const [status, setStatus] = useState('');

  const postAdapter = async (endpoint: string, body: any) => {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const text = await res.text();
      let parsed: any = text;
      try {
        parsed = JSON.parse(text || '{}');
      } catch (e) {
        // keep raw text
      }
      return { ok: res.ok, status: res.status, body: parsed };
    } catch (e: any) {
      return { ok: false, error: String(e) };
    }
  };

  const handleSOS = async () => {
    setStatus('🚨 Sending SOS (dry-run)...');
    const r = await postAdapter('/api/adapters/telephony', { action: 'sos', dryRun: true });
    if (r.ok) {
      setStatus(`🚨 SOS logged (dry-run). Adapter response: ${JSON.stringify(r.body)}`);
    } else {
      setStatus(`🚨 SOS failed (dry-run). ${r.error || JSON.stringify(r.body)}`);
    }
  };

  const handleLockdown = async () => {
    setStatus('🔒 Lockdown requested (dry-run)...');
    const r = await postAdapter('/api/adapters/telephony', { action: 'lockdown_notify', dryRun: true });
    if (r.ok) {
      setStatus(`🔒 Lockdown intent logged (dry-run). Adapter response: ${JSON.stringify(r.body)}`);
    } else {
      setStatus(`🔒 Lockdown failed (dry-run). ${r.error || JSON.stringify(r.body)}`);
    }
  };

  const handleWipe = async () => {
    // Intentionally conservative: only log intent via mail adapter in dry-run.
    setStatus('🧹 Secure wipe intent logged (dry-run)...');
    const r = await postAdapter('/api/adapters/mail', { action: 'secure_wipe_intent', dryRun: true, note: 'User requested secure wipe (dry-run)' });
    if (r.ok) {
      setStatus(`🧹 Wipe intent recorded (dry-run). Adapter response: ${JSON.stringify(r.body)}`);
    } else {
      setStatus(`🧹 Wipe logging failed (dry-run). ${r.error || JSON.stringify(r.body)}`);
    }
  };

  const handleAlert = async () => {
    setStatus('⚠️ Sending alert (dry-run)...');
    const r = await postAdapter('/api/adapters/telephony', { action: 'alert_trusted', dryRun: true });
    if (r.ok) {
      setStatus(`⚠️ Alert logged (dry-run). Adapter response: ${JSON.stringify(r.body)}`);
    } else {
      setStatus(`⚠️ Alert failed (dry-run). ${r.error || JSON.stringify(r.body)}`);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h3>Emergency Protocols & Alerts</h3>
      <button onClick={handleSOS} style={{ margin: 4 }}>🚨 SOS</button>
      <button onClick={handleLockdown} style={{ margin: 4 }}>🔒 Lockdown</button>
      <button onClick={handleWipe} style={{ margin: 4 }}>🧹 Secure Wipe</button>
      <button onClick={handleAlert} style={{ margin: 4 }}>⚠️ Instant Alert</button>
      <div style={{ marginTop: 12, fontSize: 14, color: '#d00' }}>{status}</div>
      <div style={{ marginTop: 16, fontSize: 12, color: '#888' }}>
        All actions are dry-run for demo. In production these actions will trigger real device, cloud, and contact actions. To enable live behavior set <code>PRODUCTION_CONFIRMED=true</code> and provide required provider credentials (see PRODUCTIONCHECKLIST.md).
      </div>
    </div>
  );
};
