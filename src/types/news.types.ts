/**
 * News and sentiment type definitions for PULSE
 */

/**
 * News item structure
 */
export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  imageUrl?: string;
  publishedAt: string;
  timestamp: number;
  category: string;
  related: string[]; // Related symbols
  sentiment?: NewsSentiment;
}

/**
 * News sentiment analysis result
 */
export interface NewsSentiment {
  score: number; // -1 to 1
  label: 'bullish' | 'bearish' | 'neutral';
  confidence: number; // 0 to 1
}

/**
 * News feed request parameters
 */
export interface NewsFeedRequest {
  category?: 'general' | 'forex' | 'crypto' | 'merger';
  symbol?: string;
  from?: string; // ISO date
  to?: string; // ISO date
  limit?: number;
}
