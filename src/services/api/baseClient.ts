/**
 * Base API Client for PULSE
 * Handles HTTP requests with retry logic, timeout, and error handling
 */

import type { APIResponse, RateLimitInfo } from '@/types';
import { APICallError, RateLimitError, DataFetchError } from '@/types';
import { TIMEOUTS, RETRY_CONFIG } from '@/config';

export interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  body?: any;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

export class BaseAPIClient {
  private rateLimits: Map<string, RateLimitInfo> = new Map();

  constructor(
    private baseURL: string,
    private defaultHeaders: Record<string, string> = {}
  ) {}

  /**
   * Main request method with error handling and retries
   */
  async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<APIResponse<T>> {
    const {
      method = 'GET',
      headers = {},
      params,
      body,
      timeout = TIMEOUTS.default,
      retries = RETRY_CONFIG.maxRetries,
      retryDelay = RETRY_CONFIG.retryDelay
    } = config;

    // Build URL with params
    const url = this.buildURL(endpoint, params);

    // Prepare fetch options
    const fetchOptions: RequestInit = {
      method,
      headers: { ...this.defaultHeaders, ...headers },
      signal: this.createTimeoutSignal(timeout)
    };

    if (body) {
      fetchOptions.body = JSON.stringify(body);
      fetchOptions.headers = {
        ...fetchOptions.headers as Record<string, string>,
        'Content-Type': 'application/json'
      };
    }

    // Execute request with retries
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url, fetchOptions);

        // Handle rate limiting
        if (response.status === 429) {
          const resetTime = this.parseRateLimitReset(response);
          throw new RateLimitError(
            `Rate limit exceeded for ${this.baseURL}`,
            this.baseURL,
            resetTime
          );
        }

        // Handle HTTP errors
        if (!response.ok) {
          throw new APICallError(
            `HTTP ${response.status}: ${response.statusText}`,
            'HTTP_ERROR',
            response.status,
            this.baseURL
          );
        }

        const data = await response.json();

        return {
          data,
          success: true,
          timestamp: Date.now(),
          source: this.baseURL,
          cached: false
        };

      } catch (error) {
        lastError = error as Error;

        // Don't retry on rate limit errors
        if (error instanceof RateLimitError) {
          throw error;
        }

        // Retry on network errors or 5xx errors
        if (attempt < retries) {
          const delay = RETRY_CONFIG.exponentialBackoff
            ? retryDelay * Math.pow(2, attempt)
            : retryDelay;

          await this.delay(delay);
          continue;
        }
      }
    }

    // All retries failed
    throw new DataFetchError(
      `Failed after ${retries + 1} attempts: ${lastError?.message}`,
      this.baseURL,
      false
    );
  }

  /**
   * GET request helper
   */
  async get<T>(
    endpoint: string,
    params?: Record<string, string | number | boolean>
  ): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET', params });
  }

  /**
   * POST request helper
   */
  async post<T>(endpoint: string, body: any): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { method: 'POST', body });
  }

  /**
   * Build URL with query parameters
   */
  private buildURL(
    endpoint: string,
    params?: Record<string, string | number | boolean>
  ): string {
    const url = new URL(endpoint, this.baseURL);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    return url.toString();
  }

  /**
   * Create abort signal for timeout
   */
  private createTimeoutSignal(timeout: number): AbortSignal {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), timeout);
    return controller.signal;
  }

  /**
   * Parse rate limit reset time from response headers
   */
  private parseRateLimitReset(response: Response): number {
    const resetHeader = response.headers.get('X-RateLimit-Reset');
    return resetHeader ? parseInt(resetHeader) * 1000 : Date.now() + 60000;
  }

  /**
   * Simple delay utility
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Check if we're currently rate limited
   */
  isRateLimited(): boolean {
    const info = this.rateLimits.get(this.baseURL);
    if (!info) return false;

    return info.remaining === 0 && Date.now() < info.reset;
  }

  /**
   * Get rate limit info
   */
  getRateLimitInfo(): RateLimitInfo | null {
    return this.rateLimits.get(this.baseURL) || null;
  }
}
