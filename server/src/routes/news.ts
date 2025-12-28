// News routes
import { Hono } from 'hono';
import { finnhubService } from '../services/finnhub';

const news = new Hono();

/**
 * GET /api/news?category=general
 * Get market news by category
 */
news.get('/', async (c) => {
  const category = c.req.query('category') || 'general';

  try {
    const newsData = await finnhubService.getMarketNews(category);
    return c.json({
      success: true,
      data: newsData.data,
      cached: newsData.cached,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('[News] Error fetching news:', error);
    return c.json(
      {
        success: false,
        error: 'Failed to fetch news',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
});

/**
 * GET /api/news/:symbol
 * Get company-specific news
 */
news.get('/:symbol', async (c) => {
  const symbol = c.req.param('symbol');

  if (!symbol) {
    return c.json({ error: 'Symbol is required' }, 400);
  }

  try {
    const newsData = await finnhubService.getCompanyNews(symbol);
    return c.json({
      success: true,
      data: newsData.data,
      cached: newsData.cached,
      symbol: symbol.toUpperCase(),
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('[News] Error fetching company news:', error);
    return c.json(
      {
        success: false,
        error: 'Failed to fetch company news',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
});

export default news;
