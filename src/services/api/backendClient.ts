/**
 * Backend API Client - Proxies requests through backend server
 * Automatically falls back to direct API calls if backend is unavailable
 */

import { BACKEND_URL, BACKEND_ENDPOINTS, BACKEND_CONFIG, fetchFromBackend } from '@/config/backend.config';
import type { FinnhubQuoteResponse, FinnhubNewsResponse } from '@/types';

import { coinGeckoClient } from './coinGeckoClient';
import { fearGreedClient } from './fearGreedClient';
import { finnhubClient } from './finnhubClient';


/**
 * Backend-aware Finnhub client
 */
export const backendFinnhubClient = {
  /**
   * Get stock quote (tries backend first, falls back to direct)
   */
  async getQuote(symbol: string): Promise<FinnhubQuoteResponse> {
    if (!BACKEND_CONFIG.enabled) {
      return finnhubClient.getQuote(symbol);
    }

    const result = await fetchFromBackend<any>(
      BACKEND_ENDPOINTS.marketQuote(symbol)
    );

    if (result.success && result.data) {
      console.log(`[Backend] Fetched quote: ${symbol}`);
      return {
        c: result.data.price,
        d: result.data.change,
        dp: result.data.changePercent,
        h: result.data.high,
        l: result.data.low,
        o: result.data.open,
        pc: result.data.previousClose,
        t: result.data.timestamp,
      };
    }

    // Fallback to direct API
    if (BACKEND_CONFIG.fallbackToDirect) {
      console.warn(`[Backend] Failed, falling back to direct API for ${symbol}`);
      return finnhubClient.getQuote(symbol);
    }

    throw new Error(result.error || 'Failed to fetch quote');
  },

  /**
   * Get batch quotes
   */
  async getBatchQuotes(symbols: string[]): Promise<FinnhubQuoteResponse[]> {
    if (!BACKEND_CONFIG.enabled) {
      return finnhubClient.getBatchQuotes(symbols);
    }

    const result = await fetchFromBackend<any[]>(
      BACKEND_ENDPOINTS.marketQuotes(symbols)
    );

    if (result.success && result.data) {
      console.log(`[Backend] Fetched ${result.data.length} quotes`);
      return result.data.map((quote: any) => ({
        c: quote.price,
        d: quote.change,
        dp: quote.changePercent,
        h: quote.high,
        l: quote.low,
        o: quote.open,
        pc: quote.previousClose,
        t: quote.timestamp,
      }));
    }

    // Fallback
    if (BACKEND_CONFIG.fallbackToDirect) {
      console.warn('[Backend] Failed, falling back to direct API for batch quotes');
      return finnhubClient.getBatchQuotes(symbols);
    }

    throw new Error(result.error || 'Failed to fetch quotes');
  },

  /**
   * Get market news
   */
  async getNews(category: string = 'general'): Promise<FinnhubNewsResponse[]> {
    if (!BACKEND_CONFIG.enabled) {
      return finnhubClient.getNews(category);
    }

    const result = await fetchFromBackend<any[]>(
      BACKEND_ENDPOINTS.news(category)
    );

    if (result.success && result.data) {
      console.log(`[Backend] Fetched ${result.data.length} news items`);
      return result.data.map((item: any) => ({
        category: item.category,
        datetime: item.timestamp,
        headline: item.title,
        id: parseInt(item.id, 10),
        image: item.imageUrl || '',
        related: item.related.join(','),
        source: item.source,
        summary: item.summary,
        url: item.url,
      }));
    }

    // Fallback
    if (BACKEND_CONFIG.fallbackToDirect) {
      console.warn('[Backend] Failed, falling back to direct API for news');
      return finnhubClient.getNews(category);
    }

    throw new Error(result.error || 'Failed to fetch news');
  },

  /**
   * Get company news
   */
  async getCompanyNews(symbol: string, from: string, to: string): Promise<FinnhubNewsResponse[]> {
    if (!BACKEND_CONFIG.enabled) {
      return finnhubClient.getCompanyNews(symbol, from, to);
    }

    const result = await fetchFromBackend<any[]>(
      BACKEND_ENDPOINTS.companyNews(symbol)
    );

    if (result.success && result.data) {
      console.log(`[Backend] Fetched company news for ${symbol}`);
      return result.data.map((item: any) => ({
        category: item.category,
        datetime: item.timestamp,
        headline: item.title,
        id: parseInt(item.id, 10),
        image: item.imageUrl || '',
        related: item.related.join(','),
        source: item.source,
        summary: item.summary,
        url: item.url,
      }));
    }

    // Fallback
    if (BACKEND_CONFIG.fallbackToDirect) {
      console.warn('[Backend] Failed, falling back to direct API for company news');
      return finnhubClient.getCompanyNews(symbol, from, to);
    }

    throw new Error(result.error || 'Failed to fetch company news');
  },
};

/**
 * Backend-aware CoinGecko client
 */
export const backendCoinGeckoClient = {
  /**
   * Get crypto price
   */
  async getPrice(coinId: string): Promise<any> {
    if (!BACKEND_CONFIG.enabled) {
      return coinGeckoClient.getPrice(coinId);
    }

    const result = await fetchFromBackend<any>(
      BACKEND_ENDPOINTS.cryptoPrice(coinId)
    );

    if (result.success && result.data) {
      console.log(`[Backend] Fetched crypto price: ${coinId}`);
      return {
        [coinId]: {
          usd: result.data.price,
          usd_24h_change: result.data.change24h,
          usd_market_cap: result.data.marketCap,
          usd_24h_vol: result.data.volume24h,
        },
      };
    }

    // Fallback
    if (BACKEND_CONFIG.fallbackToDirect) {
      console.warn('[Backend] Failed, falling back to direct API for crypto');
      return coinGeckoClient.getPrice(coinId);
    }

    throw new Error(result.error || 'Failed to fetch crypto price');
  },
};

/**
 * Backend-aware Fear & Greed client
 */
export const backendFearGreedClient = {
  /**
   * Get current Fear & Greed Index
   */
  async getCurrentIndex(): Promise<any> {
    if (!BACKEND_CONFIG.enabled) {
      return fearGreedClient.getCurrentIndex();
    }

    const result = await fetchFromBackend<any>(
      BACKEND_ENDPOINTS.fearGreed
    );

    if (result.success && result.data) {
      console.log('[Backend] Fetched Fear & Greed Index');
      return {
        fear_and_greed: {
          score: result.data.score,
          rating: result.data.rating,
          timestamp: result.data.timestamp,
          previous_close: result.data.previousClose,
          previous_1_week: result.data.previous1Week,
          previous_1_month: result.data.previous1Month,
          previous_1_year: result.data.previous1Year,
        },
      };
    }

    // Fallback
    if (BACKEND_CONFIG.fallbackToDirect) {
      console.warn('[Backend] Failed, falling back to direct API for Fear & Greed');
      return fearGreedClient.getCurrentIndex();
    }

    throw new Error(result.error || 'Failed to fetch Fear & Greed Index');
  },
};

/**
 * Export unified clients (use these in services)
 */
export const apiClients = {
  finnhub: backendFinnhubClient,
  coinGecko: backendCoinGeckoClient,
  fearGreed: backendFearGreedClient,
};
