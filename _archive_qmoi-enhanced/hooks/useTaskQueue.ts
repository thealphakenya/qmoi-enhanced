import { useState, useEffect } from 'react';

export interface Task {
  id: string;
  type: 'media' | 'training' | 'inference' | 'maintenance' | 'backup';
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  progress: number;
  result?: any;
  error?: string;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  metadata: {
    [key: string]: any;
  };
}

export interface QueueStats {
  total: number;
  pending: number;
  running: number;
  completed: number;
  failed: number;
  cancelled: number;
  averageWaitTime: number;
  averageProcessingTime: number;
}

export interface TaskQueue {
  tasks: Task[];
  stats: QueueStats;
  settings: {
    maxConcurrentTasks: number;
    autoRetry: boolean;
    maxRetries: number;
    timeout: number;
  };
}

export function useTaskQueue() {
  const [queue, setQueue] = useState<TaskQueue>({
    tasks: [],
    stats: {
      total: 0,
      pending: 0,
      running: 0,
      completed: 0,
      failed: 0,
      cancelled: 0,
      averageWaitTime: 0,
      averageProcessingTime: 0,
    },
    settings: {
      maxConcurrentTasks: 5,
      autoRetry: true,
      maxRetries: 3,
      timeout: 3600, // 1 hour in seconds
    },
  });

  useEffect(() => {
    async function fetchQueue() {
      try {
        const adminToken = localStorage.getItem('adminToken') || '';
        const response = await fetch('/api/tasks/queue', {
          headers: { 'x-admin-token': adminToken },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch task queue');
        }

        const data = await response.json();
        setQueue(data);
      } catch (error) {
        console.error('Failed to fetch task queue:', error);
      }
    }

    fetchQueue();
    const interval = setInterval(fetchQueue, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const addTask = async (type: Task['type'], metadata: Task['metadata'], priority: Task['priority'] = 'medium') => {
    try {
      const adminToken = localStorage.getItem('adminToken') || '';
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': adminToken,
        },
        body: JSON.stringify({ type, metadata, priority }),
      });

      if (!response.ok) {
        throw new Error('Failed to add task');
      }

      const task = await response.json();
      setQueue(prev => ({
        ...prev,
        tasks: [...prev.tasks, task],
      }));

      return task;
    } catch (error) {
      console.error('Failed to add task:', error);
      throw error;
    }
  };

  const cancelTask = async (taskId: string) => {
    try {
      const adminToken = localStorage.getItem('adminToken') || '';
      const response = await fetch(`/api/tasks/${taskId}/cancel`, {
        method: 'POST',
        headers: { 'x-admin-token': adminToken },
      });

      if (!response.ok) {
        throw new Error('Failed to cancel task');
      }

      setQueue(prev => ({
        ...prev,
        tasks: prev.tasks.map(task =>
          task.id === taskId ? { ...task, status: 'cancelled' } : task
        ),
      }));

      return true;
    } catch (error) {
      console.error('Failed to cancel task:', error);
      throw error;
    }
  };

  const retryTask = async (taskId: string) => {
    try {
      const adminToken = localStorage.getItem('adminToken') || '';
      const response = await fetch(`/api/tasks/${taskId}/retry`, {
        method: 'POST',
        headers: { 'x-admin-token': adminToken },
      });

      if (!response.ok) {
        throw new Error('Failed to retry task');
      }

      const task = await response.json();
      setQueue(prev => ({
        ...prev,
        tasks: prev.tasks.map(t => (t.id === taskId ? task : t)),
      }));

      return task;
    } catch (error) {
      console.error('Failed to retry task:', error);
      throw error;
    }
  };

  const updateSettings = async (newSettings: Partial<TaskQueue['settings']>) => {
    try {
      const adminToken = localStorage.getItem('adminToken') || '';
      const response = await fetch('/api/tasks/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': adminToken,
        },
        body: JSON.stringify(newSettings),
      });

      if (!response.ok) {
        throw new Error('Failed to update settings');
      }

      const data = await response.json();
      setQueue(prev => ({
        ...prev,
        settings: {
          ...prev.settings,
          ...data.settings,
        },
      }));

      return data;
    } catch (error) {
      console.error('Failed to update settings:', error);
      throw error;
    }
  };

  return {
    queue,
    addTask,
    cancelTask,
    retryTask,
    updateSettings,
  };
} 