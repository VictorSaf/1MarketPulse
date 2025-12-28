// CoinGecko API client for cryptocurrency data
import { config } from '../config/env';
import { cache } from './cache';

interface CoinGeckoPrice {
  [coinId: string]: {
    usd: number;
    usd_24h_change: number;
    usd_market_cap: number;
    usd_24h_vol: number;
  };
}

export class CoinGeckoService {
  private baseUrl = config.api.coingecko;

  /**
   * Get cryptocurrency price
   */
  async getPrice(coinId: string): Promise<any> {
    const cacheKey = `coingecko:price:${coinId.toLowerCase()}`;
    const cached = cache.get(cacheKey);

    if (cached) {
      console.log(`[CoinGecko] Cache hit: ${coinId}`);
      return { ...cached, cached: true };
    }

    try {
      const url = `${this.baseUrl}/simple/price?ids=${coinId.toLowerCase()}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json() as CoinGeckoPrice;
      const coinData = data[coinId.toLowerCase()];

      if (!coinData) {
        throw new Error(`Coin ${coinId} not found`);
      }

      // Transform to our format
      const price = {
        coinId: coinId.toLowerCase(),
        price: coinData.usd,
        change24h: coinData.usd_24h_change,
        marketCap: coinData.usd_market_cap,
        volume24h: coinData.usd_24h_vol,
        timestamp: Date.now(),
        source: 'coingecko',
      };

      // Cache for 10 seconds
      cache.set(cacheKey, price, config.cacheTtl.crypto);

      console.log(`[CoinGecko] Fetched price: ${coinId} = $${coinData.usd}`);
      return { ...price, cached: false };
    } catch (error) {
      console.error(`[CoinGecko] Error fetching price for ${coinId}:`, error);
      throw error;
    }
  }

  /**
   * Get multiple cryptocurrency prices
   */
  async getMultiplePrices(coinIds: string[]): Promise<any[]> {
    const cacheKey = `coingecko:prices:${coinIds.join(',')}`;
    const cached = cache.get<any[]>(cacheKey);

    if (cached) {
      console.log(`[CoinGecko] Cache hit: multiple prices`);
      return cached;
    }

    try {
      const url = `${this.baseUrl}/simple/price?ids=${coinIds.join(',')}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json() as CoinGeckoPrice;

      // Transform to our format
      const prices = coinIds.map((coinId) => {
        const coinData = data[coinId.toLowerCase()];
        if (!coinData) return null;

        return {
          coinId: coinId.toLowerCase(),
          price: coinData.usd,
          change24h: coinData.usd_24h_change,
          marketCap: coinData.usd_market_cap,
          volume24h: coinData.usd_24h_vol,
          timestamp: Date.now(),
          source: 'coingecko',
        };
      }).filter(Boolean);

      // Cache for 10 seconds
      cache.set(cacheKey, prices, config.cacheTtl.crypto);

      console.log(`[CoinGecko] Fetched ${prices.length} prices`);
      return prices;
    } catch (error) {
      console.error(`[CoinGecko] Error fetching multiple prices:`, error);
      throw error;
    }
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      // Try to fetch Bitcoin price as health check
      await this.getPrice('bitcoin');
      return true;
    } catch (error) {
      console.error('[CoinGecko] Health check failed:', error);
      return false;
    }
  }
}

export const coinGeckoService = new CoinGeckoService();
