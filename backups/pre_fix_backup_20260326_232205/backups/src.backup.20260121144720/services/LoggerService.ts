// 
export const logger = {
  info: (...args: unknown[]) => console.info(...args),
  warn: (...args: unknown[]) => logger.warn(...args),
  _error: (...args: unknown[]) =>
    (globalThis.console as unknown)?.error?.(...args),
  debug: (...args: unknown[]) => logger.debug(...args),
};
