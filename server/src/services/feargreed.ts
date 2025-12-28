// Fear & Greed Index API client
// Using alternative.me API (reliable from server-side)
import { config } from '../config/env';
import { cache } from './cache';

interface AlternativeMeResponse {
  name: string;
  data: {
    value: string;
    value_classification: string;
    timestamp: string;
    time_until_update: string;
  }[];
  metadata: {
    error: string | null;
  };
}

export class FearGreedService {
  // Use alternative.me API (works server-side, unlike CNN which blocks)
  private baseUrl = 'https://api.alternative.me/fng/';

  /**
   * Get current Fear & Greed Index
   */
  async getCurrentIndex(): Promise<any> {
    const cacheKey = 'feargreed:current';
    const cached = cache.get(cacheKey);

    if (cached) {
      console.log(`[FearGreed] Cache hit: current index`);
      return { ...cached, cached: true };
    }

    try {
      const response = await fetch(`${this.baseUrl}?limit=1`);

      if (!response.ok) {
        throw new Error(`Fear & Greed API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json() as AlternativeMeResponse;

      if (data.metadata?.error) {
        throw new Error(`Fear & Greed API error: ${data.metadata.error}`);
      }

      const current = data.data[0];
      const score = parseInt(current.value, 10);

      // Transform to our format
      const index = {
        score,
        rating: current.value_classification,
        timestamp: new Date(parseInt(current.timestamp, 10) * 1000).toISOString(),
        timeUntilUpdate: parseInt(current.time_until_update, 10),
        source: 'alternative.me',
      };

      // Cache for 1 hour
      cache.set(cacheKey, index, config.cacheTtl.sentiment);

      console.log(`[FearGreed] Fetched index: ${score} (${current.value_classification})`);
      return { ...index, cached: false };
    } catch (error) {
      console.error(`[FearGreed] Error fetching index:`, error);
      throw error;
    }
  }

  /**
   * Get historical Fear & Greed data
   */
  async getHistorical(limit: number = 30): Promise<any> {
    const cacheKey = `feargreed:historical:${limit}`;
    const cached = cache.get(cacheKey);

    if (cached) {
      console.log(`[FearGreed] Cache hit: historical`);
      return { data: cached, cached: true };
    }

    try {
      const response = await fetch(`${this.baseUrl}?limit=${limit}`);

      if (!response.ok) {
        throw new Error(`Fear & Greed API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json() as AlternativeMeResponse;

      if (data.metadata?.error) {
        throw new Error(`Fear & Greed API error: ${data.metadata.error}`);
      }

      // Transform to our format
      const historyData = data.data.map((item) => ({
        score: parseInt(item.value, 10),
        rating: item.value_classification,
        timestamp: new Date(parseInt(item.timestamp, 10) * 1000).toISOString(),
      }));

      // Cache for 1 hour
      cache.set(cacheKey, historyData, config.cacheTtl.sentiment);

      console.log(`[FearGreed] Fetched ${historyData.length} historical records`);
      return { data: historyData, cached: false };
    } catch (error) {
      console.error(`[FearGreed] Error fetching historical data:`, error);
      throw error;
    }
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.getCurrentIndex();
      return true;
    } catch (error) {
      console.error('[FearGreed] Health check failed:', error);
      return false;
    }
  }
}

export const fearGreedService = new FearGreedService();
