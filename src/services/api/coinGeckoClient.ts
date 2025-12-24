/**
 * CoinGecko API Client for cryptocurrency data
 * Documentation: https://docs.coingecko.com/
 */

import { BaseAPIClient } from './baseClient';
import type { CoinGeckoSimplePriceResponse, CoinGeckoCoinResponse } from '@/types';
import { CRYPTO_ID_MAP } from '@/types';
import { API_ENDPOINTS } from '@/config';

class CoinGeckoClient extends BaseAPIClient {
  constructor() {
    super(API_ENDPOINTS.coinGecko.baseURL, {
      'Accept': 'application/json'
    });
  }

  /**
   * Get simple prices for multiple cryptocurrencies
   * @param symbols - Array of crypto symbols (e.g., ['BTC', 'ETH', 'SOL'])
   * @returns Price data for each cryptocurrency
   */
  async getSimplePrices(
    symbols: string[]
  ): Promise<CoinGeckoSimplePriceResponse> {
    const ids = symbols
      .map(s => CRYPTO_ID_MAP[s.toUpperCase()] || s.toLowerCase())
      .join(',');

    const response = await this.get<CoinGeckoSimplePriceResponse>(
      API_ENDPOINTS.coinGecko.simplePrice,
      {
        ids,
        vs_currencies: 'usd',
        include_24hr_change: true,
        include_market_cap: true,
        include_24hr_vol: true
      }
    );

    return response.data;
  }

  /**
   * Get detailed coin data for a single cryptocurrency
   * @param symbol - Crypto symbol (e.g., 'BTC', 'ETH')
   * @returns Detailed coin data including price, market cap, etc.
   */
  async getCoinData(symbol: string): Promise<CoinGeckoCoinResponse> {
    const coinId = this.getCoinId(symbol);

    const response = await this.get<CoinGeckoCoinResponse>(
      `${API_ENDPOINTS.coinGecko.coins}/${coinId}`,
      {
        localization: false,
        tickers: false,
        community_data: false,
        developer_data: false
      }
    );

    return response.data;
  }

  /**
   * Convert symbol to CoinGecko coin ID
   * @param symbol - Crypto symbol (e.g., 'BTC')
   * @returns CoinGecko coin ID (e.g., 'bitcoin')
   */
  getCoinId(symbol: string): string {
    return CRYPTO_ID_MAP[symbol.toUpperCase()] || symbol.toLowerCase();
  }

  /**
   * Batch fetch detailed data for multiple coins
   * @param symbols - Array of crypto symbols
   * @returns Array of detailed coin data
   */
  async getBatchCoinData(symbols: string[]): Promise<CoinGeckoCoinResponse[]> {
    const promises = symbols.map(symbol => this.getCoinData(symbol));
    const results = await Promise.allSettled(promises);

    return results
      .filter((r): r is PromiseFulfilledResult<CoinGeckoCoinResponse> =>
        r.status === 'fulfilled'
      )
      .map(r => r.value);
  }
}

export const coinGeckoClient = new CoinGeckoClient();
