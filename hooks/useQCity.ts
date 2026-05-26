import { useCallback, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useMutation, useQuery } from "react-query";

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
  tasks: unknown[];
  errors: {
    id: string;
    appId: string;
    type: string;
    message: string;
    timestamp: number;
    priority: "low" | "medium" | "high" | "critical";
    status: "pending" | "in-progress" | "resolved";
  }[];
  backups: {
    id: string;
    timestamp: number;
    size: number;
    status: "pending" | "completed" | "failed";
    type: "full" | "incremental";
  }[];
  performance: {
    startupTime: number;
    memoryUsage: number;
    cpuUsage: number;
    networkUsage: number;
    lastOptimization: number;
  };
}

export interface QCityConfig {
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
    optimization_level: "low" | "medium" | "high";
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
    theme: "light" | "dark" | "system";
    icon: string;
    showInTaskbar: boolean;
    notifications: boolean;
  };
}

export interface QCityError extends Error {
  code?: string;
  status?: number;
}

const axiosClient = axios.create({
  baseURL: "/api/qcity",
  headers: {
    "Content-Type": "application/json",
  },
});

export function useQCity() {
  const [status, setStatus] = useState<QCityStatus | null>(null);
  const [config, setConfig] = useState<QCityConfig | null>(null);
  const [error, setError] = useState<QCityError | null>(null);

  const { data: statusData, refetch: refetchStatus } = useQuery<QCityStatus, AxiosError>(
    "qcity-status",
    async () => {
      const response = await axiosClient.get("/status");
      return response.data;
    },
    {
      refetchInterval: 5000,
      onError: (err: AxiosError) => setError(err as QCityError),
    },
  );

  const { data: configData, refetch: refetchConfig } = useQuery<QCityConfig, AxiosError>(
    "qcity-config",
    async () => {
      const response = await axiosClient.get("/config");
      return response.data;
    },
    {
      onError: (err: AxiosError) => setError(err as QCityError),
    },
  );

  const startMutation = useMutation<void, AxiosError>(
    async () => {
      await axiosClient.post("/start");
    },
    {
      onSuccess: () => refetchStatus(),
      onError: (err: AxiosError) => setError(err as QCityError),
    },
  );

  const stopMutation = useMutation<void, AxiosError>(
    async () => {
      await axiosClient.post("/stop");
    },
    {
      onSuccess: () => refetchStatus(),
      onError: (err: AxiosError) => setError(err as QCityError),
    },
  );

  const configurePlatformsMutation = useMutation<void, AxiosError, QCityConfig["platforms"]>(
    async (platforms) => {
      await axiosClient.post("/configure-platforms", { platforms });
    },
    {
      onSuccess: () => {
        refetchConfig();
        refetchStatus();
      },
      onError: (err: AxiosError) => setError(err as QCityError),
    },
  );

  const enableFeaturesMutation = useMutation<void, AxiosError, string[]>(
    async (features) => {
      await axiosClient.post("/enable-features", { features });
    },
    {
      onSuccess: () => {
        refetchConfig();
        refetchStatus();
      },
      onError: (err: AxiosError) => setError(err as QCityError),
    },
  );

  const monitorResourcesMutation = useMutation<void, AxiosError>(
    async () => {
      await axiosClient.post("/monitor-resources");
    },
    {
      onSuccess: () => refetchStatus(),
      onError: (err: AxiosError) => setError(err as QCityError),
    },
  );

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

  const start = useCallback(() => {
    startMutation.mutate();
  }, [startMutation]);

  const stop = useCallback(() => {
    stopMutation.mutate();
  }, [stopMutation]);

  const configurePlatforms = useCallback(
    (platforms: QCityConfig["platforms"]) => {
      configurePlatformsMutation.mutate(platforms);
    },
    [configurePlatformsMutation],
  );

  const enableFeatures = useCallback(
    (features: string[]) => {
      enableFeaturesMutation.mutate(features);
    },
    [enableFeaturesMutation],
  );

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
  };
}

export function useQCityNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);

  const { data: notificationData, refetch: refetchNotifications } = useQuery<any[], AxiosError>(
    "qcity-notifications",
    async () => {
      const response = await axiosClient.get("/notifications");
      return response.data;
    },
    {
      refetchInterval: 10000,
      onError: () => undefined,
    },
  );

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

export function useQCityTasks() {
  const [tasks, setTasks] = useState<any[]>([]);

  const { data: taskData, refetch: refetchTasks } = useQuery<any[], AxiosError>(
    "qcity-tasks",
    async () => {
      const response = await axiosClient.get("/tasks");
      return response.data;
    },
    {
      refetchInterval: 5000,
      onError: () => undefined,
    },
  );

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

export function useQCityResources() {
  const [resources, setResources] = useState<any | null>(null);

  const { data: resourceData, refetch: refetchResources } = useQuery<any, AxiosError>(
    "qcity-resources",
    async () => {
      const response = await axiosClient.get("/resources");
      return response.data;
    },
    {
      refetchInterval: 5000,
      onError: () => undefined,
    },
  );

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

export function useQCityLogs() {
  const [logs, setLogs] = useState<any[]>([]);

  const { data: logData, refetch: refetchLogs } = useQuery<any[], AxiosError>(
    "qcity-logs",
    async () => {
      const response = await axiosClient.get("/logs");
      return response.data;
    },
    {
      refetchInterval: 5000,
      onError: () => undefined,
    },
  );

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
