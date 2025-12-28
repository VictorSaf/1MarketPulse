/**
 * Sentiment Service - Handles market sentiment data
 */

import { CACHE_TTL } from '@/config';
import type { FearGreedResponse } from '@/types';

import { fearGreedClient } from '../api/fearGreedClient';
import { cacheManager } from '../cache/cacheManager';

export interface FearGreedIndex {
  score: number;
  rating: string;
  timestamp: string;
  cached?: boolean;
}

class SentimentService {
  /**
   * Get current Fear & Greed Index
   * @returns FearGreedIndex data
   */
  async getFearGreedIndex(): Promise<FearGreedIndex> {
    const cacheKey = 'sentiment:feargreed:current';

    const { data, cached } = await cacheManager.getOrFetch<FearGreedIndex>(
      cacheKey,
      async () => {
        const response = await fearGreedClient.getCurrentIndex();
        return this.transformFearGreedResponse(response);
      },
      CACHE_TTL.fearGreed
    );

    return {
      ...data,
      cached
    };
  }

  /**
   * Get historical Fear & Greed Index
   * @param date - Date in YYYY-MM-DD format
   * @returns FearGreedIndex data for that date
   */
  async getHistoricalFearGreed(date: string): Promise<FearGreedIndex> {
    const cacheKey = `sentiment:feargreed:${date}`;

    const { data, cached } = await cacheManager.getOrFetch<FearGreedIndex>(
      cacheKey,
      async () => {
        const response = await fearGreedClient.getHistoricalIndex(date);
        return this.transformFearGreedResponse(response);
      },
      CACHE_TTL.fearGreed
    );

    return {
      ...data,
      cached
    };
  }

  /**
   * Transform Fear & Greed API response
   * @private
   */
  private transformFearGreedResponse(
    response: FearGreedResponse
  ): FearGreedIndex {
    return {
      score: response.fear_and_greed.score,
      rating: response.fear_and_greed.rating,
      timestamp: response.fear_and_greed.timestamp
    };
  }

  /**
   * Invalidate Fear & Greed cache
   */
  async invalidate(): Promise<void> {
    await cacheManager.invalidatePattern('sentiment:feargreed:');
  }
}

export const sentimentService = new SentimentService();
