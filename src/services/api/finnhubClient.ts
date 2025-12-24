/**
 * Finnhub API Client for stock data
 * Documentation: https://finnhub.io/docs/api
 */

import { BaseAPIClient } from './baseClient';
import type { FinnhubQuoteResponse, FinnhubNewsResponse } from '@/types';
import { API_ENDPOINTS, API_KEYS } from '@/config';

class FinnhubClient extends BaseAPIClient {
  constructor() {
    super(API_ENDPOINTS.finnhub.baseURL, {
      'X-Finnhub-Token': API_KEYS.finnhub
    });
  }

  /**
   * Get real-time quote for a stock symbol
   * @param symbol - Stock symbol (e.g., 'AAPL', 'TSLA')
   * @returns FinnhubQuoteResponse with current price, change, etc.
   */
  async getQuote(symbol: string): Promise<FinnhubQuoteResponse> {
    if (!API_KEYS.finnhub) {
      throw new Error('Finnhub API key is missing. Please set VITE_FINNHUB_API_KEY');
    }

    const response = await this.get<FinnhubQuoteResponse>(
      API_ENDPOINTS.finnhub.quote,
      { symbol: symbol.toUpperCase() }
    );

    return response.data;
  }

  /**
   * Get market news (general, forex, crypto, merger)
   * @param category - News category
   * @returns Array of news items
   */
  async getNews(category: string = 'general'): Promise<FinnhubNewsResponse[]> {
    if (!API_KEYS.finnhub) {
      throw new Error('Finnhub API key is missing');
    }

    const response = await this.get<FinnhubNewsResponse[]>(
      API_ENDPOINTS.finnhub.news,
      { category }
    );

    return response.data;
  }

  /**
   * Get company-specific news
   * @param symbol - Stock symbol
   * @param from - Start date (YYYY-MM-DD)
   * @param to - End date (YYYY-MM-DD)
   * @returns Array of company news items
   */
  async getCompanyNews(
    symbol: string,
    from: string,
    to: string
  ): Promise<FinnhubNewsResponse[]> {
    if (!API_KEYS.finnhub) {
      throw new Error('Finnhub API key is missing');
    }

    const response = await this.get<FinnhubNewsResponse[]>(
      API_ENDPOINTS.finnhub.companyNews,
      {
        symbol: symbol.toUpperCase(),
        from,
        to
      }
    );

    return response.data;
  }

  /**
   * Batch fetch quotes for multiple symbols
   * @param symbols - Array of stock symbols
   * @returns Array of quote responses
   */
  async getBatchQuotes(symbols: string[]): Promise<FinnhubQuoteResponse[]> {
    const promises = symbols.map(symbol => this.getQuote(symbol));
    const results = await Promise.allSettled(promises);

    return results
      .filter((r): r is PromiseFulfilledResult<FinnhubQuoteResponse> =>
        r.status === 'fulfilled'
      )
      .map(r => r.value);
  }
}

export const finnhubClient = new FinnhubClient();
