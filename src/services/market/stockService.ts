/**
 * Stock Service - Handles stock quote fetching with caching
 */

import { finnhubClient } from '../api/finnhubClient';
import { cacheManager } from '../cache/cacheManager';
import type { StockQuote, FinnhubQuoteResponse } from '@/types';
import { CACHE_TTL } from '@/config';

class StockService {
  /**
   * Get stock quote with caching
   * @param symbol - Stock symbol (e.g., 'AAPL')
   * @returns StockQuote with normalized data
   */
  async getQuote(symbol: string): Promise<StockQuote> {
    const cacheKey = `stock:quote:${symbol.toUpperCase()}`;

    const { data, cached } = await cacheManager.getOrFetch<StockQuote>(
      cacheKey,
      async () => {
        const finnhubData = await finnhubClient.getQuote(symbol);
        return this.transformFinnhubQuote(symbol, finnhubData);
      },
      CACHE_TTL.stockQuote
    );

    return {
      ...data,
      cached,
      source: cached ? 'cache' : 'finnhub'
    };
  }

  /**
   * Get multiple stock quotes
   * @param symbols - Array of stock symbols
   * @returns Array of StockQuote objects
   */
  async getBatchQuotes(symbols: string[]): Promise<StockQuote[]> {
    const promises = symbols.map(symbol => this.getQuote(symbol));
    const results = await Promise.allSettled(promises);

    return results
      .filter((r): r is PromiseFulfilledResult<StockQuote> =>
        r.status === 'fulfilled'
      )
      .map(r => r.value);
  }

  /**
   * Transform Finnhub response to our StockQuote format
   * @private
   */
  private transformFinnhubQuote(
    symbol: string,
    data: FinnhubQuoteResponse
  ): StockQuote {
    return {
      symbol: symbol.toUpperCase(),
      price: data.c,
      change: data.d,
      changePercent: data.dp,
      volume: 0, // Finnhub free tier doesn't include volume in quote endpoint
      open: data.o,
      high: data.h,
      low: data.l,
      previousClose: data.pc,
      timestamp: data.t * 1000, // Convert to milliseconds
      source: 'finnhub'
    };
  }

  /**
   * Invalidate cache for a symbol
   * @param symbol - Stock symbol
   */
  async invalidateQuote(symbol: string): Promise<void> {
    const cacheKey = `stock:quote:${symbol.toUpperCase()}`;
    await cacheManager.invalidate(cacheKey);
  }

  /**
   * Invalidate all stock quote caches
   */
  async invalidateAll(): Promise<void> {
    await cacheManager.invalidatePattern('stock:quote:');
  }
}

export const stockService = new StockService();
