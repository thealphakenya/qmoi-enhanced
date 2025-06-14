import React, { useState, useCallback } from 'react';

interface Download {
  url: string;
  status: string;
  time: string;
}

const DownloadList = React.memo(({ downloads }: { downloads: Download[] }) => (
  <ul style={{ marginTop: 16, fontSize: 14 }}>
    {downloads.map((dl, i) => (
      <li key={i}>{dl.url} - {dl.status} <span style={{ color: '#aaa' }}>({dl.time})</span></li>
    ))}
  </ul>
));

export const DownloadManager: React.FC = () => {
  const [downloads, setDownloads] = useState<Download[]>([]);
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('');

  // Use requestIdleCallback for non-urgent UI updates if available
  const addDownload = useCallback((download: Download) => {
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => {
        setDownloads(dls => [...dls, download]);
      });
    } else {
      setDownloads(dls => [...dls, download]);
    }
  }, []);

  const handleDownload = useCallback(() => {
    if (!url) return;
    setStatus('Starting download...');
    setTimeout(() => {
      addDownload({ url, status: 'Completed', time: new Date().toLocaleTimeString() });
      setStatus('Download complete.');
      setUrl('');
    }, 1500);
  }, [url, addDownload]);

  return (
    <div style={{ padding: 16 }}>
      <h3>Download Manager</h3>
      <input
        type="text"
        placeholder="Enter file URL"
        value={url}
        onChange={e => setUrl(e.target.value)}
        style={{ marginBottom: 8, width: '100%' }}
      />
      <button onClick={handleDownload} disabled={!url}>Download</button>
      <div style={{ marginTop: 12, fontSize: 12, color: '#888' }}>{status}</div>
      <DownloadList downloads={downloads} />
    </div>
  );
};
