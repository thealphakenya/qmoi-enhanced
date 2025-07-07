import { EventEmitter } from 'events';

interface ParallelTask {
  id: string;
  type: 'error_fix' | 'site_generation' | 'revenue_automation' | 'optimization' | 'monitoring';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  estimatedDuration: number;
  startTime?: string;
  endTime?: string;
  result?: any;
  error?: string;
}

interface ParallelExecutionConfig {
  maxConcurrentTasks: number;
  taskTimeout: number;
  retryAttempts: number;
  healthCheckInterval: number;
}

interface SystemHealth {
  cpuUsage: number;
  memoryUsage: number;
  activeTasks: number;
  completedTasks: number;
  failedTasks: number;
  averageTaskDuration: number;
  systemStatus: 'healthy' | 'warning' | 'critical';
}

interface DashboardData {
  activeTasks: ParallelTask[];
  systemHealth: SystemHealth;
  taskQueue: ParallelTask[];
  recentResults: any[];
  performanceMetrics: {
    tasksPerMinute: number;
    successRate: number;
    averageResponseTime: number;
  };
}

export class EnhancedParallelizationService extends EventEmitter {
  private static instance: EnhancedParallelizationService;
  private taskQueue: ParallelTask[] = [];
  private activeTasks: Map<string, ParallelTask> = new Map();
  private completedTasks: ParallelTask[] = [];
  private config: ParallelExecutionConfig;
  private systemHealth: SystemHealth;
  private isRunning: boolean = false;
  private healthCheckInterval?: NodeJS.Timeout;

  private constructor() {
    super();
    this.config = {
      maxConcurrentTasks: 10,
      taskTimeout: 300000, // 5 minutes
      retryAttempts: 3,
      healthCheckInterval: 30000 // 30 seconds
    };
    this.systemHealth = this.initializeSystemHealth();
    this.startHealthMonitoring();
  }

  public static getInstance(): EnhancedParallelizationService {
    if (!EnhancedParallelizationService.instance) {
      EnhancedParallelizationService.instance = new EnhancedParallelizationService();
    }
    return EnhancedParallelizationService.instance;
  }

  private initializeSystemHealth(): SystemHealth {
    return {
      cpuUsage: 0,
      memoryUsage: 0,
      activeTasks: 0,
      completedTasks: 0,
      failedTasks: 0,
      averageTaskDuration: 0,
      systemStatus: 'healthy'
    };
  }

  public async submitTask(taskType: ParallelTask['type'], priority: ParallelTask['priority'] = 'medium', data?: any): Promise<string> {
    const task: ParallelTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: taskType,
      priority,
      status: 'pending',
      progress: 0,
      estimatedDuration: this.getEstimatedDuration(taskType),
      result: data
    };

