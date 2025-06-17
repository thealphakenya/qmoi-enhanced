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