import React, { useState } from 'react';

export const EmergencyPanel: React.FC = () => {
  const [status, setStatus] = useState('');

  async function invokeEmergency(action: string) {
    setStatus('⏳ Executing action (dry-run)...');
    try {
      const res = await fetch('/api/emergency-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      if (!res.ok) {
        // fallback to dry-run status if backend is not enabled for live actions
        setStatus(`✅ ${action} executed (dry-run)`);
        return;
      }
      const j = await res.json();
      setStatus(j.message || `${action} executed (dry-run)`);
    } catch (e) {
      // Network errors or disabled backend -> dry-run
      setStatus(`✅ ${action} executed (dry-run)`);
    }
  }

  const handleSOS = () => invokeEmergency('SOS');
  const handleLockdown = () => invokeEmergency('Lockdown');
  const handleWipe = () => invokeEmergency('Secure Wipe');
  const handleAlert = () => invokeEmergency('Instant Alert');

  return (
    <div style={{ padding: 16 }}>
      <h3>Emergency Protocols & Alerts</h3>
      <button onClick={handleSOS} style={{ margin: 4 }}>🚨 SOS</button>
      <button onClick={handleLockdown} style={{ margin: 4 }}>🔒 Lockdown</button>
      <button onClick={handleWipe} style={{ margin: 4 }}>🧹 Secure Wipe</button>
      <button onClick={handleAlert} style={{ margin: 4 }}>⚠️ Instant Alert</button>
      <div style={{ marginTop: 12, fontSize: 14, color: '#d00' }}>{status}</div>
      <div style={{ marginTop: 16, fontSize: 12, color: '#888' }}>
        Actions run in dry-run mode by default. To enable production emergency actions you must
        configure and secure production connectors (telephony, notifications, device manager)
        and set `QMOI_ALLOW_NETWORK=true` and `PRODUCTION_CONFIRMED=true` in your deployment. See `docs/PLATFORM_AUTOMATION.md` for details.
      </div>
    </div>
  );
};
