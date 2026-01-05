/**
 * Logger utility for consistent application logging
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: unknown;
}

class Logger {
  private isDev = process.env.NEXT_PUBLIC_NODE_ENV === 'development';

  private formatLog(level: LogLevel, message: string, data?: unknown): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
    };
  }

  private output(entry: LogEntry) {
    const prefix = `[${entry.timestamp}] [${entry.level.toUpperCase()}]`;
    
    if (this.isDev) {
      console[entry.level as 'info' | 'warn' | 'error' | 'debug'](
        `${prefix} ${entry.message}`,
        entry.data ? entry.data : ''
      );
    } else {
      // In production, only log errors
      if (entry.level === 'error') {
        console.error(`${prefix} ${entry.message}`, entry.data);
      }
    }
  }

  info(message: string, data?: unknown) {
    this.output(this.formatLog('info', message, data));
  }

  warn(message: string, data?: unknown) {
    this.output(this.formatLog('warn', message, data));
  }

  error(message: string, error?: unknown) {
    this.output(this.formatLog('error', message, error instanceof Error ? error.message : error));
  }

  debug(message: string, data?: unknown) {
    if (this.isDev) {
      this.output(this.formatLog('debug', message, data));
    }
  }
}

export const logger = new Logger();
