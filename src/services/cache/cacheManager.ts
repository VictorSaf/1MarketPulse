/**
 * Cache Manager for PULSE
 * Orchestrates caching strategy with getOrFetch pattern
 */

import { indexedDBCache } from './indexedDBCache';
import { CACHE_TTL, CACHE_CONFIG } from '@/config';

export class CacheManager {
  /**
   * Get cached data or fetch new data
   * Implements the cache-aside pattern
   *
   * @param key - Unique cache key
   * @param fetchFn - Function to fetch fresh data
   * @param ttl - Time to live in seconds (defaults to CACHE_TTL.default)
   * @returns Object with data and cache hit indicator
   */
  async getOrFetch<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl: number = CACHE_TTL.default
  ): Promise<{ data: T; cached: boolean }> {
    // Try cache first
    const cached = await indexedDBCache.get<T>(CACHE_CONFIG.stores.quotes, key);

    if (cached) {
      return { data: cached, cached: true };
    }

    // Fetch fresh data
    const data = await fetchFn();

    // Store in cache (fire and forget - don't block on cache write)
    indexedDBCache
      .set(CACHE_CONFIG.stores.quotes, key, data, ttl)
      .catch(err => console.error('Cache write error:', err));

    return { data, cached: false };
  }

  /**
   * Invalidate (delete) a cache entry
   * @param key - Cache key to invalidate
   */
  async invalidate(key: string): Promise<void> {
    await indexedDBCache.delete(CACHE_CONFIG.stores.quotes, key);
  }

  /**
   * Invalidate multiple cache entries by pattern
   * @param pattern - Regex pattern or prefix to match keys
   */
  async invalidatePattern(pattern: string | RegExp): Promise<void> {
    const keys = await indexedDBCache.getAllKeys(CACHE_CONFIG.stores.quotes);
    const regex = typeof pattern === 'string'
      ? new RegExp(`^${pattern}`)
      : pattern;

    const keysToDelete = keys.filter(key => regex.test(key));

    await Promise.all(
      keysToDelete.map(key =>
        indexedDBCache.delete(CACHE_CONFIG.stores.quotes, key)
      )
    );
  }

  /**
   * Clear all cache stores
   */
  async clearAll(): Promise<void> {
    await indexedDBCache.clearAll();
  }

  /**
   * Get cache statistics
   * @returns Cache stats for all stores
   */
  async getStats(): Promise<Record<string, any>> {
    const stores = Object.values(CACHE_CONFIG.stores);
    const statsPromises = stores.map(async store => ({
      store,
      stats: await indexedDBCache.getStats(store)
    }));

    const results = await Promise.all(statsPromises);

    return results.reduce((acc, { store, stats }) => {
      acc[store] = stats;
      return acc;
    }, {} as Record<string, any>);
  }

  /**
   * Warm cache with initial data
   * @param entries - Array of cache entries to preload
   */
  async warmCache<T>(
    entries: Array<{ key: string; data: T; ttl?: number }>
  ): Promise<void> {
    await Promise.all(
      entries.map(({ key, data, ttl = CACHE_TTL.default }) =>
        indexedDBCache.set(CACHE_CONFIG.stores.quotes, key, data, ttl)
      )
    );
  }
}

// Singleton instance
export const cacheManager = new CacheManager();
