import React, { useState } from 'react';

export const GlobalVideoCall: React.FC = () => {
  const [callState, setCallState] = useState<'idle' | 'calling' | 'connected' | 'ended'>('idle');
  const [callee, setCallee] = useState('');
  const [log, setLog] = useState<string[]>([]);

  const handleCall = () => {
    setCallState('calling');
    setLog(l => [...l, `Starting video call with ${callee}...`]);
    setTimeout(() => {
      setCallState('connected');
      setLog(l => [...l, `Video call connected with ${callee}.`]);
    }, 2000);
  };

  const handleEnd = () => {
    setCallState('ended');
    setLog(l => [...l, `Video call with ${callee} ended.`]);
  };

  return (
    <div style={{ padding: 16 }}>
      <h3>Global Video Call</h3>
      <input
        type="text"
        placeholder="Who do you want to video call?"
        value={callee}
        onChange={e => setCallee(e.target.value)}
        style={{ marginBottom: 8, width: '100%' }}
      />
      <button onClick={handleCall} disabled={callState === 'calling' || !callee} style={{ marginRight: 8 }}>
        {callState === 'calling' ? 'Calling...' : 'Start Video Call'}
      </button>
      <button onClick={handleEnd} disabled={callState !== 'connected'}>End Call</button>
      <div style={{ marginTop: 12, fontSize: 12, color: '#888', minHeight: 40 }}>
        {log.map((l, i) => <div key={i}>{l}</div>)}
      </div>
      {callState === 'connected' && (
        <div style={{ marginTop: 16, background: '#222', color: '#fff', padding: 16, borderRadius: 8 }}>
          <b>Video Stream Preview (Simulated)</b>
          <div style={{ width: 240, height: 160, background: '#444', margin: '12px 0', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span>📹 Video Stream</span>
          </div>
        </div>
      )}
    </div>
  );
};
