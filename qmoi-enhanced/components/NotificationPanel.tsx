import React, { useEffect, useState } from 'react';

interface NotificationPanelProps {
  className?: string;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ className }) => {
  const [notifications, setNotifications] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai-health');
      const data = await res.json();
      setNotifications((data.notifications || []).slice(-10).reverse());
    } catch (e) {
      setNotifications(['Failed to fetch notifications.']);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={className || ''} style={{ border: '1px solid #eee', borderRadius: 8, padding: 16, background: '#fafbfc', minWidth: 320 }}>
      <h3 style={{ marginBottom: 12 }}>Recent Notifications</h3>
      {loading ? (
        <div>Loading...</div>
      ) : notifications.length === 0 ? (
        <div>No notifications found.</div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {notifications.map((n, i) => (
            <li key={i} style={{ marginBottom: 8, fontSize: 14, color: n.includes('error') ? '#d32f2f' : n.includes('warning') ? '#fbc02d' : '#388e3c' }}>
              {n}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}; 