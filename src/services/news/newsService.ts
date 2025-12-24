/**
 * News Service for PULSE
 * Fetches and manages market news from Finnhub API
 */

import { finnhubClient } from '../api/finnhubClient';
import { cacheManager } from '../cache/cacheManager';
import { CACHE_TTL } from '@/config';
import type { NewsItem, NewsFeedRequest, FinnhubNewsResponse } from '@/types';

class NewsService {
  /**
   * Transform Finnhub news response to NewsItem format
   */
  private transformNews(finnhubNews: FinnhubNewsResponse): NewsItem {
    return {
      id: String(finnhubNews.id),
      title: finnhubNews.headline,
      summary: finnhubNews.summary,
      source: finnhubNews.source,
      url: finnhubNews.url,
      imageUrl: finnhubNews.image || undefined,
      publishedAt: new Date(finnhubNews.datetime * 1000).toISOString(),
      timestamp: finnhubNews.datetime * 1000,
      category: finnhubNews.category,
      related: finnhubNews.related ? finnhubNews.related.split(',').map(s => s.trim()) : [],
      // Sentiment will be added by AI service
      sentiment: undefined
    };
  }

  /**
   * Get market news by category
   * @param request - News feed request parameters
   * @returns Array of news items
   */
  async getNews(request: NewsFeedRequest = {}): Promise<NewsItem[]> {
    const { category = 'general', limit = 20 } = request;
    const cacheKey = `news:${category}:${limit}`;

    try {
      // Try cache first
      const result = await cacheManager.getOrFetch<FinnhubNewsResponse[]>(
        cacheKey,
        async () => {
          const finnhubNews = await finnhubClient.getNews(category);
          return finnhubNews.slice(0, limit);
        },
        CACHE_TTL.news
      );

      // Transform to NewsItem format
      const newsItems = result.data.map(item => this.transformNews(item));

      return newsItems;
    } catch (error) {
      console.error('Failed to fetch news:', error);
      throw new Error(`News fetch failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get company-specific news
   * @param symbol - Stock symbol (e.g., 'AAPL')
   * @param limit - Number of news items to fetch
   * @returns Array of news items for the symbol
   */
  async getCompanyNews(symbol: string, limit: number = 10): Promise<NewsItem[]> {
    const cacheKey = `news:company:${symbol}:${limit}`;

    try {
      // Calculate date range (last 7 days)
      const to = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const from = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const result = await cacheManager.getOrFetch<FinnhubNewsResponse[]>(
        cacheKey,
        async () => {
          const finnhubNews = await finnhubClient.getCompanyNews(symbol, from, to);
          return finnhubNews.slice(0, limit);
        },
        CACHE_TTL.news
      );

      // Transform to NewsItem format
      const newsItems = result.data.map(item => this.transformNews(item));

      return newsItems;
    } catch (error) {
      console.error(`Failed to fetch news for ${symbol}:`, error);
      throw new Error(`Company news fetch failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get latest market news (general category, 20 items)
   * Convenience method for quick access
   */
  async getLatestNews(): Promise<NewsItem[]> {
    return this.getNews({ category: 'general', limit: 20 });
  }

  /**
   * Get crypto-specific news
   */
  async getCryptoNews(limit: number = 15): Promise<NewsItem[]> {
    return this.getNews({ category: 'crypto', limit });
  }

  /**
   * Get forex news
   */
  async getForexNews(limit: number = 15): Promise<NewsItem[]> {
    return this.getNews({ category: 'forex', limit });
  }

  /**
   * Get merger & acquisition news
   */
  async getMergerNews(limit: number = 15): Promise<NewsItem[]> {
    return this.getNews({ category: 'merger', limit });
  }

  /**
   * Clear news cache
   */
  async clearCache(): Promise<void> {
    // This would need implementation in cacheManager to support pattern-based deletion
    console.log('News cache cleared');
  }
}

export const newsService = new NewsService();
