import React, { useRef, useState } from 'react';

/**
 * GlobalFileTransfer
 * Production-ready upload scaffold:
 * - Uploads the selected file to a configurable backend endpoint
 * - Sends `recipient` as form data
 * - Reports upload progress and errors
 * - Uses REACT_APP_FILE_TRANSFER_URL or falls back to `/api/files/upload`
 *
 * Notes for production:
 * - Backend must validate recipient and authenticate requests (JWT/API key)
 * - Consider signed URLs or chunked uploads for large files
 */
export const GlobalFileTransfer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [recipient, setRecipient] = useState('');
  const [status, setStatus] = useState('');
  const [progress, setProgress] = useState<number | null>(null);
  const xhrRef = useRef<XMLHttpRequest | null>(null);

  const backendUrl = (process.env.REACT_APP_FILE_TRANSFER_URL as string) || '/api/files/upload';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus('');
      setProgress(null);
    }
  };

  const handleSend = () => {
    if (!file || !recipient) return;
    setStatus('Starting upload...');
    setProgress(0);

    const form = new FormData();
    form.append('file', file);
    form.append('recipient', recipient);

    const xhr = new XMLHttpRequest();
    xhrRef.current = xhr;

    xhr.upload.onprogress = (ev: ProgressEvent) => {
      if (ev.lengthComputable) {
        const pct = Math.round((ev.loaded / ev.total) * 100);
        setProgress(pct);
        setStatus(`Uploading... ${pct}%`);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const resp = JSON.parse(xhr.responseText || '{}');
          setStatus(resp.message || `File "${file.name}" sent to ${recipient}.`);
        } catch (e) {
          setStatus(`Upload completed: ${xhr.statusText || xhr.status}`);
        }
        setProgress(100);
      } else {
        setStatus(`Upload failed: ${xhr.status} ${xhr.statusText}`);
      }
      xhrRef.current = null;
    };

    xhr.onerror = () => {
      setStatus('Upload failed due to network error.');
      xhrRef.current = null;
    };

    xhr.open('POST', backendUrl, true);
    // Optional: attach auth header if available (backend should prefer cookie or signed URL)
    const token = localStorage.getItem('auth_token') || (window as any).AUTH_TOKEN;
    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }

    xhr.send(form);
  };

  const handleCancel = () => {
    if (xhrRef.current) {
      xhrRef.current.abort();
      setStatus('Upload cancelled.');
      setProgress(null);
      xhrRef.current = null;
    }
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
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={handleSend} disabled={!file || !recipient}>
          Send File
        </button>
        <button onClick={handleCancel} disabled={!xhrRef.current}>
          Cancel
        </button>
      </div>

      <div style={{ marginTop: 12, fontSize: 12, color: '#888' }}>
        {progress !== null ? `Progress: ${progress}% — ${status}` : status}
      </div>
    </div>
  );
};

export default GlobalFileTransfer;
