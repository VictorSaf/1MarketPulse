// Finnhub API client for stock data and news
import { config } from '../config/env';
import { cache } from './cache';

interface FinnhubQuote {
  c: number; // Current price
  d: number; // Change
  dp: number; // Percent change
  h: number; // High price of the day
  l: number; // Low price of the day
  o: number; // Open price of the day
  pc: number; // Previous close price
  t: number; // Timestamp
}

interface FinnhubNews {
  category: string;
  datetime: number;
  headline: string;
  id: number;
  image: string;
  related: string;
  source: string;
  summary: string;
  url: string;
}

export class FinnhubService {
  private baseUrl = config.api.finnhub;
  private apiKey = config.finnhubApiKey;

  /**
   * Get stock quote for a symbol
   */
  async getQuote(symbol: string): Promise<any> {
    const cacheKey = `finnhub:quote:${symbol.toUpperCase()}`;
    const cached = cache.get(cacheKey);

    if (cached) {
      console.log(`[Finnhub] Cache hit: ${symbol}`);
      return { ...cached, cached: true };
    }

    try {
      const url = `${this.baseUrl}/quote?symbol=${symbol.toUpperCase()}&token=${this.apiKey}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Finnhub API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json() as FinnhubQuote;

      // Transform to our format
      const quote = {
        symbol: symbol.toUpperCase(),
        price: data.c,
        change: data.d,
        changePercent: data.dp,
        high: data.h,
        low: data.l,
        open: data.o,
        previousClose: data.pc,
        timestamp: data.t,
        source: 'finnhub',
      };

      // Cache for 15 seconds
      cache.set(cacheKey, quote, config.cacheTtl.quotes);

      console.log(`[Finnhub] Fetched quote: ${symbol} = $${data.c}`);
      return { ...quote, cached: false };
    } catch (error) {
      console.error(`[Finnhub] Error fetching quote for ${symbol}:`, error);
      throw error;
    }
  }

  /**
   * Get multiple stock quotes
   */
  async getMultipleQuotes(symbols: string[]): Promise<any[]> {
    const promises = symbols.map(symbol => this.getQuote(symbol));
    return Promise.all(promises);
  }

  /**
   * Get market news
   */
  async getMarketNews(category: string = 'general'): Promise<any> {
    const cacheKey = `finnhub:news:${category}`;
    const cached = cache.get(cacheKey);

    if (cached) {
      console.log(`[Finnhub] Cache hit: news/${category}`);
      return { data: cached, cached: true };
    }

    try {
      const url = `${this.baseUrl}/news?category=${category}&token=${this.apiKey}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Finnhub API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json() as FinnhubNews[];

      // Transform to our format
      const news = data.slice(0, 20).map((item) => ({
        id: item.id.toString(),
        title: item.headline,
        summary: item.summary,
        source: item.source,
        url: item.url,
        imageUrl: item.image,
        publishedAt: new Date(item.datetime * 1000).toISOString(),
        timestamp: item.datetime,
        category: item.category,
        related: item.related ? item.related.split(',') : [],
      }));

      // Cache for 5 minutes
      cache.set(cacheKey, news, config.cacheTtl.news);

      console.log(`[Finnhub] Fetched ${news.length} news items for ${category}`);
      return { data: news, cached: false };
    } catch (error) {
      console.error(`[Finnhub] Error fetching news for ${category}:`, error);
      throw error;
    }
  }

  /**
   * Get company-specific news
   */
  async getCompanyNews(symbol: string, from?: string, to?: string): Promise<any> {
    const cacheKey = `finnhub:company-news:${symbol}`;
    const cached = cache.get(cacheKey);

    if (cached) {
      console.log(`[Finnhub] Cache hit: company-news/${symbol}`);
      return { data: cached, cached: true };
    }

    try {
      // Default to last 7 days if not specified
      const toDate = to || new Date().toISOString().split('T')[0];
      const fromDate = from || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const url = `${this.baseUrl}/company-news?symbol=${symbol.toUpperCase()}&from=${fromDate}&to=${toDate}&token=${this.apiKey}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Finnhub API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json() as FinnhubNews[];

      // Transform to our format
      const news = data.slice(0, 20).map((item) => ({
        id: item.id.toString(),
        title: item.headline,
        summary: item.summary,
        source: item.source,
        url: item.url,
        imageUrl: item.image,
        publishedAt: new Date(item.datetime * 1000).toISOString(),
        timestamp: item.datetime,
        category: item.category,
        related: item.related ? item.related.split(',') : [],
      }));

      // Cache for 5 minutes
      cache.set(cacheKey, news, config.cacheTtl.news);

      console.log(`[Finnhub] Fetched ${news.length} company news items for ${symbol}`);
      return { data: news, cached: false };
    } catch (error) {
      console.error(`[Finnhub] Error fetching company news for ${symbol}:`, error);
      throw error;
    }
  }

  /**
   * Get economic calendar events
   */
  async getEconomicCalendar(): Promise<any> {
    const cacheKey = 'finnhub:economic-calendar';
    const cached = cache.get(cacheKey);

    if (cached) {
      console.log('[Finnhub] Cache hit: economic-calendar');
      return { data: cached, cached: true };
    }

    try {
      // Get today's date and 7 days from now
      const fromDate = new Date().toISOString().split('T')[0];
      const toDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const url = `${this.baseUrl}/calendar/economic?from=${fromDate}&to=${toDate}&token=${this.apiKey}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Finnhub API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json() as { economicCalendar?: any[] };

      // Transform to our format
      const events = (data.economicCalendar || []).slice(0, 20).map((item: any, index: number) => ({
        id: `${item.time}-${index}`,
        time: item.time ? new Date(item.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '--:--',
        event: item.event || 'Unknown Event',
        impact: item.impact === 3 ? 'high' : item.impact === 2 ? 'medium' : 'low',
        country: item.country || 'USD',
        previous: item.prev?.toString() || '-',
        forecast: item.estimate?.toString() || '-',
        actual: item.actual?.toString() || '-',
        unit: item.unit || '',
      }));

      // Cache for 30 minutes
      cache.set(cacheKey, events, 1800);

      console.log(`[Finnhub] Fetched ${events.length} economic calendar events`);
      return { data: events, cached: false };
    } catch (error) {
      console.error('[Finnhub] Error fetching economic calendar:', error);
      throw error;
    }
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      // Try to fetch SPY quote as health check
      await this.getQuote('SPY');
      return true;
    } catch (error) {
      console.error('[Finnhub] Health check failed:', error);
      return false;
    }
  }
}

export const finnhubService = new FinnhubService();
