export { };

declare global {
  /**
 * safeConsoleError function
 */
function safeConsoleError(args: unknown[]): void;

  interface Window {
    safeConsoleError?: (args: unknown[]) => void;
  }
}
