import { useEffect } from 'react';

interface GlobalFixResponse {
  status: string;
  time: string;
}

interface GlobalFixEventDetail extends GlobalFixResponse {
  // Add any additional properties that might be included in the event detail
}

export function useAutoFixAllProblems() {
  useEffect(() => {
    // Poll backend for all problems/errors and trigger auto-fix
    const interval = setInterval(async () => {
      // Use new globalScanFix endpoint for robust global fixing
      const res = await fetch('/api/qmoi-model?globalScanFix=1', {
        method: 'POST',
        headers: { 'x-admin-token': localStorage.getItem('adminToken') || '' },
      });
      const data = await res.json() as GlobalFixResponse;
      if (data.status === 'all-fixed') {
        // Optionally notify user or update UI
        if (window && window.dispatchEvent) {
          window.dispatchEvent(new CustomEvent('ai-global-fix', { 
            detail: data as GlobalFixEventDetail 
          }));
        }
      }
    }, 20000);
    return () => clearInterval(interval);
  }, []);
}
