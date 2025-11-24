import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Notification system for real-time events (Colab jobs, project status, etc.)
export function NotificationCenter() {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    function handleColabJobComplete(e: any) {
      setNotifications((prev) => [
        { type: 'colab', message: 'Colab job completed!', detail: e.detail, time: new Date() },
        ...prev,
      ]);
    }
    window.addEventListener('colab-job-complete', handleColabJobComplete);
    return () => window.removeEventListener('colab-job-complete', handleColabJobComplete);
  }, []);

  // Add more event listeners for other real-time events as needed

  return (
    <Card className="fixed top-4 right-4 w-96 z-50 shadow-lg">
      <CardContent>
        <h3 className="font-bold mb-2">Notifications</h3>
        {notifications.length === 0 && <div className="text-gray-400">No notifications</div>}
        {notifications.map((n, i) => (
          <div key={i} className="mb-2 p-2 border rounded bg-white/80 flex flex-col">
            <Badge className="mb-1" variant="outline">{n.type}</Badge>
            <span>{n.message}</span>
            {n.detail && <pre className="text-xs text-gray-600 whitespace-pre-wrap">{JSON.stringify(n.detail, null, 2)}</pre>}
            <span className="text-xs text-gray-400 mt-1">{n.time.toLocaleTimeString()}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
