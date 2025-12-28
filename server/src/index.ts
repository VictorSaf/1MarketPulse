// 1MarketPulse Backend API Server
// Built with Bun + Hono for maximum performance

import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { config, validateEnv } from './config/env';
import { corsMiddleware } from './middleware/cors';
import { rateLimitMiddleware } from './middleware/rateLimit';
import { loggerMiddleware } from './middleware/logger';
import { securityHeadersMiddleware } from './middleware/securityHeaders';
import { errorHandler } from './middleware/errorHandler';
import { checkConnection } from './config/database';
import api from './routes';

// Validate environment variables
try {
  validateEnv();
  console.log('[Server] Environment validation passed');
} catch (error) {
  console.error('[Server] Failed to start:', error);
  process.exit(1);
}

// Check database connection
(async () => {
  const dbConnected = await checkConnection();
  if (dbConnected) {
    console.log('[Server] Database connection verified');
  } else {
    console.warn('[Server] Database connection failed - user management features will be unavailable');
    console.warn('[Server] Set DATABASE_URL environment variable to enable database features');
  }
})();

// Create Hono app
const app = new Hono();

// Apply global middleware
app.use('*', loggerMiddleware);
app.use('*', corsMiddleware);
app.use('*', securityHeadersMiddleware);
app.use('/api/*', rateLimitMiddleware);

// Error handler
app.onError(errorHandler);

// Root endpoint
app.get('/', (c) => {
  return c.json({
    name: '1MarketPulse API Server',
    version: '1.0.0',
    status: 'running',
    environment: config.nodeEnv,
    endpoints: {
      health: '/api/health',
      market: '/api/market',
      news: '/api/news',
      sentiment: '/api/sentiment',
      crypto: '/api/crypto',
      auth: '/api/auth',
      users: '/api/users (admin)',
    },
    documentation: 'https://github.com/VictorSaf/1MarketFeed',
  });
});

// Mount API routes
app.route('/api', api);

// 404 handler
app.notFound((c) => {
  return c.json(
    {
      error: 'Not Found',
      message: `Route ${c.req.path} not found`,
      availableRoutes: [
        'GET /',
        'GET /api/health',
        'GET /api/health/services',
        'GET /api/market/quote/:symbol',
        'GET /api/market/quotes?symbols=SPY,QQQ',
        'GET /api/news?category=general',
        'GET /api/news/:symbol',
        'GET /api/sentiment/fear-greed',
        'GET /api/crypto/price/:symbol',
        'GET /api/crypto/prices?symbols=BTC,ETH',
      ],
    },
    404
  );
});

// Start server
const port = config.port;

console.log(`
╔═══════════════════════════════════════════════════════╗
║         1MarketPulse API Server Starting...          ║
╚═══════════════════════════════════════════════════════╝

  Environment: ${config.nodeEnv}
  Port:        ${port}
  CORS:        ${config.corsOrigins.join(', ')}
  Cache TTL:   Quotes=${config.cacheTtl.quotes}s, News=${config.cacheTtl.news}s

  API Endpoints:
  ├─ GET  /api/health
  ├─ GET  /api/health/services
  ├─ GET  /api/market/quote/:symbol
  ├─ GET  /api/market/quotes?symbols=SPY,QQQ
  ├─ GET  /api/news?category=general
  ├─ GET  /api/news/:symbol
  ├─ GET  /api/sentiment/fear-greed
  ├─ GET  /api/crypto/price/:symbol
  ├─ GET  /api/crypto/prices?symbols=BTC,ETH
  ├─ POST /api/auth/login
  ├─ POST /api/auth/register
  ├─ GET  /api/auth/me
  └─ GET  /api/users (admin only)

  Ready at: http://localhost:${port}
`);

// Start server
serve({
  fetch: app.fetch,
  port,
});

console.log(`[Server] Listening on http://localhost:${port}`);
