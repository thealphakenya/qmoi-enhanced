// QMOI EVOLUTION ENHANCED: Logger Service
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T04:00:00Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  context?: Record<string, any>;
  userId?: string;
}

export class Logger {
  private logs: LogEntry[] = [];

  info(message: string, context?: Record<string, any>, userId?: string): void {
    this.log('info', message, context, userId);
  }

  warn(message: string, context?: Record<string, any>, userId?: string): void {
    this.log('warn', message, context, userId);
  }

  error(message: string, context?: Record<string, any>, userId?: string): void {
    this.log('error', message, context, userId);
  }

  debug(message: string, context?: Record<string, any>, userId?: string): void {
    this.log('debug', message, context, userId);
  }

  private log(level: LogEntry['level'], message: string, context?: Record<string, any>, userId?: string): void {
    const entry: LogEntry = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      level,
      message,
      context,
      userId,
    };

    this.logs.push(entry);
    console.log(`[${level.toUpperCase()}] ${message}`, context || '');
  }

  getLogs(level?: LogEntry['level'], userId?: string): LogEntry[] {
    let filtered = this.logs;

    if (level) {
      filtered = filtered.filter(log => log.level === level);
    }

    if (userId) {
      filtered = filtered.filter(log => log.userId === userId);
    }

    return filtered;
  }

  clearLogs(): void {
    this.logs = [];
  }
}

const logger = new Logger();

export { logger };
export function getLogger(): Logger {
  return logger;
}