import React, { useState } from 'react';

export const WifiAutoConnectPanel: React.FC = () => {
  const [networks, setNetworks] = useState<any[]>([]);
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'wifi' | 'zero-rated'>('wifi');

  // Simulate scanning for WiFi and zero-rated networks
  const scanNetworks = async () => {
    setConnecting(true);
    setError(null);
    setTimeout(() => {
      setNetworks([
        { ssid: 'Home WiFi', open: false, signal: 90 },
        { ssid: 'Free Public WiFi', open: true, signal: 70 },
        { ssid: 'ZeroRatedSite', open: true, zeroRated: true, signal: 60 },
        { ssid: 'Office WiFi', open: false, signal: 80 },
      ]);
      setConnecting(false);
    }, 1200);
  };

  // Simulate connecting to a network
  const connect = (ssid: string, zeroRated?: boolean) => {
    setConnecting(true);
    setError(null);
    setTimeout(() => {
      setConnected(ssid);
      setConnecting(false);
    }, 1000);
  };

  // Auto-connect logic: prioritize WiFi, then zero-rated
  React.useEffect(() => {
    scanNetworks();
  }, []);

  React.useEffect(() => {
    if (networks.length > 0 && !connected) {
      const wifi = networks.find(n => n.open && !n.zeroRated);
      const zero = networks.find(n => n.zeroRated);
      if (mode === 'wifi' && wifi) connect(wifi.ssid);
      else if (mode === 'zero-rated' && zero) connect(zero.ssid, true);
    }
  }, [networks, mode, connected]);

  return (
    <div style={{ padding: 16 }}>
      <h3>WiFi & Zero-Rated Auto-Connect</h3>
      <div style={{ marginBottom: 8 }}>
        <b>Mode:</b>
        <select value={mode} onChange={e => setMode(e.target.value as any)} style={{ marginLeft: 8 }}>
          <option value="wifi">WiFi Auto-Connect</option>
          <option value="zero-rated">Zero-Rated (Free Internet)</option>
        </select>
      </div>
      <button onClick={scanNetworks} disabled={connecting} style={{ marginBottom: 8 }}>
        {connecting ? 'Scanning...' : 'Rescan Networks'}
      </button>
      <div style={{ marginBottom: 8 }}>
        <b>Status:</b> {connected ? `Connected to ${connected}` : 'Not connected'}
      </div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
        {networks.map((n, i) => (
          <li key={n.ssid} style={{ marginBottom: 4 }}>
            <span>{n.ssid}</span>
            {n.zeroRated && <span style={{ color: '#22c55e', marginLeft: 8 }}>(Zero-Rated)</span>}
            <span style={{ marginLeft: 8, color: n.open ? '#0a0' : '#a00' }}>{n.open ? 'Open' : 'Secured'}</span>
            <span style={{ marginLeft: 8 }}>Signal: {n.signal}%</span>
            <button onClick={() => connect(n.ssid, n.zeroRated)} disabled={connecting || connected === n.ssid} style={{ marginLeft: 8 }}>
              {connected === n.ssid ? 'Connected' : 'Connect'}
            </button>
          </li>
        ))}
      </ul>
      <div style={{ marginTop: 12, fontSize: 12, color: '#888' }}>
        Prioritizes WiFi auto-connect, then zero-rated (free) internet if WiFi is unavailable. Uses minimal data when not on WiFi.
      </div>
    </div>
  );
};
