/**
 * Crypto Service - Handles cryptocurrency price fetching with caching
 */

import { CACHE_TTL } from '@/config';
import type { CryptoPrice, CoinGeckoSimplePriceResponse } from '@/types';
import { CRYPTO_ID_MAP } from '@/types';

import { coinGeckoClient } from '../api/coinGeckoClient';
import { cacheManager } from '../cache/cacheManager';

class CryptoService {
  /**
   * Get cryptocurrency price with caching
   * @param symbol - Crypto symbol (e.g., 'BTC', 'ETH')
   * @returns CryptoPrice with normalized data
   */
  async getPrice(symbol: string): Promise<CryptoPrice> {
    const cacheKey = `crypto:price:${symbol.toUpperCase()}`;

    const { data, cached } = await cacheManager.getOrFetch<CryptoPrice>(
      cacheKey,
      async () => {
        const prices = await coinGeckoClient.getSimplePrices([symbol]);
        return this.transformCoinGeckoPrice(symbol, prices);
      },
      CACHE_TTL.cryptoPrice
    );

    return {
      ...data,
      cached,
      source: cached ? 'cache' : 'coingecko'
    };
  }

  /**
   * Get multiple cryptocurrency prices
   * @param symbols - Array of crypto symbols
   * @returns Array of CryptoPrice objects
   */
  async getBatchPrices(symbols: string[]): Promise<CryptoPrice[]> {
    const cacheKey = `crypto:batch:${symbols.sort().join(',')}`;

    const { data, cached } = await cacheManager.getOrFetch<CryptoPrice[]>(
      cacheKey,
      async () => {
        const prices = await coinGeckoClient.getSimplePrices(symbols);
        return symbols.map(symbol =>
          this.transformCoinGeckoPrice(symbol, prices)
        );
      },
      CACHE_TTL.cryptoPrice
    );

    return data.map(price => ({
      ...price,
      cached,
      source: cached ? 'cache' : 'coingecko'
    }));
  }

  /**
   * Transform CoinGecko response to our CryptoPrice format
   * @private
   */
  private transformCoinGeckoPrice(
    symbol: string,
    data: CoinGeckoSimplePriceResponse
  ): CryptoPrice {
    const coinId = CRYPTO_ID_MAP[symbol.toUpperCase()] || symbol.toLowerCase();
    const coinData = data[coinId];

    if (!coinData) {
      throw new Error(`No data found for symbol: ${symbol}`);
    }

    return {
      id: coinId,
      symbol: symbol.toUpperCase(),
      name: this.getCoinName(symbol),
      price: coinData.usd,
      change24h: coinData.usd_24h_change || 0,
      changePercent24h: coinData.usd_24h_change || 0,
      marketCap: coinData.usd_market_cap || 0,
      volume24h: coinData.usd_24h_vol || 0,
      timestamp: Date.now(),
      source: 'coingecko'
    };
  }

  /**
   * Get coin name from symbol
   * @private
   */
  private getCoinName(symbol: string): string {
    const names: Record<string, string> = {
      BTC: 'Bitcoin',
      ETH: 'Ethereum',
      SOL: 'Solana',
      DOGE: 'Dogecoin',
      ADA: 'Cardano',
      XRP: 'Ripple'
    };

    return names[symbol.toUpperCase()] || symbol;
  }

  /**
   * Invalidate cache for a symbol
   * @param symbol - Crypto symbol
   */
  async invalidatePrice(symbol: string): Promise<void> {
    const cacheKey = `crypto:price:${symbol.toUpperCase()}`;
    await cacheManager.invalidate(cacheKey);
  }

  /**
   * Invalidate all crypto price caches
   */
  async invalidateAll(): Promise<void> {
    await cacheManager.invalidatePattern('crypto:');
  }
}

export const cryptoService = new CryptoService();
