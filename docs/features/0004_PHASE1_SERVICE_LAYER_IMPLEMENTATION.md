# Phase 1: Service Layer Implementation Plan

**Plan ID**: 0004
**Created**: 2025-12-24
**Status**: Ready for Implementation
**Priority**: CRITICAL
**Parent Plan**: 0003_REAL_DATA_INTEGRATION_PLAN.md
**Estimated Effort**: 2-3 weeks

---

## Executive Summary

This detailed implementation plan breaks down Phase 1 of the Real Data Integration project into actionable, file-by-file tasks. The goal is to create a robust service layer that replaces all mock data with real market data from free APIs, implementing proper caching, error handling, and TypeScript type safety.

**Architecture Pattern**: Service Layer → React Hooks → Components

---

## Table of Contents

1. [Directory Structure](#directory-structure)
2. [Dependencies](#dependencies)
3. [Type Definitions](#type-definitions)
4. [Service Layer](#service-layer)
5. [Caching Layer](#caching-layer)
6. [React Hooks](#react-hooks)
7. [Configuration](#configuration)
8. [Implementation Order](#implementation-order)
9. [Testing Checkpoints](#testing-checkpoints)

---

## Directory Structure

### New Folder Organization

```
/Users/victorsafta/Downloads/Pulse2/src/
├── types/                          # TypeScript type definitions
│   ├── index.ts                    # Re-exports all types
│   ├── market.types.ts             # Stock/market data types
│   ├── crypto.types.ts             # Cryptocurrency types
│   ├── news.types.ts               # News and sentiment types
│   ├── calendar.types.ts           # Economic calendar types
│   ├── api.types.ts                # API response types
│   └── error.types.ts              # Error handling types
│
├── config/                         # Configuration
│   ├── index.ts                    # Main config export
│   ├── api.config.ts               # API endpoints and keys
│   ├── cache.config.ts             # Cache TTLs and settings
│   └── constants.ts                # App-wide constants
│
├── services/                       # Data fetching services
│   ├── index.ts                    # Service exports
│   ├── api/                        # API clients
│   │   ├── baseClient.ts           # Base HTTP client
│   │   ├── finnhubClient.ts        # Finnhub API client
│   │   ├── coinGeckoClient.ts      # CoinGecko API client
│   │   ├── fredClient.ts           # FRED API client (future)
│   │   └── fearGreedClient.ts      # Fear & Greed Index client
│   ├── cache/                      # Caching layer
│   │   ├── indexedDBCache.ts       # IndexedDB implementation
│   │   ├── cacheManager.ts         # Cache orchestration
│   │   └── memoryCache.ts          # In-memory fallback
│   ├── market/                     # Market data services
│   │   ├── stockService.ts         # Stock quotes and data
│   │   ├── indexService.ts         # Market indices (VIX, etc.)
│   │   └── sectorService.ts        # Sector performance
│   ├── crypto/                     # Crypto services
│   │   └── cryptoService.ts        # Crypto prices and data
│   ├── news/                       # News services
│   │   └── newsService.ts          # News feed and sentiment
│   └── sentiment/                  # Sentiment analysis
│       └── sentimentService.ts     # Fear & Greed, etc.
│
└── hooks/                          # React hooks for data fetching
    ├── index.ts                    # Hook exports
    ├── useStockQuote.ts            # Stock quote hook
    ├── useCryptoPrice.ts           # Crypto price hook
    ├── useMarketIndices.ts         # Market indices hook
    ├── useNews.ts                  # News feed hook
    ├── useFearGreed.ts             # Fear & Greed hook
    └── usePolling.ts               # Generic polling hook
```

### File Naming Conventions

- **Types**: `*.types.ts` - TypeScript type definitions
- **Services**: `*Service.ts` - Business logic and data fetching
- **Clients**: `*Client.ts` - API communication layer
- **Hooks**: `use*.ts` - React custom hooks
- **Config**: `*.config.ts` - Configuration files
- **Tests**: `*.test.ts` - Unit and integration tests

---

## Dependencies

### Required Installations

```bash
# No new dependencies needed!
# The project already has all necessary libraries:
# - React 18.3.1 (with hooks)
# - TypeScript 5.6.2
# - Vite 6.0.3
# - Built-in fetch API (browser native)

# Optional (if we decide to use them later):
# npm install axios          # Alternative to fetch
# npm install swr            # React hooks for data fetching
# npm install react-query    # Alternative to SWR
```

### Browser APIs Used

- **Fetch API** - HTTP requests (native, no library needed)
- **IndexedDB** - Client-side caching (native)
- **LocalStorage** - Simple key-value cache (native)
- **Web Workers** (future) - Background data fetching

---

## Type Definitions

### 1. Market Types (`/src/types/market.types.ts`)

```typescript
// Stock quote data structure
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

// Market index data
export interface MarketIndex {
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
  timestamp: number;
}

// Sector performance
export interface SectorPerformance {
  sector: string;
  performance: number;
  volume: number;
  timestamp: number;
}

// Batch quote request
export interface BatchQuoteRequest {
  symbols: string[];
  forceRefresh?: boolean;
}

// Quote with metadata
export interface QuoteWithMetadata extends StockQuote {
  fetchTime: number;
  cacheHit: boolean;
  ttl: number;
}
```

### 2. Crypto Types (`/src/types/crypto.types.ts`)

```typescript
// Cryptocurrency price data
export interface CryptoPrice {
  id: string; // 'bitcoin', 'ethereum'
  symbol: string; // 'BTC', 'ETH'
  name: string; // 'Bitcoin', 'Ethereum'
  price: number;
  change24h: number;
  changePercent24h: number;
  marketCap: number;
  volume24h: number;
  rank: number;
  timestamp: number;
  source?: string;
  cached?: boolean;
}

// Crypto market data (extended)
export interface CryptoMarketData extends CryptoPrice {
  high24h: number;
  low24h: number;
  ath: number; // All-time high
  athDate: string;
  atl: number; // All-time low
  atlDate: string;
  circulatingSupply: number;
  maxSupply: number | null;
}
```

### 3. News Types (`/src/types/news.types.ts`)

```typescript
// News item structure
export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  imageUrl?: string;
  publishedAt: string;
  timestamp: number;
  category: string;
  related: string[]; // Related symbols
  sentiment?: NewsSentiment;
}

// News sentiment analysis
export interface NewsSentiment {
  score: number; // -1 to 1
  label: 'bullish' | 'bearish' | 'neutral';
  confidence: number; // 0 to 1
}

// News feed request
export interface NewsFeedRequest {
  category?: 'general' | 'forex' | 'crypto' | 'merger';
  symbol?: string;
  from?: string; // ISO date
  to?: string; // ISO date
  limit?: number;
}
```

### 4. Calendar Types (`/src/types/calendar.types.ts`)

```typescript
// Economic calendar event
export interface EconomicEvent {
  id: string;
  name: string;
  country: string;
  currency: string;
  date: string;
  time: string;
  timestamp: number;
  impact: 'high' | 'medium' | 'low';
  forecast: string | null;
  previous: string | null;
  actual: string | null;
}

// Calendar filter options
export interface CalendarFilter {
  country?: string;
  impact?: 'high' | 'medium' | 'low';
  startDate?: string;
  endDate?: string;
}
```

### 5. API Types (`/src/types/api.types.ts`)

```typescript
// Generic API response wrapper
export interface APIResponse<T> {
  data: T;
  success: boolean;
  timestamp: number;
  source: string;
  cached: boolean;
  error?: APIError;
}

// API error structure
export interface APIError {
  code: string;
  message: string;
  status?: number;
  timestamp: number;
}

// Rate limit info
export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp
  source: string;
}

// Cache metadata
export interface CacheMetadata {
  key: string;
  timestamp: number;
  ttl: number;
  expiresAt: number;
  hitCount: number;
}

// Finnhub API response types
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

// CoinGecko API response types
export interface CoinGeckoSimplePriceResponse {
  [coinId: string]: {
    usd: number;
    usd_24h_change: number;
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

// Fear & Greed Index response
export interface FearGreedResponse {
  fear_and_greed: {
    score: number;
    rating: string;
    timestamp: string;
  };
}
```

### 6. Error Types (`/src/types/error.types.ts`)

```typescript
// Custom error classes
export class APICallError extends Error {
  constructor(
    message: string,
    public code: string,
    public status?: number,
    public source?: string
  ) {
    super(message);
    this.name = 'APICallError';
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
  }
}

export class CacheError extends Error {
  constructor(message: string, public key: string) {
    super(message);
    this.name = 'CacheError';
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
  }
}

// Error handler result
export interface ErrorHandlerResult<T> {
  success: boolean;
  data?: T;
  error?: APIError;
  fallbackUsed: boolean;
}
```

### 7. Index Types (`/src/types/index.ts`)

```typescript
// Re-export all types for easy importing
export * from './market.types';
export * from './crypto.types';
export * from './news.types';
export * from './calendar.types';
export * from './api.types';
export * from './error.types';
```

---

## Service Layer

### 1. Base API Client (`/src/services/api/baseClient.ts`)

**Purpose**: Generic HTTP client with error handling, retry logic, and timeout

```typescript
import type { APIResponse, APIError, RateLimitInfo } from '@/types';

export interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  params?: Record<string, string | number>;
  body?: any;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

export class BaseAPIClient {
  private rateLimits: Map<string, RateLimitInfo> = new Map();

  constructor(private baseURL: string, private defaultHeaders: Record<string, string> = {}) {}

  /**
   * Main request method with error handling and retries
   */
  async request<T>(endpoint: string, config: RequestConfig = {}): Promise<APIResponse<T>> {
    const {
      method = 'GET',
      headers = {},
      params,
      body,
      timeout = 5000,
      retries = 2,
      retryDelay = 1000
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
        ...fetchOptions.headers,
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
          await this.delay(retryDelay * (attempt + 1));
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
  async get<T>(endpoint: string, params?: Record<string, string | number>): Promise<APIResponse<T>> {
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
  private buildURL(endpoint: string, params?: Record<string, string | number>): string {
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
    return resetHeader ? parseInt(resetHeader) : Date.now() + 60000;
  }

  /**
   * Simple delay utility
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

### 2. Finnhub Client (`/src/services/api/finnhubClient.ts`)

```typescript
import { BaseAPIClient } from './baseClient';
import type { FinnhubQuoteResponse, FinnhubNewsResponse } from '@/types';

const FINNHUB_API_KEY = import.meta.env.VITE_FINNHUB_API_KEY || '';
const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';

class FinnhubClient extends BaseAPIClient {
  constructor() {
    super(FINNHUB_BASE_URL, {
      'X-Finnhub-Token': FINNHUB_API_KEY
    });
  }

  /**
   * Get real-time quote for a symbol
   */
  async getQuote(symbol: string): Promise<FinnhubQuoteResponse> {
    const response = await this.get<FinnhubQuoteResponse>('/quote', { symbol });
    return response.data;
  }

  /**
   * Get market news
   */
  async getNews(category: string = 'general'): Promise<FinnhubNewsResponse[]> {
    const response = await this.get<FinnhubNewsResponse[]>('/news', { category });
    return response.data;
  }

  /**
   * Get company news for specific symbol
   */
  async getCompanyNews(symbol: string, from: string, to: string): Promise<FinnhubNewsResponse[]> {
    const response = await this.get<FinnhubNewsResponse[]>('/company-news', {
      symbol,
      from,
      to
    });
    return response.data;
  }
}

export const finnhubClient = new FinnhubClient();
```

### 3. CoinGecko Client (`/src/services/api/coinGeckoClient.ts`)

```typescript
import { BaseAPIClient } from './baseClient';
import type { CoinGeckoSimplePriceResponse, CoinGeckoCoinResponse } from '@/types';

const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';

// Map symbols to CoinGecko IDs
const COIN_ID_MAP: Record<string, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  SOL: 'solana',
  DOGE: 'dogecoin',
  ADA: 'cardano',
  XRP: 'ripple'
};

class CoinGeckoClient extends BaseAPIClient {
  constructor() {
    super(COINGECKO_BASE_URL, {
      'Accept': 'application/json'
    });
  }

  /**
   * Get simple prices for multiple coins
   */
  async getSimplePrices(symbols: string[]): Promise<CoinGeckoSimplePriceResponse> {
    const ids = symbols.map(s => COIN_ID_MAP[s.toUpperCase()] || s.toLowerCase()).join(',');
    const response = await this.get<CoinGeckoSimplePriceResponse>('/simple/price', {
      ids,
      vs_currencies: 'usd',
      include_24hr_change: 'true',
      include_market_cap: 'true',
      include_24hr_vol: 'true'
    });
    return response.data;
  }

  /**
   * Get detailed coin data
   */
  async getCoinData(symbol: string): Promise<CoinGeckoCoinResponse> {
    const coinId = COIN_ID_MAP[symbol.toUpperCase()] || symbol.toLowerCase();
    const response = await this.get<CoinGeckoCoinResponse>(`/coins/${coinId}`, {
      localization: 'false',
      tickers: 'false',
      community_data: 'false',
      developer_data: 'false'
    });
    return response.data;
  }

  /**
   * Convert symbol to CoinGecko ID
   */
  getCoinId(symbol: string): string {
    return COIN_ID_MAP[symbol.toUpperCase()] || symbol.toLowerCase();
  }
}

export const coinGeckoClient = new CoinGeckoClient();
```

### 4. Fear & Greed Client (`/src/services/api/fearGreedClient.ts`)

```typescript
import { BaseAPIClient } from './baseClient';
import type { FearGreedResponse } from '@/types';

const FEAR_GREED_URL = 'https://production.dataviz.cnn.io/index/fearandgreed/graphdata';

class FearGreedClient extends BaseAPIClient {
  constructor() {
    super(FEAR_GREED_URL);
  }

  /**
   * Get current Fear & Greed Index
   */
  async getCurrentIndex(): Promise<FearGreedResponse> {
    const response = await this.get<FearGreedResponse>('');
    return response.data;
  }

  /**
   * Get historical Fear & Greed Index
   */
  async getHistoricalIndex(date: string): Promise<FearGreedResponse> {
    const response = await this.get<FearGreedResponse>(`/${date}`);
    return response.data;
  }
}

export const fearGreedClient = new FearGreedClient();
```

---

## Caching Layer

### 1. IndexedDB Cache (`/src/services/cache/indexedDBCache.ts`)

```typescript
import type { CacheMetadata } from '@/types';

const DB_NAME = 'PulseCache';
const DB_VERSION = 1;
const STORES = {
  quotes: 'quotes',
  crypto: 'crypto',
  news: 'news',
  metadata: 'metadata'
};

export class IndexedDBCache {
  private db: IDBDatabase | null = null;

  /**
   * Initialize IndexedDB
   */
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object stores
        Object.values(STORES).forEach(storeName => {
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: 'key' });
          }
        });
      };
    });
  }

  /**
   * Get item from cache
   */
  async get<T>(store: string, key: string): Promise<T | null> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([store], 'readonly');
      const objectStore = transaction.objectStore(store);
      const request = objectStore.get(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const result = request.result;

        if (!result) {
          resolve(null);
          return;
        }

        // Check if expired
        if (result.expiresAt && Date.now() > result.expiresAt) {
          this.delete(store, key); // Clean up expired entry
          resolve(null);
          return;
        }

        resolve(result.data);
      };
    });
  }

  /**
   * Set item in cache
   */
  async set<T>(store: string, key: string, data: T, ttl: number): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([store], 'readwrite');
      const objectStore = transaction.objectStore(store);

      const cacheEntry = {
        key,
        data,
        timestamp: Date.now(),
        ttl,
        expiresAt: Date.now() + ttl * 1000,
        hitCount: 0
      };

      const request = objectStore.put(cacheEntry);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  /**
   * Delete item from cache
   */
  async delete(store: string, key: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([store], 'readwrite');
      const objectStore = transaction.objectStore(store);
      const request = objectStore.delete(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  /**
   * Clear entire store
   */
  async clear(store: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([store], 'readwrite');
      const objectStore = transaction.objectStore(store);
      const request = objectStore.clear();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }
}

export const indexedDBCache = new IndexedDBCache();
```

### 2. Cache Manager (`/src/services/cache/cacheManager.ts`)

```typescript
import { indexedDBCache } from './indexedDBCache';
import { CACHE_TTL } from '@/config/cache.config';
import type { CacheMetadata } from '@/types';

export class CacheManager {
  /**
   * Get cached data or fetch new data
   */
  async getOrFetch<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl: number = CACHE_TTL.default
  ): Promise<{ data: T; cached: boolean }> {
    // Try cache first
    const cached = await indexedDBCache.get<T>('quotes', key);
    if (cached) {
      return { data: cached, cached: true };
    }

    // Fetch fresh data
    const data = await fetchFn();

    // Store in cache
    await indexedDBCache.set('quotes', key, data, ttl);

    return { data, cached: false };
  }

  /**
   * Invalidate cache entry
   */
  async invalidate(key: string): Promise<void> {
    await indexedDBCache.delete('quotes', key);
  }

  /**
   * Clear all cache
   */
  async clearAll(): Promise<void> {
    await indexedDBCache.clear('quotes');
    await indexedDBCache.clear('crypto');
    await indexedDBCache.clear('news');
  }
}

