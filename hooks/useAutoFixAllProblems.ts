import { useEffect } from 'react';

export function useAutoFixAllProblems() {
  useEffect(() => {
    // Poll backend for all problems/errors and trigger auto-fix
    const interval = setInterval(async () => {
      // Use new globalScanFix endpoint for robust global fixing
      const res = await fetch('/api/qmoi-model?globalScanFix=1', {
        method: 'POST',
        headers: { 'x-admin-token': localStorage.getItem('adminToken') || '' },
      });
      const data = await res.json();
      if (data.status === 'all-fixed') {
        // Optionally notify user or update UI
        if (window && window.dispatchEvent) {
          window.dispatchEvent(new CustomEvent('ai-global-fix', { detail: data }));
        }
      }
    }, 20000);
    return () => clearInterval(interval);
  }, []);
}
