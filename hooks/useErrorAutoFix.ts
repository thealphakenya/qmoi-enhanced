// --- Hook: useErrorAutoFix ---
import { useEffect } from 'react';

export function useErrorAutoFix() {
  useEffect(() => {
    // Poll backend for errors and trigger global scan/fix
    const interval = setInterval(async () => {
      const res = await fetch('/api/qmoi-model?globalScanFix=1', {
        method: 'POST',
        headers: { 'x-admin-token': localStorage.getItem('adminToken') || '' },
      });
      const data = await res.json();
      if (data.status === 'all-fixed') {
        if (window && window.dispatchEvent) {
          window.dispatchEvent(new CustomEvent('ai-global-fix', { detail: data }));
        }
      }
    }, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);
}