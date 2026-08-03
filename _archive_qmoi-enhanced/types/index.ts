// AI Health Types
export interface AIHealth {
  status: "healthy" | "degraded" | "critical";
  lastCheck: number;
  error?: string;
  metrics?: {
    cpu: {
      usage: number;
      temperature: number;
      cores: number;
    };
    memory: {
      total: number;
      used: number;
      free: number;
      swap: {
        total: number;
        used: number;
        free: number;
      };
    };
    gpu?: {
      usage: number;
      temperature: number;
      memory: {
        total: number;
        used: number;
        free: number;
      };
    };
    disk: {
      total: number;
      used: number;
      free: number;
      iops: number;
    };
    network: {
      bytesIn: number;
      bytesOut: number;
      packetsIn: number;
      packetsOut: number;
    };
  };
}

// Media Generation Types
export interface MediaStatus {
  status: "idle" | "generating" | "completed" | "error";
  lastGenerated?: string;
  nextScheduled?: string;
  currentTask?: {
    id: string;
    type: "audio" | "video" | "image";
    prompt: string;
    progress: number;
    startTime: string;
  };
  settings: {
    maxConcurrentTasks: number;
    outputQuality: "high" | "medium" | "low";
    autoSave: boolean;
    defaultFormat: string;
  };
}

// Automation Types
export interface AutomationStatus {
  isEnabled: boolean;
  status: "idle" | "running" | "completed" | "error";
  lastRun?: string;
  nextRun?: string;
  currentTask?: {
    id: string;
    type: string;
    progress: number;
    startTime: string;
  };
  settings: {
    maxConcurrentTasks: number;
    autoRetry: boolean;
    maxRetries: number;
    timeout: number;
  };
}

// Badge Variant Types
export type BadgeVariant = "default" | "destructive" | "outline" | "secondary";

// System Metrics Types
export interface SystemMetrics {
  cpu: {
    usage: number;
    temperature: number;
    cores: number;
    load: number[];
  };
  memory: {
    total: number;
    used: number;
    free: number;
    swap: {
      total: number;
      used: number;
      free: number;
    };
  };
  gpu?: {
    usage: number;
    temperature: number;
    memory: {
      total: number;
      used: number;
      free: number;
    };
  };
  disk: {
    total: number;
    used: number;
    free: number;
    iops: number;
    readSpeed: number;
    writeSpeed: number;
  };
  network: {
    bytesIn: number;
    bytesOut: number;
    packetsIn: number;
    packetsOut: number;
    connections: number;
  };
  processes: {
    total: number;
    running: number;
    sleeping: number;
    stopped: number;
    zombie: number;
  };
  uptime: number;
  lastUpdate: number;
}

// Task Queue Types
export interface Task {
  id: string;
  type: "media" | "training" | "inference" | "maintenance" | "backup";
  status: "pending" | "running" | "completed" | "failed" | "cancelled";
  priority: "low" | "medium" | "high" | "critical";
  progress: number;
  result?: unknown;
  error?: string;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  metadata: {
    [key: string]: unknown;
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

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Error Types
export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

// Auth Types
export interface AuthState {
  isAuthenticated: boolean;
  user?: {
    id: string;
    username: string;
    role: "admin" | "user";
    permissions: string[];
  };
  token?: string;
}

// Settings Types
export interface AppSettings {
  theme: "light" | "dark" | "system";
  language: string;
  notifications: {
    enabled: boolean;
    sound: boolean;
    desktop: boolean;
  };
  performance: {
    maxConcurrentTasks: number;
    autoRetry: boolean;
    maxRetries: number;
    timeout: number;
  };
  storage: {
    maxSize: number;
    compression: boolean;
    backup: {
      enabled: boolean;
      frequency: "daily" | "weekly" | "monthly";
      retention: number;
    };
  };
}

// Event Types
export interface SystemEvent {
  id: string;
  type: "info" | "warning" | "error" | "success";
  message: string;
  timestamp: string;
  source: string;
  details?: unknown;
}

// Log Types
export interface LogEntry {
  id: string;
  level: "debug" | "info" | "warning" | "error" | "critical";
  message: string;
  timestamp: string;
  source: string;
  context?: {
    [key: string]: unknown;
  };
  stack?: string;
}
