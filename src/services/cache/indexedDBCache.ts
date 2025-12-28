/**
 * IndexedDB Cache Implementation for PULSE
 * Provides persistent browser-side caching with TTL support
 */

import { CACHE_CONFIG } from '@/config';
import type { CacheMetadata } from '@/types';
import { CacheError } from '@/types';

interface CacheEntry<T> {
  key: string;
  data: T;
  timestamp: number;
  ttl: number;
  expiresAt: number;
  hitCount: number;
}

export class IndexedDBCache {
  private db: IDBDatabase | null = null;
  private initPromise: Promise<void> | null = null;

  /**
   * Initialize IndexedDB database
   */
  async init(): Promise<void> {
    // Return existing initialization promise if already initializing
    if (this.initPromise) {
      return this.initPromise;
    }

    // Return immediately if already initialized
    if (this.db) {
      return Promise.resolve();
    }

    this.initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(
        CACHE_CONFIG.dbName,
        CACHE_CONFIG.dbVersion
      );

      request.onerror = () => {
        this.initPromise = null;
        reject(new CacheError('Failed to open IndexedDB', 'init'));
      };

      request.onsuccess = () => {
        this.db = request.result;
        this.initPromise = null;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object stores for each cache type
        Object.values(CACHE_CONFIG.stores).forEach(storeName => {
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: 'key' });
          }
        });
      };
    });

    return this.initPromise;
  }

  /**
   * Get item from cache
   * @param store - Store name (quotes, crypto, news, metadata)
   * @param key - Cache key
   * @returns Cached data or null if not found/expired
   */
  async get<T>(store: string, key: string): Promise<T | null> {
    if (!CACHE_CONFIG.enabled) {return null;}

    try {
      if (!this.db) {await this.init();}

      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction([store], 'readonly');
        const objectStore = transaction.objectStore(store);
        const request = objectStore.get(key);

        request.onerror = () => reject(new CacheError('Failed to get from cache', key));

        request.onsuccess = () => {
          const result: CacheEntry<T> | undefined = request.result;

          if (!result) {
            resolve(null);
            return;
          }

          // Check if expired
          if (result.expiresAt && Date.now() > result.expiresAt) {
            // Clean up expired entry
            this.delete(store, key).catch(console.error);
            resolve(null);
            return;
          }

          // Increment hit count (fire and forget)
          this.incrementHitCount(store, key, result).catch(console.error);

          resolve(result.data);
        };
      });
    } catch (error) {
      console.error('Cache get error:', error);
      return null; // Fail gracefully
    }
  }

  /**
   * Set item in cache with TTL
   * @param store - Store name
   * @param key - Cache key
   * @param data - Data to cache
   * @param ttl - Time to live in seconds
   */
  async set<T>(
    store: string,
    key: string,
    data: T,
    ttl: number
  ): Promise<void> {
    if (!CACHE_CONFIG.enabled) {return;}

    try {
      if (!this.db) {await this.init();}

      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction([store], 'readwrite');
        const objectStore = transaction.objectStore(store);

        const cacheEntry: CacheEntry<T> = {
          key,
          data,
          timestamp: Date.now(),
          ttl,
          expiresAt: Date.now() + ttl * 1000,
          hitCount: 0
        };

        const request = objectStore.put(cacheEntry);

        request.onerror = () => reject(new CacheError('Failed to set cache', key));
        request.onsuccess = () => resolve();
      });
    } catch (error) {
      console.error('Cache set error:', error);
      // Fail gracefully - don't throw
    }
  }

  /**
   * Delete item from cache
   * @param store - Store name
   * @param key - Cache key
   */
  async delete(store: string, key: string): Promise<void> {
    if (!this.db) {await this.init();}

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([store], 'readwrite');
      const objectStore = transaction.objectStore(store);
      const request = objectStore.delete(key);

      request.onerror = () => reject(new CacheError('Failed to delete from cache', key));
      request.onsuccess = () => resolve();
    });
  }

  /**
   * Clear entire store
   * @param store - Store name
   */
  async clear(store: string): Promise<void> {
    if (!this.db) {await this.init();}

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([store], 'readwrite');
      const objectStore = transaction.objectStore(store);
      const request = objectStore.clear();

      request.onerror = () => reject(new CacheError('Failed to clear cache', store));
      request.onsuccess = () => resolve();
    });
  }

  /**
   * Clear all stores
   */
  async clearAll(): Promise<void> {
    const stores = Object.values(CACHE_CONFIG.stores);
    await Promise.all(stores.map(store => this.clear(store)));
  }

  /**
   * Get all keys from a store
   * @param store - Store name
   * @returns Array of cache keys
   */
  async getAllKeys(store: string): Promise<string[]> {
    if (!this.db) {await this.init();}

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([store], 'readonly');
      const objectStore = transaction.objectStore(store);
      const request = objectStore.getAllKeys();

      request.onerror = () => reject(new CacheError('Failed to get keys', store));
      request.onsuccess = () => resolve(request.result as string[]);
    });
  }

  /**
   * Increment hit count for cache entry
   * @private
   */
  private async incrementHitCount<T>(
    store: string,
    key: string,
    entry: CacheEntry<T>
  ): Promise<void> {
    try {
      const transaction = this.db!.transaction([store], 'readwrite');
      const objectStore = transaction.objectStore(store);

      entry.hitCount++;
      objectStore.put(entry);
    } catch (error) {
      // Ignore hit count errors
    }
  }

  /**
   * Get cache statistics
   * @param store - Store name
   * @returns Cache stats
   */
  async getStats(store: string): Promise<{
    totalEntries: number;
    expiredEntries: number;
    totalHits: number;
  }> {
    if (!this.db) {await this.init();}

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([store], 'readonly');
      const objectStore = transaction.objectStore(store);
      const request = objectStore.getAll();

      request.onerror = () => reject(new CacheError('Failed to get stats', store));

      request.onsuccess = () => {
        const entries: CacheEntry<any>[] = request.result;
        const now = Date.now();

        const stats = {
          totalEntries: entries.length,
          expiredEntries: entries.filter(e => e.expiresAt < now).length,
          totalHits: entries.reduce((sum, e) => sum + e.hitCount, 0)
        };

        resolve(stats);
      };
    });
  }
}

// Singleton instance
export const indexedDBCache = new IndexedDBCache();
