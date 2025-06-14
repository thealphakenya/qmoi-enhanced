import { useEffect } from 'react';

export function useDeviceOptimizer() {
  useEffect(() => {
    // Poll backend for device optimization suggestions and apply automatically
    const interval = setInterval(async () => {
      const res = await fetch('/api/qmoi-model?deviceOptimize=1', {
        headers: { 'x-admin-token': localStorage.getItem('adminToken') || '' },
      });
      const data = await res.json();
      if (data.suggestions && data.suggestions.length) {
        for (const suggestion of data.suggestions) {
          await fetch('/api/qmoi-model?applyDeviceFeature=1', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-admin-token': localStorage.getItem('adminToken') || '' },
            body: JSON.stringify({ feature: suggestion }),
          });
        }
      }
    }, 60000);
    return () => clearInterval(interval);
  }, []);
}
