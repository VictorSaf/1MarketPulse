// Health check routes
import { Hono } from 'hono';
import { finnhubService } from '../services/finnhub';
import { coinGeckoService } from '../services/coingecko';
import { fearGreedService } from '../services/feargreed';
import { cache } from '../services/cache';

const health = new Hono();

/**
 * GET /api/health
 * Basic health check
 */
health.get('/', async (c) => {
  return c.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: Date.now(),
    version: '1.0.0',
  });
});

/**
 * GET /api/health/services
 * Check all external service statuses
 */
health.get('/services', async (c) => {
  const startTime = Date.now();

  // Check all services in parallel
  const [finnhubStatus, coinGeckoStatus, fearGreedStatus] = await Promise.all([
    finnhubService.healthCheck().catch(() => false),
    coinGeckoService.healthCheck().catch(() => false),
    fearGreedService.healthCheck().catch(() => false),
  ]);

  const cacheStats = cache.getStats();
  const responseTime = Date.now() - startTime;

  const services = {
    finnhub: {
      status: finnhubStatus ? 'healthy' : 'unhealthy',
      description: 'Stock market data',
    },
    coingecko: {
      status: coinGeckoStatus ? 'healthy' : 'unhealthy',
      description: 'Cryptocurrency data',
    },
    fearGreed: {
      status: fearGreedStatus ? 'healthy' : 'unhealthy',
      description: 'Fear & Greed Index',
    },
  };

  const allHealthy = finnhubStatus && coinGeckoStatus && fearGreedStatus;

  return c.json({
    status: allHealthy ? 'healthy' : 'degraded',
    services,
    cache: cacheStats,
    responseTime: `${responseTime}ms`,
    timestamp: Date.now(),
  });
});

/**
 * GET /api/health/cache
 * Get cache statistics
 */
health.get('/cache', async (c) => {
  const stats = cache.getStats();
  return c.json({
    success: true,
    data: stats,
    timestamp: Date.now(),
  });
});

export default health;
