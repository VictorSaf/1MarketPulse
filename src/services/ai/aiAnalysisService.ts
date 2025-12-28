/**
 * AI Analysis Service
 * Combines Ollama client with prompt templates for financial analysis
 */

import type { NewsItem } from '@/types';

import { ollamaClient } from './ollamaClient';
import {
  sentimentAnalysisPrompt,
  marketBriefPrompt,
  marketDNAPrompt,
  eventAnalysisPrompt,
  riskAssessmentPrompt,
  extractJSON,
  type SentimentAnalysisResult,
  type MarketBriefResult,
  type MarketDNAResult
} from './promptTemplates';

class AIAnalysisService {
  private readonly SENTIMENT_MODEL = 'llama3.2:3b'; // Fast model for sentiment
  private readonly ANALYSIS_MODEL = 'qwen2.5:14b'; // Powerful model for analysis
  private readonly FAST_MODEL = 'mistral:7b'; // Balanced model for quick tasks

  /**
   * Analyze sentiment of a news headline or text
   * @param text - News headline or article text
   * @returns Sentiment analysis result
   */
  async analyzeSentiment(text: string): Promise<SentimentAnalysisResult> {
    if (!ollamaClient.isServiceAvailable()) {
      // Fallback to basic sentiment if Ollama is not available
      return this.basicSentiment(text);
    }

    try {
      const prompt = sentimentAnalysisPrompt(text);
      const response = await ollamaClient.generateJSON<SentimentAnalysisResult>(
        prompt,
        this.SENTIMENT_MODEL
      );

      return response;
    } catch (error) {
      console.error('AI sentiment analysis failed, using fallback:', error);
      return this.basicSentiment(text);
    }
  }

  /**
   * Analyze sentiment for multiple news items in batch
   * @param newsItems - Array of news items
   * @returns News items with sentiment added
   */
  async analyzeBatchSentiment(newsItems: NewsItem[]): Promise<NewsItem[]> {
    const analyzed = await Promise.all(
      newsItems.map(async (item) => {
        try {
          const sentiment = await this.analyzeSentiment(item.title);
          return {
            ...item,
            sentiment: {
              score: sentiment.sentiment === 'positive' ? 0.5 : sentiment.sentiment === 'negative' ? -0.5 : 0,
              label: sentiment.sentiment === 'positive' ? 'bullish' : sentiment.sentiment === 'negative' ? 'bearish' : 'neutral',
              confidence: sentiment.confidence
            }
          };
        } catch (error) {
          console.error(`Failed to analyze sentiment for news ${item.id}:`, error);
          return item;
        }
      })
    );

    return analyzed;
  }

  /**
   * Generate daily market brief
   * @param marketData - Current market data (prices, volume, indices)
   * @returns Market brief with key points
   */
  async generateMarketBrief(marketData: any): Promise<MarketBriefResult> {
    if (!ollamaClient.isServiceAvailable()) {
      return this.fallbackBrief(marketData);
    }

    try {
      const prompt = marketBriefPrompt(marketData);
      const response = await ollamaClient.generateJSON<MarketBriefResult>(
        prompt,
        this.FAST_MODEL
      );

      return response;
    } catch (error) {
      console.error('AI brief generation failed, using fallback:', error);
      return this.fallbackBrief(marketData);
    }
  }

  /**
   * Generate Market DNA code
   * @param marketData - Market data including VIX, sentiment, volume
   * @returns DNA analysis
   */
  async generateMarketDNA(marketData: any): Promise<MarketDNAResult> {
    if (!ollamaClient.isServiceAvailable()) {
      return this.fallbackDNA(marketData);
    }

    try {
      const prompt = marketDNAPrompt(marketData);
      const response = await ollamaClient.generateJSON<MarketDNAResult>(
        prompt,
        this.ANALYSIS_MODEL
      );

      return response;
    } catch (error) {
      console.error('AI DNA generation failed, using fallback:', error);
      return this.fallbackDNA(marketData);
    }
  }