export const cacheManager = new CacheManager();
```

---

## React Hooks

### 1. Stock Quote Hook (`/src/hooks/useStockQuote.ts`)

```typescript
import { useState, useEffect } from 'react';
import { stockService } from '@/services/market/stockService';
import type { StockQuote } from '@/types';

export interface UseStockQuoteOptions {
  symbol: string;
  pollingInterval?: number; // In milliseconds
  enabled?: boolean;
}

export function useStockQuote(options: UseStockQuoteOptions) {
  const { symbol, pollingInterval = 15000, enabled = true } = options;

  const [data, setData] = useState<StockQuote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let mounted = true;
    let intervalId: NodeJS.Timeout;

    async function fetchQuote() {
      try {
        const quote = await stockService.getQuote(symbol);
        if (mounted) {
          setData(quote);
          setError(null);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err as Error);
          setLoading(false);
        }
      }
    }

    // Initial fetch
    fetchQuote();

    // Set up polling
    if (pollingInterval) {
      intervalId = setInterval(fetchQuote, pollingInterval);
    }

    return () => {
      mounted = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, [symbol, pollingInterval, enabled]);

  return { data, loading, error };
}
```

### 2. Crypto Price Hook (`/src/hooks/useCryptoPrice.ts`)

```typescript
import { useState, useEffect } from 'react';
import { cryptoService } from '@/services/crypto/cryptoService';
import type { CryptoPrice } from '@/types';

