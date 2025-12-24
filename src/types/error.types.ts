/**
 * Custom error types for PULSE data fetching and caching
 */

export class APICallError extends Error {
  constructor(
    message: string,
    public code: string,
    public status?: number,
    public source?: string
  ) {
    super(message);
    this.name = 'APICallError';
    Object.setPrototypeOf(this, APICallError.prototype);
  }
}

export class RateLimitError extends Error {
  constructor(
    message: string,
    public source: string,
    public resetTime: number
  ) {
    super(message);
    this.name = 'RateLimitError';
    Object.setPrototypeOf(this, RateLimitError.prototype);
  }
}

export class CacheError extends Error {
  constructor(message: string, public key: string) {
    super(message);
    this.name = 'CacheError';
    Object.setPrototypeOf(this, CacheError.prototype);
  }
}

export class DataFetchError extends Error {
  constructor(
    message: string,
    public source: string,
    public fallbackUsed: boolean
  ) {
    super(message);
    this.name = 'DataFetchError';
    Object.setPrototypeOf(this, DataFetchError.prototype);
  }
}

/**
 * Error handler result type
 */
export interface ErrorHandlerResult<T> {
  success: boolean;
  data?: T;
  error?: APIError;
  fallbackUsed: boolean;
}

/**
 * API Error structure
 */
export interface APIError {
  code: string;
  message: string;
  status?: number;
  timestamp: number;
}
