// Console Logger
// Enhanced console logging utilities

export class ConsoleLogger {
  static info(message: string, data?: any): void {
    console.log(`[INFO] ${message}`, data);
  }

  static error(message: string, error?: any): void {
    console.error(`[ERROR] ${message}`, error);
  }

  static warn(message: string, data?: any): void {
    console.warn(`[WARN] ${message}`, data);
  }

  static debug(message: string, data?: any): void {
    console.debug(`[DEBUG] ${message}`, data);
  }
}

// Export a default logger function for convenience
export function consoleLog(message: string, data?: any): void {
  console.log(message, data);
}

export default ConsoleLogger;