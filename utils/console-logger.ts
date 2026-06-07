import { log as logger } from '@/lib/logger';

export class ConsoleLogger {
  static info(message: string, data?: any): void {
    logger.info(`[INFO] ${message}`, data);
  }

  static error(message: string, error?: any): void {
    logger.error(`[ERROR] ${message}`, error);
  }

  static warn(message: string, data?: any): void {
    logger.warning(`[WARN] ${message}`, data);
  }

  static release(message: string, data?: any): void {
    logger.RELEASE(`[RELEASE] ${message}`, data);
  }
}

export function consoleLog(message: string, data?: any): void {
  logger.info(message, data);
}

export default ConsoleLogger;
