import { useState, useEffect } from 'react';

export interface MediaStatus {
  status: 'idle' | 'generating' | 'completed' | 'error';
  lastGenerated?: string;
  nextScheduled?: string;
  currentTask?: {
    id: string;
    type: 'audio' | 'video' | 'image';
    prompt: string;
    progress: number;
    startTime: string;
  };
  settings: {
    maxConcurrentTasks: number;
    outputQuality: 'high' | 'medium' | 'low';
    autoSave: boolean;
    defaultFormat: string;
  };
}

export function useMediaGenerationStatus() {
  const [status, setStatus] = useState<MediaStatus>({
    status: 'idle',
    settings: {
      maxConcurrentTasks: 3,
      outputQuality: 'high',
      autoSave: true,
      defaultFormat: 'mp4',
    },
  });

  const generateMedia = async (type: 'audio' | 'video' | 'image', prompt: string) => {
    try {
      const adminToken = localStorage.getItem('adminToken') || '';
      const response = await fetch('/api/media/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': adminToken,
        },
        body: JSON.stringify({ type, prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate media');
      }

      const data = await response.json();
      setStatus(prev => ({
        ...prev,
        status: 'generating',
        currentTask: {
          id: data.taskId,
          type,
          prompt,
          progress: 0,
          startTime: new Date().toISOString(),
        },
      }));

      return data;
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        status: 'error',
      }));
      throw error;
    }
  };

  const updateSettings = async (newSettings: Partial<MediaStatus['settings']>) => {
    try {
      const adminToken = localStorage.getItem('adminToken') || '';
      const response = await fetch('/api/media/settings', {
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
      setStatus(prev => ({
        ...prev,
        settings: {
          ...prev.settings,
          ...data.settings,
        },
      }));

      return data;
    } catch (error) {
      throw error;
    }
  };

  const cancelTask = async (taskId: string) => {
    try {
      const adminToken = localStorage.getItem('adminToken') || '';
      const response = await fetch(`/api/media/cancel/${taskId}`, {
        method: 'POST',
        headers: {
          'x-admin-token': adminToken,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to cancel task');
      }

      setStatus(prev => ({
        ...prev,
        status: 'idle',
        currentTask: undefined,
      }));

      return true;
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    async function fetchStatus() {
      try {
        const adminToken = localStorage.getItem('adminToken') || '';
        const response = await fetch('/api/media/status', {
          headers: { 'x-admin-token': adminToken },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch media status');
        }

        const data = await response.json();
        setStatus(prev => ({
          ...prev,
          ...data,
        }));
      } catch (error) {
        console.error('Failed to fetch media status:', error);
      }
    }

    fetchStatus();
    const interval = setInterval(fetchStatus, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return {
    status,
    generateMedia,
    updateSettings,
    cancelTask,
  };
}