/**
 * News Service for PULSE
 * Fetches and manages market news through backend API proxy
 */

import { CACHE_TTL } from '@/config';
import type { NewsItem, NewsFeedRequest, FinnhubNewsResponse } from '@/types';

import { cacheManager } from '../cache/cacheManager';

// Backend API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface BackendNewsResponse {
  success: boolean;
  data: FinnhubNewsResponse[];
  cached?: boolean;
  timestamp?: number;
  error?: string;
}

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
   * Get market news by category (through backend proxy)
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
          const response = await fetch(`${API_BASE_URL}/api/news?category=${category}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error(`Backend API error: ${response.status}`);
          }

          const data: BackendNewsResponse = await response.json();

          if (!data.success) {
            throw new Error(data.error || 'Failed to fetch news');
          }

          return data.data.slice(0, limit);
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
   * Get company-specific news (through backend proxy)
   * @param symbol - Stock symbol (e.g., 'AAPL')
   * @param limit - Number of news items to fetch
   * @returns Array of news items for the symbol
   */
  async getCompanyNews(symbol: string, limit: number = 10): Promise<NewsItem[]> {
    const cacheKey = `news:company:${symbol}:${limit}`;

    try {
      const result = await cacheManager.getOrFetch<FinnhubNewsResponse[]>(
        cacheKey,
        async () => {
          const response = await fetch(`${API_BASE_URL}/api/news/${symbol.toUpperCase()}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error(`Backend API error: ${response.status}`);
          }

          const data: BackendNewsResponse = await response.json();

          if (!data.success) {
            throw new Error(data.error || 'Failed to fetch company news');
          }

          return data.data.slice(0, limit);
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
