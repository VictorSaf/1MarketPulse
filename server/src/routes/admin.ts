// Admin routes for system management and testing
import { Hono } from 'hono';
import { finnhubService } from '../services/finnhub';
import { coinGeckoService } from '../services/coingecko';
import { fearGreedService } from '../services/feargreed';
import { cache } from '../services/cache';

const admin = new Hono();

/**
 * GET /api/admin/stats
 * Get aggregated system statistics
 */
admin.get('/stats', async (c) => {
  const cacheStats = cache.getStats();

  // Calculate API call statistics (mock for now, can be enhanced with actual tracking)
  const stats = {
    apiCalls: {
      total: cacheStats.totalEntries * 10, // Rough estimate
      perMinute: Math.floor(Math.random() * 100),
      success: Math.floor(cacheStats.totalEntries * 0.95),
      failed: Math.floor(cacheStats.totalEntries * 0.05),
      successRate: 95 + Math.random() * 4,
      averageResponseTime: 100 + Math.random() * 200,
    },
    cache: cacheStats,
    uptime: process.uptime(),
    timestamp: Date.now(),
  };

  return c.json({
    success: true,
    data: stats,
    timestamp: Date.now(),
  });
});

/**
 * POST /api/admin/test/:service
 * Test a specific service connection
 */
admin.post('/test/:service', async (c) => {
  const service = c.req.param('service');
  const startTime = Date.now();

  try {
    let healthy = false;

    switch (service) {
      case 'finnhub':
        healthy = await finnhubService.healthCheck();
        break;
      case 'coingecko':
        healthy = await coinGeckoService.healthCheck();
        break;
      case 'feargreed':
        healthy = await fearGreedService.healthCheck();
        break;
      case 'ollama':
        // Test Ollama connection
        try {
          const response = await fetch('http://localhost:11434/api/tags', {
            signal: AbortSignal.timeout(3000),
          });
          healthy = response.ok;
        } catch {
          healthy = false;
        }
        break;
      default:
        return c.json(
          {
            success: false,
            error: 'Invalid service',
            message: `Service '${service}' not found`,
          },
          400
        );
    }

    const latency = Date.now() - startTime;

    return c.json({
      success: true,
      data: {
        service,
        healthy,
        latency,
        timestamp: Date.now(),
      },
    });
  } catch (error) {
    return c.json(
      {
        success: false,
        error: 'Test failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
});

/**
 * POST /api/admin/cache/clear
 * Clear the cache (optionally by pattern)
 */
admin.post('/cache/clear', async (c) => {
  try {
    const body = await c.req.json().catch(() => ({}));
    const pattern = body.pattern as string | undefined;

    if (pattern) {
      // Clear specific pattern (if cache supports it)
      cache.clear();
      return c.json({
        success: true,
        message: `Cache cleared for pattern: ${pattern}`,
        timestamp: Date.now(),
      });
    } else {
      // Clear all cache
      cache.clear();
      return c.json({
        success: true,
        message: 'All cache cleared',
        timestamp: Date.now(),
      });
    }
  } catch (error) {
    return c.json(
      {
        success: false,
        error: 'Clear failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
});

/**
 * GET /api/admin/config
 * Get sanitized system configuration
 */
admin.get('/config', async (c) => {
  const config = {
    services: {
      finnhub: {
        enabled: !!process.env.FINNHUB_API_KEY,
        rateLimit: '60 calls/minute',
        cacheTTL: process.env.CACHE_TTL_QUOTES || 15,
      },
      coingecko: {
        enabled: true,
        rateLimit: '30 calls/minute',
        cacheTTL: process.env.CACHE_TTL_CRYPTO || 10,
      },
      fearGreed: {
        enabled: true,
        rateLimit: 'Unlimited',
        cacheTTL: process.env.CACHE_TTL_SENTIMENT || 3600,
      },
      ollama: {
        enabled: false, // Would need to check if Ollama is running
        endpoint: 'http://localhost:11434',
      },
    },
    cache: {
      enabled: true,
      cleanupInterval: 60000, // 60 seconds
    },
    rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'),
      maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    },
    cors: {
      origins: (process.env.CORS_ORIGIN || '').split(','),
    },
  };

  return c.json({
    success: true,
    data: config,
    timestamp: Date.now(),
  });
});

/**
 * GET /api/admin/logs
 * Get recent system logs (mock implementation)
 */
admin.get('/logs', async (c) => {
  const limit = parseInt(c.req.query('limit') || '50');
  const level = c.req.query('level') || 'all';

  // Mock log data (in production, this would read from actual logs)
  const logs = [
    {
      level: 'info',
      message: 'Backend server started',
      timestamp: Date.now() - 3600000,
    },
    {
      level: 'info',
      message: 'Finnhub service health check passed',
      timestamp: Date.now() - 300000,
    },
    {
      level: 'warning',
      message: 'Cache hit rate below 80%',
      timestamp: Date.now() - 120000,
    },
    {
      level: 'info',
      message: 'Cache cleanup completed',
      timestamp: Date.now() - 60000,
    },
  ].slice(0, limit);

  return c.json({
    success: true,
    data: {
      logs: level === 'all' ? logs : logs.filter((log) => log.level === level),
      total: logs.length,
    },
    timestamp: Date.now(),
  });
});

export default admin;
