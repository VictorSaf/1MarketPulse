/**
 * Market data type definitions for PULSE
 */

/**
 * Stock quote data structure
 */
export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  open: number;
  high: number;
  low: number;
  previousClose: number;
  timestamp: number;
  source?: string; // 'finnhub' | 'alphavantage'
  cached?: boolean;
  stale?: boolean;
}

/**
 * Market index data
 */
export interface MarketIndex {
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
  timestamp: number;
}

/**
 * Sector performance data
 */
export interface SectorPerformance {
  sector: string;
  performance: number;
  volume: number;
  timestamp: number;
}

/**
 * Batch quote request
 */
export interface BatchQuoteRequest {
  symbols: string[];
  forceRefresh?: boolean;
}

/**
 * Quote with metadata
 */
export interface QuoteWithMetadata extends StockQuote {
  fetchTime: number;
  cacheHit: boolean;
  ttl: number;
}
