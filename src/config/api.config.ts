/**
 * API configuration for PULSE data sources
 */

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  finnhub: {
    baseURL: 'https://finnhub.io/api/v1',
    quote: '/quote',
    news: '/news',
    companyNews: '/company-news',
    economicCalendar: '/calendar/economic'
  },
  coinGecko: {
    baseURL: 'https://api.coingecko.com/api/v3',
    simplePrice: '/simple/price',
    coins: '/coins',
    markets: '/coins/markets'
  },
  fearGreed: {
    baseURL: 'https://production.dataviz.cnn.io/index/fearandgreed/graphdata',
    current: '',
    historical: '' // Append /YYYY-MM-DD
  },
  alphaVantage: {
    baseURL: 'https://www.alphavantage.co/query',
    globalQuote: '?function=GLOBAL_QUOTE'
  }
};

/**
 * API Keys (loaded from environment variables)
 */
export const API_KEYS = {
  finnhub: import.meta.env.VITE_FINNHUB_API_KEY || '',
  alphaVantage: import.meta.env.VITE_ALPHA_VANTAGE_API_KEY || '',
  coinGecko: import.meta.env.VITE_COINGECKO_API_KEY || ''
};

/**
 * Rate Limits (calls per minute)
 */
export const RATE_LIMITS = {
  finnhub: 60,        // 60 calls/minute
  alphaVantage: 5,    // 5 calls/minute (25 per day)
  coinGecko: 30,      // 30 calls/minute
  fearGreed: 1000     // Effectively unlimited
};

/**
 * Timeout settings (milliseconds)
 */
export const TIMEOUTS = {
  default: 5000,      // 5 seconds
  long: 10000,        // 10 seconds
  short: 2000         // 2 seconds
};

/**
 * Retry settings
 */
export const RETRY_CONFIG = {
  maxRetries: 2,
  retryDelay: 1000,   // 1 second base delay
  exponentialBackoff: true
};
