/**
 * Utility function to merge CSS classes
 * Accepts strings, arrays, objects with boolean values
 */
export function cn(...classes: (string | undefined | null | false | Record<string, boolean>)[]) {
  return classes
    .filter((cls): cls is string | Record<string, boolean> => Boolean(cls))
    .map(cls => {
      if (typeof cls === 'string') return cls;
      if (typeof cls === 'object' && cls !== null) {
        return Object.entries(cls)
          .filter(([, value]) => value)
          .map(([key]) => key)
          .join(' ');
      }
      return '';
    })
    .join(' ')
    .trim();
}

/**
 * Development-only logger
 * Only logs in development environment to avoid exposing business logic in production
 */
const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
  log: (...args: any[]) => {
    if (isDevelopment) console.log(...args);
  },
  info: (...args: any[]) => {
    if (isDevelopment) console.info(...args);
  },
  warn: (...args: any[]) => {
    if (isDevelopment) console.warn(...args);
  },
  error: (...args: any[]) => {
    if (isDevelopment) console.error(...args);
  },
  debug: (...args: any[]) => {
    if (isDevelopment) console.debug(...args);
  },
};
