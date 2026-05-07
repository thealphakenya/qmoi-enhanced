/**
 * Production Logger Utility
 * Integrated logging with Winston and structured format
 */

import winston from 'winston';

// Initialize Winston logger with production settings
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json(),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
      const base = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
      const metadata = Object.keys(meta).length ? JSON.stringify(meta) : '';
      return `${base} ${metadata}`.trim();
    })
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          const base = `[${timestamp}] ${level}: ${message}`;
          const metadata = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
          return `${base}${metadata ? '\n' + metadata : ''}`;
        })
      ),
    }),
  ],
  defaultMeta: { service: 'qmoi-enhanced' },
});

// Add file transport in production
if (process.env.NODE_ENV === 'production') {
  logger.add(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: winston.format.json(),
    })
  );
  logger.add(
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: winston.format.json(),
    })
  );
}

// Custom logger methods with context
export const log = {
  info: (message: string, context?: Record<string, any>) => {
    logger.info(message, context);
  },
  warn: (message: string, context?: Record<string, any>) => {
    logger.warn(message, context);
  },
  error: (message: string, error?: Error | Record<string, any>, context?: Record<string, any>) => {
    if (error instanceof Error) {
      logger.error(message, { error: error.message, stack: error.stack, ...context });
    } else {
      logger.error(message, { ...error, ...context });
    }
  },
  debug: (message: string, context?: Record<string, any>) => {
    logger.debug(message, context);
  },
};

// Helper function to log API requests
export const logApiRequest = (
  method: string,
  endpoint: string,
  status: number,
  duration: number,
  context?: Record<string, any>
) => {
  log.info(`API ${method} ${endpoint} - ${status}`, {
    method,
    endpoint,
    status,
    duration: `${duration}ms`,
    ...context,
  });
};

// Helper function to log API errors
export const logApiError = (
  method: string,
  endpoint: string,
  error: Error | string,
  context?: Record<string, any>
) => {
  const message = error instanceof Error ? error.message : error;
  log.error(`API ${method} ${endpoint} - Error`, error, {
    method,
    endpoint,
    ...context,
  });
};

export default logger;
