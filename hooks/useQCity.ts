import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation } from 'react-query';
import axios, { AxiosError } from 'axios';

export interface QCityStatus {
  running: boolean;
  platforms: Record<string, any>;
  features: Record<string, any>;
  resources: {
    cpu: number;
    memory: number;
    disk: number;
    network: number;
    gpu?: number;
    battery?: number;
  };
  tasks: any[];
  errors: {
    id: string;
    appId: string;
    type: string;
    message: string;
    timestamp: number;
    priority: 'low' | 'medium' | 'high' | 'critical';
    status: 'pending' | 'in-progress' | 'resolved';
  }[];
  backups: {
    id: string;
    timestamp: number;
    size: number;
    status: 'pending' | 'completed' | 'failed';
    type: 'full' | 'incremental';
  }[];
  performance: {
    startupTime: number;
    memoryUsage: number;
    cpuUsage: number;
    networkUsage: number;
    lastOptimization: number;
  };
}

interface QCityConfig {
  platforms: {
    colab: boolean;
    cloud: boolean;
    local: boolean;
    mobile: boolean;
    desktop: boolean;
  };
  features: {
    trading: boolean;
    whatsapp: boolean;
    projects: boolean;
    updates: boolean;
    errorTracking: boolean;
    autoBackup: boolean;
    resourceOptimization: boolean;
    performanceMonitoring: boolean;
    security: boolean;
  };
  resources: {
    max_cpu: number;
    max_memory: number;
    max_disk: number;
    max_network: number;
    max_gpu?: number;
    auto_scale: boolean;
    optimization_level: 'low' | 'medium' | 'high';
    backup_frequency: number;
    error_reporting: boolean;
  };
  security: {
    masterAccess: boolean;
    encryption: boolean;
    authentication: boolean;
    accessControl: boolean;
  };
  ui: {
    theme: 'light' | 'dark' | 'system';
    icon: string;
    showInTaskbar: boolean;
    notifications: boolean;
  };
}

export interface QCityError extends Error {
  code?: string;
  status?: number;
}

export function useQCity() {
  const [status, setStatus] = useState<QCityStatus | null>(null);
  const [config, setConfig] = useState<QCityConfig | null>(null);
  const [error, setError] = useState<QCityError | null>(null);

  // Fetch Q-city status
  const { data: statusData, refetch: refetchStatus } = useQuery<QCityStatus, AxiosError>(
    'qcity-status',
    async () => {
      const response = await axios.get('/api/qcity/status');
      return response.data;
    },
    {
      refetchInterval: 5000, // Poll every 5 seconds
      onError: (err: AxiosError) => setError(err as QCityError),
    }
  );

  // Fetch Q-city config
  const { data: configData, refetch: refetchConfig } = useQuery<QCityConfig, AxiosError>(
    'qcity-config',
    async () => {
      const response = await axios.get('/api/qcity/config');
      return response.data;
    },
    {
      onError: (err: AxiosError) => setError(err as QCityError),
    }
  );

  // Start Q-city
  const startMutation = useMutation<void, AxiosError>(
    async () => {
      const response = await axios.post('/api/qcity/start');
      return response.data;
    },
    {
      onSuccess: () => refetchStatus(),
      onError: (err: AxiosError) => setError(err as QCityError),
    }
  );

  // Stop Q-city
  const stopMutation = useMutation<void, AxiosError>(
    async () => {
      const response = await axios.post('/api/qcity/stop');
      return response.data;
    },
    {
      onSuccess: () => refetchStatus(),
      onError: (err: AxiosError) => setError(err as QCityError),
    }
  );

  // Configure platforms
  const configurePlatformsMutation = useMutation<void, AxiosError, Partial<QCityConfig['platforms']>>(
    async (config) => {
      const response = await axios.post('/api/qcity/configure-platforms', config);
      return response.data;
    },
    {
      onSuccess: () => {
        refetchConfig();
        refetchStatus();
      },
      onError: (err: AxiosError) => setError(err as QCityError),
    }
  );

  // Enable features
  const enableFeaturesMutation = useMutation<void, AxiosError, string[]>(
    async (features) => {
      const response = await axios.post('/api/qcity/enable-features', { features });
      return response.data;
    },
    {
      onSuccess: () => {
        refetchConfig();
        refetchStatus();
      },
      onError: (err: AxiosError) => setError(err as QCityError),
    }
  );

  // Monitor resources
  const monitorResourcesMutation = useMutation<void, AxiosError>(
    async () => {
      const response = await axios.post('/api/qcity/monitor-resources');
      return response.data;
    },
    {
      onSuccess: () => refetchStatus(),
      onError: (err: AxiosError) => setError(err as QCityError),
    }
  );

  // Add new mutation for error tracking
  const trackErrorMutation = useMutation<void, AxiosError, QCityStatus['errors'][0]>(
    async (error: QCityStatus['errors'][0]) => {
      const response = await axios.post('/api/qcity/track-error', error);
      return response.data;
    },
    {
      onSuccess: () => refetchStatus(),
      onError: (err: AxiosError) => setError(err as QCityError),
    }
  );

  // Add new mutation for backup management
  const manageBackupMutation = useMutation<void, AxiosError, { type: 'create' | 'restore', backupId?: string }>(
    async (action: { type: 'create' | 'restore', backupId?: string }) => {
      const response = await axios.post('/api/qcity/manage-backup', action);
      return response.data;
    },
    {
      onSuccess: () => refetchStatus(),
      onError: (err: AxiosError) => setError(err as QCityError),
    }
  );

  // Add new mutation for resource optimization
  const optimizeResourcesMutation = useMutation<void, AxiosError>(
    async () => {
      const response = await axios.post('/api/qcity/optimize-resources');
      return response.data;
    },
    {
      onSuccess: () => refetchStatus(),
      onError: (err: AxiosError) => setError(err as QCityError),
    }
  );

  // Update status and config when data changes
  useEffect(() => {
    if (statusData) {
      setStatus(statusData);
    }
  }, [statusData]);

  useEffect(() => {
    if (configData) {
      setConfig(configData);
    }
  }, [configData]);

  // Start Q-city
  const start = useCallback(() => {
    startMutation.mutate();
  }, [startMutation]);

  // Stop Q-city
  const stop = useCallback(() => {
    stopMutation.mutate();
  }, [stopMutation]);

  // Configure platforms
  const configurePlatforms = useCallback(
    (config: Partial<QCityConfig['platforms']>) => {
      configurePlatformsMutation.mutate(config);
    },
    [configurePlatformsMutation]
  );

  // Enable features
  const enableFeatures = useCallback(
    (features: string[]) => {
      enableFeaturesMutation.mutate(features);
    },
    [enableFeaturesMutation]
  );

  // Monitor resources
  const monitorResources = useCallback(() => {
    monitorResourcesMutation.mutate();
  }, [monitorResourcesMutation]);

  return {
    status,
    config,
    error,
    start,
    stop,
    configurePlatforms,
    enableFeatures,
    monitorResources,
    refetchStatus,
    refetchConfig,
    trackError: (error: QCityStatus['errors'][0]) => trackErrorMutation.mutate(error),
    manageBackup: (action: { type: 'create' | 'restore', backupId?: string }) => manageBackupMutation.mutate(action),
    optimizeResources: () => optimizeResourcesMutation.mutate(),
  };
}