export interface UseCryptoPriceOptions {
  symbol: string;
  pollingInterval?: number;
  enabled?: boolean;
}

export function useCryptoPrice(options: UseCryptoPriceOptions) {
  const { symbol, pollingInterval = 10000, enabled = true } = options;

  const [data, setData] = useState<CryptoPrice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let mounted = true;
    let intervalId: NodeJS.Timeout;

    async function fetchPrice() {
      try {
        const price = await cryptoService.getPrice(symbol);
        if (mounted) {
          setData(price);
          setError(null);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err as Error);
          setLoading(false);
        }
      }
    }

    fetchPrice();

    if (pollingInterval) {
      intervalId = setInterval(fetchPrice, pollingInterval);
    }

    return () => {
      mounted = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, [symbol, pollingInterval, enabled]);

  return { data, loading, error };
}
```

---

## Configuration

### 1. API Configuration (`/src/config/api.config.ts`)

```typescript
// API endpoints
export const API_ENDPOINTS = {
  finnhub: {
    baseURL: 'https://finnhub.io/api/v1',
    quote: '/quote',
    news: '/news',
    companyNews: '/company-news'
  },
  coinGecko: {
    baseURL: 'https://api.coingecko.com/api/v3',
    simplePrice: '/simple/price',
    coins: '/coins'
  },
  fearGreed: {
    baseURL: 'https://production.dataviz.cnn.io/index/fearandgreed/graphdata'
  }
};

