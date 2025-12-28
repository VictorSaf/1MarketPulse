/**
 * Backend API configuration
 *
 * This file configures the connection to the 1MarketPulse backend server.
 * The backend proxies all external API calls to secure API keys.
 */

/**
 * Backend server URL
 * Defaults to localhost:3001 in development
 */
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

/**
 * Backend API endpoints
 */
export const BACKEND_ENDPOINTS = {
  health: '/api/health',
  healthServices: '/api/health/services',
  healthCache: '/api/health/cache',

  // Market data
  marketQuote: (symbol: string) => `/api/market/quote/${symbol}`,
  marketQuotes: (symbols: string[]) => `/api/market/quotes?symbols=${symbols.join(',')}`,

  // News
  news: (category: string = 'general') => `/api/news?category=${category}`,
  companyNews: (symbol: string) => `/api/news/${symbol}`,

  // Sentiment
  fearGreed: '/api/sentiment/fear-greed',
  fearGreedHistorical: '/api/sentiment/fear-greed/historical',

  // Cryptocurrency
  cryptoPrice: (symbol: string) => `/api/crypto/price/${symbol}`,
  cryptoPrices: (symbols: string[]) => `/api/crypto/prices?symbols=${symbols.join(',')}`,
};

/**
 * Check if backend is available
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${BACKEND_URL}${BACKEND_ENDPOINTS.health}`, {
      method: 'GET',
      signal: AbortSignal.timeout(3000), // 3 second timeout
    });
    return response.ok;
  } catch (error) {
    console.warn('[Backend] Health check failed:', error);
    return false;
  }
}

/**
 * Fetch from backend with error handling
 */
export async function fetchFromBackend<T>(
  endpoint: string,
  options?: RequestInit
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    const json = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: json.error || json.message || 'Request failed',
      };
    }

    return {
      success: true,
      data: json.data,
    };
  } catch (error) {
    console.error('[Backend] Fetch error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Backend configuration flags
 */
export const BACKEND_CONFIG = {
  enabled: import.meta.env.VITE_USE_BACKEND !== 'false', // Default: true
  fallbackToDirect: import.meta.env.VITE_BACKEND_FALLBACK !== 'false', // Default: true
  timeout: 5000, // 5 seconds
};