  /**
   * Analyze breaking market event
   * @param event - Event description
   * @returns Event analysis
   */
  async analyzeEvent(event: string): Promise<any> {
    if (!ollamaClient.isServiceAvailable()) {
      return {
        impact: 'neutral',
        analysis: 'AI analysis unavailable. Please start Ollama service.',
        affected_sectors: [],
        key_levels: []
      };
    }

    try {
      const prompt = eventAnalysisPrompt(event);
      return await ollamaClient.generateJSON(prompt, this.FAST_MODEL);
    } catch (error) {
      console.error('AI event analysis failed:', error);
      throw error;
    }
  }

  /**
   * Basic sentiment analysis fallback (keyword-based)
   * Used when Ollama is not available
   */
  private basicSentiment(text: string): SentimentAnalysisResult {
    const lowerText = text.toLowerCase();

    // Positive keywords
    const positiveKeywords = [
      'beat', 'surge', 'gain', 'rise', 'jump', 'rally', 'boom', 'growth',
      'record', 'high', 'strong', 'upgrade', 'buy', 'bullish', 'positive',
      'profit', 'revenue', 'exceed', 'outperform'
    ];

    // Negative keywords
    const negativeKeywords = [
      'miss', 'fall', 'drop', 'decline', 'plunge', 'crash', 'weak', 'loss',
      'low', 'downgrade', 'sell', 'bearish', 'negative', 'layoff', 'recession',
      'crisis', 'concern', 'warning', 'cut'
    ];

    let score = 0;
    positiveKeywords.forEach(word => {
      if (lowerText.includes(word)) {score++;}
    });
    negativeKeywords.forEach(word => {
      if (lowerText.includes(word)) {score--;}
    });

    let sentiment: 'positive' | 'negative' | 'neutral';
    let confidence: number;

    if (score > 0) {
      sentiment = 'positive';
      confidence = Math.min(0.7, 0.5 + score * 0.1);
    } else if (score < 0) {
      sentiment = 'negative';
      confidence = Math.min(0.7, 0.5 + Math.abs(score) * 0.1);
    } else {
      sentiment = 'neutral';
      confidence = 0.5;
    }

    return {
      sentiment,
      confidence,
      reasoning: 'Keyword-based analysis (Ollama unavailable)'
    };
  }

  /**
   * Fallback market brief
   */
  private fallbackBrief(marketData: any): MarketBriefResult {
    return {
      brief: 'Market analysis unavailable. Please start Ollama AI service for enhanced insights.',
      key_points: ['AI service offline', 'Using basic market data only'],
      outlook: 'neutral'
    };
  }

  /**
   * Fallback DNA generation
   */
  private fallbackDNA(marketData: any): MarketDNAResult {
    // Simple heuristic-based DNA
    const vix = marketData.vix || 15;
    const sentiment = marketData.fearGreed || 50;
    const trend = marketData.spyChange || 0;

    const appetite = vix < 15 && sentiment > 60 ? 'high' : vix > 20 && sentiment < 40 ? 'low' : 'medium';
    const trendValue = trend > 0.5 ? 'bullish' : trend < -0.5 ? 'bearish' : 'neutral';

    return {
      dna: 'ATGC', // Generic fallback
      appetite,
      trend: trendValue,
      gravity: 'weak',
      catalyst: 'medium',
      explanation: 'Fallback DNA - Ollama AI unavailable'
    };
  }

  /**
   * Check if AI service is available
   */
  isAvailable(): boolean {
    return ollamaClient.isServiceAvailable();
  }

  /**
   * Get AI service status
   */
  async getStatus(): Promise<{ available: boolean; models: string[] }> {
    const available = ollamaClient.isServiceAvailable();
    const models = available ? await ollamaClient.getAvailableModels() : [];
    return { available, models };
  }
}

export const aiAnalysisService = new AIAnalysisService();