// API Keys (from environment variables)
export const API_KEYS = {
  finnhub: import.meta.env.VITE_FINNHUB_API_KEY || '',
  alphaVantage: import.meta.env.VITE_ALPHA_VANTAGE_API_KEY || '',
  coinGecko: import.meta.env.VITE_COINGECKO_API_KEY || ''
};

// Rate limits (calls per minute)
export const RATE_LIMITS = {
  finnhub: 60,
  alphaVantage: 5,
  coinGecko: 30,
  fearGreed: 1000
};
```

### 2. Cache Configuration (`/src/config/cache.config.ts`)

```typescript
// Cache TTL in seconds
export const CACHE_TTL = {
  stockQuote: 15,        // 15 seconds
  cryptoPrice: 10,       // 10 seconds
  news: 300,             // 5 minutes
  fearGreed: 86400,      // 24 hours
  marketIndex: 30,       // 30 seconds
  default: 60            // 1 minute
};

// Cache storage limits
export const CACHE_LIMITS = {
  maxEntries: 1000,
  maxSizeBytes: 50 * 1024 * 1024 // 50 MB
};
```

### 3. Environment Variables (`.env.example`)

```bash
# Finnhub API Key (get from https://finnhub.io/)
VITE_FINNHUB_API_KEY=your_finnhub_key_here

