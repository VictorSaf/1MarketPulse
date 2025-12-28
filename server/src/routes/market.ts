// Market data routes
import { Hono } from 'hono';
import { finnhubService } from '../services/finnhub';

const market = new Hono();

/**
 * GET /api/market/quote/:symbol
 * Get stock quote for a symbol
 */
market.get('/quote/:symbol', async (c) => {
  const symbol = c.req.param('symbol');

  if (!symbol) {
    return c.json({ error: 'Symbol is required' }, 400);
  }

  try {
    const quote = await finnhubService.getQuote(symbol);
    return c.json({
      success: true,
      data: quote,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('[Market] Error fetching quote:', error);
    return c.json(
      {
        success: false,
        error: 'Failed to fetch quote',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
});

/**
 * GET /api/market/quotes?symbols=SPY,QQQ,DIA
 * Get multiple stock quotes
 */
market.get('/quotes', async (c) => {
  const symbolsParam = c.req.query('symbols');

  if (!symbolsParam) {
    return c.json({ error: 'Symbols parameter is required (e.g., ?symbols=SPY,QQQ)' }, 400);
  }

  const symbols = symbolsParam.split(',').map((s) => s.trim()).filter(Boolean);

  if (symbols.length === 0) {
    return c.json({ error: 'At least one symbol is required' }, 400);
  }

  if (symbols.length > 10) {
    return c.json({ error: 'Maximum 10 symbols allowed per request' }, 400);
  }

  try {
    const quotes = await finnhubService.getMultipleQuotes(symbols);
    return c.json({
      success: true,
      data: quotes,
      count: quotes.length,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('[Market] Error fetching quotes:', error);
    return c.json(
      {
        success: false,
        error: 'Failed to fetch quotes',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
});

/**
 * GET /api/market/calendar/economic
 * Get economic calendar events
 */
market.get('/calendar/economic', async (c) => {
  try {
    const result = await finnhubService.getEconomicCalendar();
    return c.json({
      success: true,
      data: result.data,
      cached: result.cached,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('[Market] Error fetching economic calendar:', error);
    return c.json(
      {
        success: false,
        error: 'Failed to fetch economic calendar',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
});

export default market;
