/**
 * React Hook for Stock Quotes
 * Fetches stock data with automatic polling and caching
 */

import { useState, useEffect, useCallback } from 'react';
import { stockService } from '@/services';
import type { StockQuote } from '@/types';
import { POLLING_INTERVALS, FEATURES } from '@/config';

export interface UseStockQuoteOptions {
  symbol: string;
  pollingInterval?: number;
  enabled?: boolean;
}

export interface UseStockQuoteResult {
  data: StockQuote | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  isStale: boolean;
}

/**
 * Hook to fetch and poll stock quote data
 *
 * @example
 * const { data, loading, error, refetch } = useStockQuote({
 *   symbol: 'AAPL',
 *   pollingInterval: 15000
 * });
 */
export function useStockQuote(
  options: UseStockQuoteOptions
): UseStockQuoteResult {
  const {
    symbol,
    pollingInterval = POLLING_INTERVALS.stockQuote,
    enabled = true
  } = options;

  const [data, setData] = useState<StockQuote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastFetch, setLastFetch] = useState(0);

  /**
   * Fetch quote data
   */
  const fetchQuote = useCallback(async () => {
    if (!enabled || !FEATURES.realDataEnabled) {
      return;
    }

    try {
      const quote = await stockService.getQuote(symbol);
      setData(quote);
      setError(null);
      setLastFetch(Date.now());
      // Emit update event for LastUpdateIndicator
      window.dispatchEvent(new CustomEvent('data-update', {
        detail: { source: `stock:${symbol}`, status: 'fresh' }
      }));
    } catch (err) {
      console.error(`Failed to fetch quote for ${symbol}:`, err);
      setError(err as Error);
      // Emit error event
      window.dispatchEvent(new CustomEvent('data-update', {
        detail: { source: `stock:${symbol}`, status: 'error' }
      }));
    } finally {
      setLoading(false);
    }
  }, [symbol, enabled]);

  /**
   * Manual refetch function
   */
  const refetch = useCallback(async () => {
    setLoading(true);
    await fetchQuote();
  }, [fetchQuote]);

  /**
   * Set up initial fetch and polling
   */
  useEffect(() => {
    if (!enabled) {
      return;
    }

    let mounted = true;
    let intervalId: NodeJS.Timeout;

    // Initial fetch
    fetchQuote();

    // Set up polling
    if (pollingInterval > 0) {
      intervalId = setInterval(() => {
        if (mounted) {
          fetchQuote();
        }
      }, pollingInterval);
    }

    return () => {
      mounted = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [symbol, pollingInterval, enabled, fetchQuote]);

  /**
   * Determine if data is stale (older than polling interval)
   */
  const isStale = lastFetch > 0 && Date.now() - lastFetch > pollingInterval * 2;

  return {
    data,
    loading,
    error,
    refetch,
    isStale
  };
}