// Hook for Q-city notifications
export function useQCityNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);

  // Fetch notifications
  const { data: notificationData, refetch: refetchNotifications } = useQuery<any[], AxiosError>(
    'qcity-notifications',
    async () => {
      const response = await axios.get('/api/qcity/notifications');
      return response.data;
    },
    {
      refetchInterval: 10000, // Poll every 10 seconds
    }
  );

  // Update notifications when data changes
  useEffect(() => {
    if (notificationData) {
      setNotifications(notificationData);
    }
  }, [notificationData]);

  return {
    notifications,
    refetchNotifications,
  };
}

// Hook for Q-city tasks
export function useQCityTasks() {
  const [tasks, setTasks] = useState<any[]>([]);

  // Fetch tasks
  const { data: taskData, refetch: refetchTasks } = useQuery<any[], AxiosError>(
    'qcity-tasks',
    async () => {
      const response = await axios.get('/api/qcity/tasks');
      return response.data;
    },
    {
      refetchInterval: 5000, // Poll every 5 seconds
    }
  );

  // Update tasks when data changes
  useEffect(() => {
    if (taskData) {
      setTasks(taskData);
    }
  }, [taskData]);

  return {
    tasks,
    refetchTasks,
  };
}

// Hook for Q-city resources
export function useQCityResources() {
  const [resources, setResources] = useState<any>(null);

  // Fetch resources
  const { data: resourceData, refetch: refetchResources } = useQuery<any, AxiosError>(
    'qcity-resources',
    async () => {
      const response = await axios.get('/api/qcity/resources');
      return response.data;
    },
    {
      refetchInterval: 1000, // Poll every second
    }
  );

  // Update resources when data changes
  useEffect(() => {
    if (resourceData) {
      setResources(resourceData);
    }
  }, [resourceData]);

  return {
    resources,
    refetchResources,
  };
}

// Hook for Q-city logs
export function useQCityLogs() {
  const [logs, setLogs] = useState<any[]>([]);

  // Fetch logs
  const { data: logData, refetch: refetchLogs } = useQuery<any[], AxiosError>(
    'qcity-logs',
    async () => {
      const response = await axios.get('/api/qcity/logs');
      return response.data;
    },
    {
      refetchInterval: 5000, // Poll every 5 seconds
    }
  );

  // Update logs when data changes
  useEffect(() => {
    if (logData) {
      setLogs(logData);
    }
  }, [logData]);

  return {
    logs,
    refetchLogs,
  };
} 