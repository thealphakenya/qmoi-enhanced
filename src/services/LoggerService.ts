export const logger = {
  info: (...args: unknown[]) => console.info(...args),
  warn: (...args: unknown[]) => console.warn(...args),
  _error: (...args: unknown[]) => (console as any)._error(...args),
  debug: (...args: unknown[]) => console.debug(...args),
};
