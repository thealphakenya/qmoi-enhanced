import { useEffect, useState } from 'react';

export function useTradingAutomation() {
  const [tradingStatus, setTradingStatus] = useState('idle');
  useEffect(() => {
    // Poll backend for trading status and trigger strategies
    const interval = setInterval(async () => {
      const res = await fetch('/api/qi-trading?action=auto', {
        headers: { 'x-admin-token': localStorage.getItem('adminToken') || '' },
      });
      const data = await res.json();
      setTradingStatus(data.status || 'idle');
      // Optionally trigger strategy switch or alert
    }, 30000);
    return () => clearInterval(interval);
  }, []);
  return tradingStatus;
}