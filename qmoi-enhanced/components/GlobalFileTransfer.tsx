import React, { useState } from 'react';

export const GlobalFileTransfer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [recipient, setRecipient] = useState('');
  const [status, setStatus] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSend = () => {
    if (!file || !recipient) return;
    setStatus('Transferring...');
    setTimeout(() => {
      setStatus(`File "${file.name}" sent to ${recipient} (simulated).`);
    }, 2000);
  };

  return (
    <div style={{ padding: 16 }}>
      <h3>Global File Transfer</h3>
      <input
        type="text"
        placeholder="Recipient (name/email)"
        value={recipient}
        onChange={e => setRecipient(e.target.value)}
        style={{ marginBottom: 8, width: '100%' }}
      />
      <input
        type="file"
        onChange={handleFileChange}
        style={{ marginBottom: 8, width: '100%' }}
      />
      <button onClick={handleSend} disabled={!file || !recipient}>
        Send File
      </button>
      <div style={{ marginTop: 12, fontSize: 12, color: '#888' }}>{status}</div>
    </div>
  );
};