    this.taskQueue.push(task);
    this.emit('taskSubmitted', task);
    this.processQueue();
    return task.id;
  }

  private getEstimatedDuration(taskType: ParallelTask['type']): number {
    const durations = {
      error_fix: 30000,
      site_generation: 120000,
      revenue_automation: 180000,
      optimization: 60000,
      monitoring: 15000
    };
    return durations[taskType] || 30000;
  }

  private async processQueue(): Promise<void> {
    if (this.activeTasks.size >= this.config.maxConcurrentTasks || this.taskQueue.length === 0) {
      return;
    }

    // Sort queue by priority and estimated duration (fastest first)
    this.taskQueue.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      const aPriority = priorityOrder[a.priority];
      const bPriority = priorityOrder[b.priority];
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      
      // For same priority, choose fastest task
      return a.estimatedDuration - b.estimatedDuration;
    });

    const task = this.taskQueue.shift();
    if (task) {
      await this.executeTask(task);
    }
  }

  private async executeTask(task: ParallelTask): Promise<void> {
    task.status = 'running';
    task.startTime = new Date().toISOString();
    this.activeTasks.set(task.id, task);
    this.systemHealth.activeTasks = this.activeTasks.size;

    this.emit('taskStarted', task);

    try {
      const result = await this.runTaskWithTimeout(task);
      task.status = 'completed';
      task.progress = 100;
      task.result = result;
      this.completedTasks.push(task);
      this.systemHealth.completedTasks++;
    } catch (error) {
      task.status = 'failed';
      task.error = error.message;
      this.systemHealth.failedTasks++;
      this.emit('taskFailed', { task, error });
    } finally {
      task.endTime = new Date().toISOString();
      this.activeTasks.delete(task.id);
      this.systemHealth.activeTasks = this.activeTasks.size;
      this.updateAverageTaskDuration(task);
      this.emit('taskCompleted', task);
      this.processQueue(); // Process next task
    }
  }

  private async runTaskWithTimeout(task: ParallelTask): Promise<any> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`Task ${task.id} timed out after ${this.config.taskTimeout}ms`));
      }, this.config.taskTimeout);

      this.simulateTaskExecution(task)
        .then(result => {
          clearTimeout(timeout);
          resolve(result);
        })
        .catch(error => {
          clearTimeout(timeout);
          reject(error);
        });
    });
  }

  private async simulateTaskExecution(task: ParallelTask): Promise<any> {
    const startTime = Date.now();
    
    // Simulate task execution with progress updates
    for (let progress = 0; progress <= 100; progress += 10) {
      task.progress = progress;
      this.emit('taskProgress', { taskId: task.id, progress });
      
      await new Promise(resolve => setTimeout(resolve, task.estimatedDuration / 10));
    }

    // Simulate different results based on task type
    switch (task.type) {
      case 'error_fix':
        return { fixedErrors: 3, remainingErrors: 0, duration: Date.now() - startTime };
      case 'site_generation':
        return { siteUrl: `https://qcity-sites.com/${task.id}`, auditScore: 95, duration: Date.now() - startTime };
      case 'revenue_automation':
        return { revenue: 2500, deals: 5, duration: Date.now() - startTime };
      case 'optimization':
        return { performanceGain: 25, memorySaved: '50MB', duration: Date.now() - startTime };
      case 'monitoring':
        return { healthScore: 98, alerts: 0, duration: Date.now() - startTime };
      default:
        return { success: true, duration: Date.now() - startTime };
    }
  }

  private updateAverageTaskDuration(task: ParallelTask): void {
    if (task.startTime && task.endTime) {
      const duration = new Date(task.endTime).getTime() - new Date(task.startTime).getTime();
      const totalDuration = this.systemHealth.averageTaskDuration * this.systemHealth.completedTasks + duration;
      this.systemHealth.averageTaskDuration = totalDuration / (this.systemHealth.completedTasks + 1);
    }
  }

  private startHealthMonitoring(): void {
    this.healthCheckInterval = setInterval(() => {
      this.updateSystemHealth();
    }, this.config.healthCheckInterval);
  }

  private updateSystemHealth(): void {
    // Simulate system health metrics
    this.systemHealth.cpuUsage = Math.random() * 100;
    this.systemHealth.memoryUsage = Math.random() * 100;
    
    // Determine system status based on metrics
    if (this.systemHealth.cpuUsage > 90 || this.systemHealth.memoryUsage > 90) {
      this.systemHealth.systemStatus = 'critical';
    } else if (this.systemHealth.cpuUsage > 70 || this.systemHealth.memoryUsage > 70) {
      this.systemHealth.systemStatus = 'warning';
    } else {
      this.systemHealth.systemStatus = 'healthy';
    }

    this.emit('healthUpdate', this.systemHealth);
  }

  public getDashboardData(): DashboardData {
    const tasksPerMinute = this.completedTasks.length / (Date.now() / 60000);
    const successRate = this.systemHealth.completedTasks / (this.systemHealth.completedTasks + this.systemHealth.failedTasks);

    return {
      activeTasks: Array.from(this.activeTasks.values()),
      systemHealth: { ...this.systemHealth },
      taskQueue: [...this.taskQueue],
      recentResults: this.completedTasks.slice(-10),
      performanceMetrics: {
        tasksPerMinute,
        successRate,
        averageResponseTime: this.systemHealth.averageTaskDuration
      }
    };
  }

  public getTaskStatus(taskId: string): ParallelTask | null {
    return this.activeTasks.get(taskId) || this.completedTasks.find(t => t.id === taskId) || null;
  }

  public stop(): void {
    this.isRunning = false;
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
    this.emit('serviceStopped');
  }
}

export const enhancedParallelizationService = EnhancedParallelizationService.getInstance(); 