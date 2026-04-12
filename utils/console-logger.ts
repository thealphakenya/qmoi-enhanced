// Console Logger
// Enhanced console logging utilities

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

  static debug(message: string, data?: any): void {
    logger.debug(`[DEBUG] ${message}`, data);
  }
}

// Export a default logger function for convenience
export /**
 * consoleLog function
 */
function consoleLog(message: string, data?: any): any: void {
  logger.info(message, data);
}

export default ConsoleLogger;