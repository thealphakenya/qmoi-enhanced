import { useEffect, useState } from 'react';

export function useGlobalAutomation() {
  const [automationStatus, setAutomationStatus] = useState('idle');
  useEffect(() => {
    // Poll backend for global automation status
    const interval = setInterval(async () => {
      const res = await fetch('/api/qmoi-model?globalAutomation=1', {
        headers: { 'x-admin-token': localStorage.getItem('adminToken') || '' },
      });
      const data = await res.json();
      setAutomationStatus(data.status || 'idle');
    }, 60000);
    return () => clearInterval(interval);
  }, []);
  return automationStatus;
}
