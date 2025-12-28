// Sentiment routes (Fear & Greed Index)
import { Hono } from 'hono';
import { fearGreedService } from '../services/feargreed';

const sentiment = new Hono();

/**
 * GET /api/sentiment/fear-greed
 * Get current Fear & Greed Index
 */
sentiment.get('/fear-greed', async (c) => {
  try {
    const index = await fearGreedService.getCurrentIndex();
    return c.json({
      success: true,
      data: index,
      cached: index.cached,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('[Sentiment] Error fetching Fear & Greed Index:', error);
    return c.json(
      {
        success: false,
        error: 'Failed to fetch Fear & Greed Index',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
});

/**
 * GET /api/sentiment/fear-greed/historical
 * Get historical Fear & Greed data
 */
sentiment.get('/fear-greed/historical', async (c) => {
  try {
    const data = await fearGreedService.getHistorical();
    return c.json({
      success: true,
      data: data.data,
      cached: data.cached,
      count: data.data.length,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('[Sentiment] Error fetching historical data:', error);
    return c.json(
      {
        success: false,
        error: 'Failed to fetch historical Fear & Greed data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
});

export default sentiment;
