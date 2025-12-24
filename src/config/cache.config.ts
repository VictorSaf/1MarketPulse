/**
 * Cache configuration for PULSE
 */

/**
 * Cache TTL (Time To Live) in seconds
 */
export const CACHE_TTL = {
  // Market data
  stockQuote: 15,        // 15 seconds (real-time pricing)
  cryptoPrice: 10,       // 10 seconds (crypto is 24/7)
  marketIndex: 30,       // 30 seconds
  sectorPerformance: 300, // 5 minutes

  // News and sentiment
  news: 300,             // 5 minutes
  newsSentiment: 300,    // 5 minutes
  fearGreed: 86400,      // 24 hours

  // Economic data
  economicCalendar: 3600, // 1 hour

  // Default
  default: 60            // 1 minute
};

/**
 * Cache storage configuration
 */
export const CACHE_CONFIG = {
  // Maximum number of entries per store
  maxEntries: {
    quotes: 500,
    crypto: 100,
    news: 200,
    metadata: 1000
  },

  // Maximum cache size (bytes)
  maxSizeBytes: 50 * 1024 * 1024, // 50 MB

  // IndexedDB database name
  dbName: 'PulseCache',
  dbVersion: 1,

  // Store names
  stores: {
    quotes: 'quotes',
    crypto: 'crypto',
    news: 'news',
    metadata: 'metadata'
  },

  // Enable/disable caching
  enabled: import.meta.env.VITE_ENABLE_CACHE !== 'false'
};

/**
 * Memory cache configuration (fallback when IndexedDB unavailable)
 */
export const MEMORY_CACHE_CONFIG = {
  maxEntries: 100,
  maxAgeMs: 60000 // 1 minute
};