# Alpha Vantage API Key (optional, for fallback)
VITE_ALPHA_VANTAGE_API_KEY=your_alphavantage_key_here

# CoinGecko API Key (optional, higher limits)
VITE_COINGECKO_API_KEY=

# Feature flags
VITE_ENABLE_REAL_DATA=true
VITE_ENABLE_CACHE=true
VITE_DEBUG_MODE=false
```

---

## Implementation Order

### Phase 1.1: Foundation (Week 1)
1. Create directory structure
2. Set up type definitions
3. Create base API client
4. Set up configuration files
5. Create IndexedDB cache

### Phase 1.2: API Clients (Week 1-2)
1. Implement Finnhub client
2. Implement CoinGecko client
3. Implement Fear & Greed client
4. Test each client individually

### Phase 1.3: Service Layer (Week 2)
1. Create stock service
2. Create crypto service
3. Create news service
4. Create sentiment service
5. Implement caching in services

### Phase 1.4: React Hooks (Week 2-3)
1. Create useStockQuote hook
2. Create useCryptoPrice hook
3. Create useNews hook
4. Create useFearGreed hook
5. Create generic usePolling hook

### Phase 1.5: Component Integration (Week 3)
1. Update QuickPulse component
2. Update NewsFeed component
3. Update MarketHeartbeat component
4. Update MarketWeather component
5. Test all components with real data

---

## Testing Checkpoints

### Checkpoint 1: API Clients
- [ ] Finnhub client fetches real stock quotes
- [ ] CoinGecko client fetches crypto prices
- [ ] Fear & Greed client fetches index
- [ ] All clients handle errors gracefully
- [ ] Rate limiting works correctly

### Checkpoint 2: Caching
- [ ] IndexedDB stores data correctly
- [ ] Cache retrieval works
- [ ] TTL expiration works
- [ ] Cache invalidation works
- [ ] Stale data fallback works

### Checkpoint 3: Services
- [ ] Stock service returns correct data structure
- [ ] Crypto service returns correct data structure
- [ ] Services use cache appropriately
- [ ] Fallback mechanisms work
- [ ] Error handling is robust

### Checkpoint 4: React Hooks
- [ ] Hooks fetch data on mount
- [ ] Polling updates data correctly
- [ ] Loading states work
- [ ] Error states work
- [ ] Cleanup prevents memory leaks

### Checkpoint 5: Component Integration
- [ ] QuickPulse shows real market data
- [ ] Data updates automatically
- [ ] Loading states display correctly
- [ ] Error states display correctly
- [ ] Performance is acceptable (< 3s initial load)

---

## Success Criteria

- All mock data replaced with real data from APIs
- Stock prices update every 15 seconds during market hours
- Crypto prices update every 10 seconds
- News feed updates every 5 minutes
- Cache hit rate > 70%
- API errors handled gracefully with fallbacks
- Components display real-time data without breaking
- No memory leaks from polling
- TypeScript type safety maintained throughout

---

## Next Steps After Phase 1

1. Implement FRED API for market indices (VIX, 10Y Treasury)
2. Add economic calendar integration
3. Set up Ollama AI for sentiment analysis
4. Create scheduled jobs for background data fetching
5. Implement WebSocket for real-time updates
6. Add more comprehensive error monitoring
7. Optimize bundle size and performance

---

**Plan Created By**: Master Orchestrator
**Date**: 2025-12-24
**Status**: Ready for Implementation
**Estimated Completion**: 3 weeks
