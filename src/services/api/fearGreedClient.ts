/**
 * CNN Fear & Greed Index Client
 * Source: https://production.dataviz.cnn.io/index/fearandgreed/graphdata
 */

import { API_ENDPOINTS } from '@/config';
import type { FearGreedResponse } from '@/types';

import { BaseAPIClient } from './baseClient';

class FearGreedClient extends BaseAPIClient {
  constructor() {
    super(API_ENDPOINTS.fearGreed.baseURL);
  }

  /**
   * Get current Fear & Greed Index
   * @returns Current index data with score and rating
   */
  async getCurrentIndex(): Promise<FearGreedResponse> {
    const response = await this.get<FearGreedResponse>('');
    return response.data;
  }

  /**
   * Get historical Fear & Greed Index for a specific date
   * @param date - Date in YYYY-MM-DD format
   * @returns Historical index data
   */
  async getHistoricalIndex(date: string): Promise<FearGreedResponse> {
    const response = await this.get<FearGreedResponse>(`/${date}`);
    return response.data;
  }

  /**
   * Get index data for a date range
   * @param startDate - Start date in YYYY-MM-DD format
   * @param endDate - End date in YYYY-MM-DD format
   * @returns Array of index data for each date
   */
  async getIndexRange(
    startDate: string,
    endDate: string
  ): Promise<FearGreedResponse[]> {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dates: string[] = [];

    // Generate all dates in range
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(d.toISOString().split('T')[0]);
    }

    // Fetch data for each date
    const promises = dates.map(date => this.getHistoricalIndex(date));
    const results = await Promise.allSettled(promises);

    return results
      .filter((r): r is PromiseFulfilledResult<FearGreedResponse> =>
        r.status === 'fulfilled'
      )
      .map(r => r.value);
  }
}

export const fearGreedClient = new FearGreedClient();
