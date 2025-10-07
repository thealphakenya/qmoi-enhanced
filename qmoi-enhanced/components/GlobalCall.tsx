import React, { useState } from 'react';

export const GlobalCall: React.FC = () => {
  const [callState, setCallState] = useState<'idle' | 'calling' | 'connected' | 'ended'>('idle');
  const [callee, setCallee] = useState('');
  const [platform, setPlatform] = useState('globals');
  const [log, setLog] = useState<string[]>([]);

  const handleCall = () => {
    setCallState('calling');
    setLog(l => [...l, `Calling ${callee} via ${platform}...`]);
    setTimeout(() => {
      setCallState('connected');
      setLog(l => [...l, `Connected to ${callee} via ${platform}.`]);
    }, 2000);
  };

  const handleEnd = () => {
    setCallState('ended');
    setLog(l => [...l, `Call with ${callee} ended.`]);
  };

  return (
    <div style={{ padding: 16 }}>
      <h3>Global Call</h3>
      <input
        type="text"
        placeholder="Who do you want to call?"
        value={callee}
        onChange={e => setCallee(e.target.value)}
        style={{ marginBottom: 8, width: '100%' }}
      />
      <select value={platform} onChange={e => setPlatform(e.target.value)} style={{ marginBottom: 8, width: '100%' }}>
        <option value="globals">Globals</option>
        <option value="phone">Phone Dialer</option>
        <option value="whatsapp">WhatsApp</option>
        <option value="video">Global Video Call</option>
      </select>
      <button onClick={handleCall} disabled={callState === 'calling' || !callee} style={{ marginRight: 8 }}>
        {callState === 'calling' ? 'Calling...' : 'Call'}
      </button>
      <button onClick={handleEnd} disabled={callState !== 'connected'}>End Call</button>
      <div style={{ marginTop: 12, fontSize: 12, color: '#888', minHeight: 40 }}>
        {log.map((l, i) => <div key={i}>{l}</div>)}
      </div>
    </div>
  );
};
