/**
 * Application-wide constants for PULSE
 */

/**
 * Market hours (Eastern Time)
 */
export const MARKET_HOURS = {
  preMarketStart: '04:00',
  marketOpen: '09:30',
  marketClose: '16:00',
  afterHoursEnd: '20:00',
  timezone: 'America/New_York'
};

/**
 * Polling intervals (milliseconds)
 */
export const POLLING_INTERVALS = {
  stockQuote: 15000,      // 15 seconds during market hours
  stockQuoteOffHours: 60000, // 1 minute outside market hours
  cryptoPrice: 10000,     // 10 seconds (24/7)
  news: 300000,           // 5 minutes
  fearGreed: 86400000,    // 24 hours
  marketIndex: 30000      // 30 seconds
};

/**
 * Default symbols to track
 */
export const DEFAULT_SYMBOLS = {
  stocks: ['SPY', 'QQQ', 'NVDA', 'AAPL', 'TSLA', 'MSFT'],
  crypto: ['BTC', 'ETH', 'SOL'],
  indices: ['VIX', 'DXY', 'TNX'] // VIX, Dollar Index, 10Y Treasury
};

/**
 * Feature flags
 */
export const FEATURES = {
  realDataEnabled: import.meta.env.VITE_ENABLE_REAL_DATA !== 'false',
  cacheEnabled: import.meta.env.VITE_ENABLE_CACHE !== 'false',
  debugMode: import.meta.env.VITE_DEBUG_MODE === 'true',
  pollingEnabled: true,
  fallbackToMockData: true
};

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  API_KEY_MISSING: 'API key is missing. Please set the required environment variable.',
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded. Please try again later.',
  NETWORK_ERROR: 'Network error occurred. Please check your connection.',
  CACHE_ERROR: 'Cache operation failed. Using fresh data.',
  DATA_FETCH_ERROR: 'Failed to fetch data from all sources.',
  INVALID_SYMBOL: 'Invalid symbol provided.'
};
