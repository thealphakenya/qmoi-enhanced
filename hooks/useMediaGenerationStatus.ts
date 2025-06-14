import { useEffect, useState } from 'react';

export function useMediaGenerationStatus() {
  const [mediaStatus, setMediaStatus] = useState('idle');
  useEffect(() => {
    // Poll backend for media/animation generation status
    const interval = setInterval(async () => {
      const res = await fetch('/api/qmoi-model?mediaStatus=1', {
        headers: { 'x-admin-token': localStorage.getItem('adminToken') || '' },
      });
      const data = await res.json();
      setMediaStatus(data.status || 'idle');
    }, 30000);
    return () => clearInterval(interval);
  }, []);
  return mediaStatus;
}