/**
 * useAdminStats Hook
 *
 * Fetches and manages real-time admin statistics and service health data.
 * Polls the backend every 5 seconds for live updates.
 */

import { useState, useEffect, useCallback } from 'react';

import { BACKEND_URL, BACKEND_ENDPOINTS } from '../config/backend.config';

export interface ServiceHealth {
  status: 'healthy' | 'unhealthy' | 'unknown';
  description: string;
  latency?: number;
  lastCheck?: number;
}

export interface ServiceStats {
  finnhub: ServiceHealth;
  coingecko: ServiceHealth;
  fearGreed: ServiceHealth;
  backend: ServiceHealth;
  ollama?: ServiceHealth;
}

export interface CacheStats {
  total: number;
  active: number;
  expired: number;
  hitRate?: number;
  size?: number;
}

export interface ApiCallStats {
  total: number;
  perMinute: number;
  success: number;
  failed: number;
  successRate: number;
  averageResponseTime: number;
}

export interface AdminStats {
  services: ServiceStats;
  cache: CacheStats;
  apiCalls: ApiCallStats;
  uptime: number;
  timestamp: number;
}

export interface UseAdminStatsResult {
  stats: AdminStats | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  isPolling: boolean;
  togglePolling: () => void;
}

const POLL_INTERVAL = 5000; // 5 seconds

const DEFAULT_STATS: AdminStats = {
  services: {
    finnhub: { status: 'unknown', description: 'Stock market data' },
    coingecko: { status: 'unknown', description: 'Cryptocurrency data' },
    fearGreed: { status: 'unknown', description: 'Fear & Greed Index' },
    backend: { status: 'unknown', description: 'Backend API server' },
  },
  cache: {
    total: 0,
    active: 0,
    expired: 0,
    hitRate: 0,
  },
  apiCalls: {
    total: 0,
    perMinute: 0,
    success: 0,
    failed: 0,
    successRate: 0,
    averageResponseTime: 0,
  },
  uptime: 0,
  timestamp: Date.now(),
};

/**
 * Fetch service health and statistics
 */
async function fetchAdminStats(): Promise<AdminStats> {
  const startTime = Date.now();

  try {
    // Fetch service health from backend
    const healthResponse = await fetch(`${BACKEND_URL}${BACKEND_ENDPOINTS.healthServices}`, {
      signal: AbortSignal.timeout(3000),
    });

    if (!healthResponse.ok) {
      throw new Error('Failed to fetch service health');
    }

    const healthData = await healthResponse.json();
    const backendLatency = Date.now() - startTime;

    // Transform backend response to our stats format
    const services: ServiceStats = {
      finnhub: {
        status: healthData.services?.finnhub?.status === 'healthy' ? 'healthy' : 'unhealthy',
        description: healthData.services?.finnhub?.description || 'Stock market data',
        lastCheck: healthData.timestamp,
      },
      coingecko: {
        status: healthData.services?.coingecko?.status === 'healthy' ? 'healthy' : 'unhealthy',
        description: healthData.services?.coingecko?.description || 'Cryptocurrency data',
        lastCheck: healthData.timestamp,
      },
      fearGreed: {
        status: healthData.services?.fearGreed?.status === 'healthy' ? 'healthy' : 'unhealthy',
        description: healthData.services?.fearGreed?.description || 'Fear & Greed Index',
        lastCheck: healthData.timestamp,
      },
      backend: {
        status: 'healthy',
        description: 'Backend API server',
        latency: backendLatency,
        lastCheck: Date.now(),
      },
    };

    // Check Ollama availability (optional)
    try {
      const ollamaResponse = await fetch('http://localhost:11434/api/tags', {
        signal: AbortSignal.timeout(2000),
      });
      const ollamaLatency = Date.now() - startTime;

      services.ollama = {
        status: ollamaResponse.ok ? 'healthy' : 'unhealthy',
        description: 'Local AI analysis',
        latency: ollamaLatency,
        lastCheck: Date.now(),
      };
    } catch {
      services.ollama = {
        status: 'unhealthy',
        description: 'Local AI analysis (not running)',
        lastCheck: Date.now(),
      };
    }

    // Parse cache stats
    const cache: CacheStats = {
      total: healthData.cache?.total || 0,
      active: healthData.cache?.active || 0,
      expired: healthData.cache?.expired || 0,
      hitRate: healthData.cache?.hitRate || 0,
    };

    // API call stats - currently not tracked by backend
    // TODO: Add API call tracking to backend for real metrics
    const apiCalls: ApiCallStats = {
      total: 0, // Not tracked yet
      perMinute: 0,
      success: 0,
      failed: 0,
      successRate: 0,
      averageResponseTime: backendLatency, // Use actual backend response time
    };

    return {
      services,
      cache,
      apiCalls,
      uptime: healthData.uptime || 0,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('[useAdminStats] Failed to fetch stats:', error);

    // Return default stats with backend marked as unhealthy
    return {
      ...DEFAULT_STATS,
      services: {
        ...DEFAULT_STATS.services,
        backend: {
          status: 'unhealthy',
          description: 'Backend API server (unavailable)',
          lastCheck: Date.now(),
        },
      },
    };
  }
}

/**
 * Hook for managing admin statistics
 */
export function useAdminStats(): UseAdminStatsResult {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(true);

  // Fetch stats function
  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAdminStats();
      setStats(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch statistics';
      setError(message);
      console.error('[useAdminStats]', message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Toggle polling
  const togglePolling = useCallback(() => {
    setIsPolling((prev) => !prev);
  }, []);

  // Initial fetch
  useEffect(() => {
    refresh();
  }, [refresh]);

  // Set up polling
  useEffect(() => {
    if (!isPolling) {return;}

    const interval = setInterval(() => {
      refresh();
    }, POLL_INTERVAL);

    return () => clearInterval(interval);
  }, [isPolling, refresh]);

  return {
    stats,
    loading,
    error,
    refresh,
    isPolling,
    togglePolling,
  };
}
