/**
 * API-related type definitions for PULSE
 */

import type { APIError } from './error.types';

/**
 * Generic API response wrapper
 */
export interface APIResponse<T> {
  data: T;
  success: boolean;
  timestamp: number;
  source: string;
  cached: boolean;
  error?: APIError;
}

/**
 * Rate limit information
 */
export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp
  source: string;
}

/**
 * Cache metadata
 */
export interface CacheMetadata {
  key: string;
  timestamp: number;
  ttl: number;
  expiresAt: number;
  hitCount: number;
}

/**
 * Finnhub API Response Types
 */
export interface FinnhubQuoteResponse {
  c: number; // Current price
  d: number; // Change
  dp: number; // Percent change
  h: number; // High
  l: number; // Low
  o: number; // Open
  pc: number; // Previous close
  t: number; // Timestamp
}

export interface FinnhubNewsResponse {
  category: string;
  datetime: number;
  headline: string;
  id: number;
  image: string;
  related: string;
  source: string;
  summary: string;
  url: string;
}

/**
 * CoinGecko API Response Types
 */
export interface CoinGeckoSimplePriceResponse {
  [coinId: string]: {
    usd: number;
    usd_24h_change?: number;
    usd_market_cap?: number;
    usd_24h_vol?: number;
  };
}

export interface CoinGeckoCoinResponse {
  id: string;
  symbol: string;
  name: string;
  market_data: {
    current_price: { usd: number };
    price_change_percentage_24h: number;
    market_cap: { usd: number };
    total_volume: { usd: number };
    high_24h: { usd: number };
    low_24h: { usd: number };
  };
  last_updated: string;
}

/**
 * Fear & Greed Index Response
 */
export interface FearGreedResponse {
  fear_and_greed: {
    score: number;
    rating: string;
    timestamp: string;
  };
  market_momentum_sp500?: {
    score: number;
    rating: string;
  };
  stock_price_strength?: {
    score: number;
    rating: string;
  };
  stock_price_breadth?: {
    score: number;
    rating: string;
  };
  put_call_options?: {
    score: number;
    rating: string;
  };
  market_volatility_vix?: {
    score: number;
    rating: string;
  };
  safe_haven_demand?: {
    score: number;
    rating: string;
  };
  junk_bond_demand?: {
    score: number;
    rating: string;
  };
}
