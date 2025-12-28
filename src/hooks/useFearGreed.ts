/**
 * React Hook for Fear & Greed Index
 * Fetches sentiment data with automatic polling and caching
 */

import { useState, useCallback } from 'react';

import { POLLING_INTERVALS, FEATURES } from '@/config';
import { sentimentService } from '@/services';
import type { FearGreedIndex } from '@/services/sentiment/sentimentService';

import { useVisibilityPolling } from './useVisibilityPolling';

export interface UseFearGreedOptions {
  pollingInterval?: number;
  enabled?: boolean;
}

export interface UseFearGreedResult {
  data: FearGreedIndex | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch and poll Fear & Greed Index
 *
 * @example
 * const { data, loading, error } = useFearGreed({
 *   pollingInterval: 86400000 // 24 hours
 * });
 */
export function useFearGreed(
  options: UseFearGreedOptions = {}
): UseFearGreedResult {
  const {
    pollingInterval = POLLING_INTERVALS.fearGreed,
    enabled = true
  } = options;

  const [data, setData] = useState<FearGreedIndex | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch Fear & Greed Index
   */
  const fetchIndex = useCallback(async () => {
    if (!enabled || !FEATURES.realDataEnabled) {
      return;
    }

    try {
      const index = await sentimentService.getFearGreedIndex();
      setData(index);
      setError(null);
      // Emit update event for LastUpdateIndicator
      window.dispatchEvent(new CustomEvent('data-update', {
        detail: { source: 'fearGreed', status: 'fresh' }
      }));
    } catch (err) {
      console.error('Failed to fetch Fear & Greed Index:', err);
      setError(err as Error);
      // Emit error event
      window.dispatchEvent(new CustomEvent('data-update', {
        detail: { source: 'fearGreed', status: 'error' }
      }));
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  /**
   * Manual refetch function
   */
  const refetch = useCallback(async () => {
    setLoading(true);
    await fetchIndex();
  }, [fetchIndex]);

  // Use shared visibility-aware polling hook
  useVisibilityPolling({
    callback: fetchIndex,
    interval: pollingInterval,
    enabled: enabled && FEATURES.realDataEnabled,
    fetchOnVisible: true,
    immediate: true,
  });

  return {
    data,
    loading,
    error,
    refetch
  };
}
