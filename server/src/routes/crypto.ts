// Cryptocurrency routes
import { Hono } from 'hono';
import { coinGeckoService } from '../services/coingecko';

const crypto = new Hono();

/**
 * GET /api/crypto/price/:symbol
 * Get cryptocurrency price
 */
crypto.get('/price/:symbol', async (c) => {
  const symbol = c.req.param('symbol');

  if (!symbol) {
    return c.json({ error: 'Symbol is required' }, 400);
  }

  // Map common symbols to CoinGecko IDs
  const symbolMap: Record<string, string> = {
    BTC: 'bitcoin',
    ETH: 'ethereum',
    SOL: 'solana',
    ADA: 'cardano',
    DOT: 'polkadot',
    MATIC: 'matic-network',
    AVAX: 'avalanche-2',
    LINK: 'chainlink',
    UNI: 'uniswap',
    ATOM: 'cosmos',
  };

  const coinId = symbolMap[symbol.toUpperCase()] || symbol.toLowerCase();

  try {
    const price = await coinGeckoService.getPrice(coinId);
    return c.json({
      success: true,
      data: price,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('[Crypto] Error fetching price:', error);
    return c.json(
      {
        success: false,
        error: 'Failed to fetch crypto price',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
});

/**
 * GET /api/crypto/prices?symbols=BTC,ETH,SOL
 * Get multiple cryptocurrency prices
 */
crypto.get('/prices', async (c) => {
  const symbolsParam = c.req.query('symbols');

  if (!symbolsParam) {
    return c.json({ error: 'Symbols parameter is required (e.g., ?symbols=BTC,ETH)' }, 400);
  }

  const symbols = symbolsParam.split(',').map((s) => s.trim()).filter(Boolean);

  if (symbols.length === 0) {
    return c.json({ error: 'At least one symbol is required' }, 400);
  }

  if (symbols.length > 10) {
    return c.json({ error: 'Maximum 10 symbols allowed per request' }, 400);
  }

  // Map symbols to CoinGecko IDs
  const symbolMap: Record<string, string> = {
    BTC: 'bitcoin',
    ETH: 'ethereum',
    SOL: 'solana',
    ADA: 'cardano',
    DOT: 'polkadot',
    MATIC: 'matic-network',
    AVAX: 'avalanche-2',
    LINK: 'chainlink',
    UNI: 'uniswap',
    ATOM: 'cosmos',
  };

  const coinIds = symbols.map((s) => symbolMap[s.toUpperCase()] || s.toLowerCase());

  try {
    const prices = await coinGeckoService.getMultiplePrices(coinIds);
    return c.json({
      success: true,
      data: prices,
      count: prices.length,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('[Crypto] Error fetching prices:', error);
    return c.json(
      {
        success: false,
        error: 'Failed to fetch crypto prices',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
});

export default crypto;
