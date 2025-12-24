/**
 * React Hook for Cryptocurrency Prices
 * Fetches crypto data with automatic polling and caching
 */

import { useState, useEffect, useCallback } from 'react';
import { cryptoService } from '@/services';
import type { CryptoPrice } from '@/types';
import { POLLING_INTERVALS, FEATURES } from '@/config';

export interface UseCryptoPriceOptions {
  symbol: string;
  pollingInterval?: number;
  enabled?: boolean;
}

export interface UseCryptoPriceResult {
  data: CryptoPrice | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  isStale: boolean;
}

/**
 * Hook to fetch and poll cryptocurrency price data
 *
 * @example
 * const { data, loading, error } = useCryptoPrice({
 *   symbol: 'BTC',
 *   pollingInterval: 10000
 * });
 */
export function useCryptoPrice(
  options: UseCryptoPriceOptions
): UseCryptoPriceResult {
  const {
    symbol,
    pollingInterval = POLLING_INTERVALS.cryptoPrice,
    enabled = true
  } = options;

  const [data, setData] = useState<CryptoPrice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastFetch, setLastFetch] = useState(0);

  /**
   * Fetch crypto price
   */
  const fetchPrice = useCallback(async () => {
    if (!enabled || !FEATURES.realDataEnabled) {
      return;
    }

    try {
      const price = await cryptoService.getPrice(symbol);
      setData(price);
      setError(null);
      setLastFetch(Date.now());
    } catch (err) {
      console.error(`Failed to fetch price for ${symbol}:`, err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [symbol, enabled]);

  /**
   * Manual refetch function
   */
  const refetch = useCallback(async () => {
    setLoading(true);
    await fetchPrice();
  }, [fetchPrice]);

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
    fetchPrice();

    // Set up polling (crypto markets are 24/7)
    if (pollingInterval > 0) {
      intervalId = setInterval(() => {
        if (mounted) {
          fetchPrice();
        }
      }, pollingInterval);
    }

    return () => {
      mounted = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [symbol, pollingInterval, enabled, fetchPrice]);

  /**
   * Determine if data is stale
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
