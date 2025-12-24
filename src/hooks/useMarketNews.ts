/**
 * React hook for fetching market news
 * Supports polling and automatic updates
 */

import { useState, useEffect, useCallback } from 'react';
import { newsService } from '@/services/news/newsService';
import type { NewsItem, NewsFeedRequest } from '@/types';

export interface UseMarketNewsOptions {
  category?: 'general' | 'forex' | 'crypto' | 'merger';
  symbol?: string; // For company-specific news
  limit?: number;
  pollingInterval?: number; // In milliseconds (0 = no polling)
  enabled?: boolean;
}

export interface UseMarketNewsReturn {
  news: NewsItem[];
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

/**
 * Hook for fetching market news with optional polling
 *
 * @example
 * ```tsx
 * const { news, loading, error, refresh } = useMarketNews({
 *   category: 'general',
 *   limit: 20,
 *   pollingInterval: 300000 // 5 minutes
 * });
 * ```
 */
export function useMarketNews(options: UseMarketNewsOptions = {}): UseMarketNewsReturn {
  const {
    category = 'general',
    symbol,
    limit = 20,
    pollingInterval = 300000, // Default: 5 minutes
    enabled = true
  } = options;

  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch news data
   */
  const fetchNews = useCallback(async () => {
    try {
      setError(null);

      let newsData: NewsItem[];

      if (symbol) {
        // Fetch company-specific news
        newsData = await newsService.getCompanyNews(symbol, limit);
      } else {
        // Fetch category news
        newsData = await newsService.getNews({ category, limit });
      }

      setNews(newsData);
      setLoading(false);
      // Emit update event for LastUpdateIndicator
      window.dispatchEvent(new CustomEvent('data-update', {
        detail: { source: 'news', status: 'fresh' }
      }));
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch news');
      setError(error);
      setLoading(false);
      console.error('useMarketNews error:', error);
      // Emit error event
      window.dispatchEvent(new CustomEvent('data-update', {
        detail: { source: 'news', status: 'error' }
      }));
    }
  }, [category, symbol, limit]);

  /**
   * Manual refresh function
   */
  const refresh = useCallback(async () => {
    setLoading(true);
    await fetchNews();
  }, [fetchNews]);

  /**
   * Effect for initial fetch and polling
   */
  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    let mounted = true;
    let intervalId: NodeJS.Timeout | null = null;

    // Initial fetch
    const initialFetch = async () => {
      if (mounted) {
        await fetchNews();
      }
    };

    initialFetch();

    // Set up polling if interval is provided
    if (pollingInterval > 0) {
      intervalId = setInterval(() => {
        if (mounted) {
          fetchNews();
        }
      }, pollingInterval);
    }

    // Cleanup
    return () => {
      mounted = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [enabled, fetchNews, pollingInterval]);

  return {
    news,
    loading,
    error,
    refresh
  };
}

/**
 * Hook specifically for company news
 */
export function useCompanyNews(symbol: string, limit: number = 10) {
  return useMarketNews({
    symbol,
    limit,
    pollingInterval: 300000 // 5 minutes
  });
}

/**
 * Hook specifically for crypto news
 */
export function useCryptoNews(limit: number = 15) {
  return useMarketNews({
    category: 'crypto',
    limit,
    pollingInterval: 300000
  });
}

/**
 * Hook specifically for forex news
 */
export function useForexNews(limit: number = 15) {
  return useMarketNews({
    category: 'forex',
    limit,
    pollingInterval: 300000
  });
}
