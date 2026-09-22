import { useEffect } from 'react';

export function useAutoEarningTasks() {
  useEffect(() => {
    // Poll backend for background earning tasks and trigger them
    const interval = setInterval(async () => {
      const res = await fetch('/api/qmoi-model?autoEarning=1', {
        headers: { 'x-admin-token': localStorage.getItem('adminToken') || '' },
      });
      const data = await res.json();
      if (data.tasks && data.tasks.length) {
        for (const task of data.tasks) {
          await fetch('/api/qmoi-model?runEarningTask=1', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-admin-token': localStorage.getItem('adminToken') || '' },
            body: JSON.stringify({ task }),
          });
        }
      }
    }, 60000);
    return () => clearInterval(interval);
  }, []);
}
