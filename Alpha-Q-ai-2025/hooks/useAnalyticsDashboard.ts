import { useEffect, useState } from 'react';

export function useAnalyticsDashboard() {
  const [analytics, setAnalytics] = useState(null);
  useEffect(() => {
    const fetchAnalytics = async () => {
      const res = await fetch('/api/qmoi-model?analytics=1', {
        headers: { 'x-admin-token': localStorage.getItem('adminToken') || '' },
      });
      const data = await res.json();
      setAnalytics(data);
    };
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 30000);
    return () => clearInterval(interval);
  }, []);
  return analytics;
}