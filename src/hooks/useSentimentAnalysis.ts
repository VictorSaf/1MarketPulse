/**
 * React hook for AI-powered sentiment analysis
 * Integrates with Ollama for real-time market insights
 */

import { useState, useEffect, useCallback } from 'react';

import { aiAnalysisService } from '@/services/ai/aiAnalysisService';
import type { NewsItem } from '@/types';

export interface UseSentimentAnalysisOptions {
  newsItems?: NewsItem[];
  autoAnalyze?: boolean; // Automatically analyze when newsItems change
  enabled?: boolean;
}

export interface UseSentimentAnalysisReturn {
  analyzedNews: NewsItem[];
  analyzing: boolean;
  error: Error | null;
  analyzeNews: (items: NewsItem[]) => Promise<void>;
  isAIAvailable: boolean;
}

/**
 * Hook for AI-powered sentiment analysis of news items
 *
 * @example
 * ```tsx
 * const { analyzedNews, analyzing, analyzeNews } = useSentimentAnalysis({
 *   newsItems: news,
 *   autoAnalyze: true
 * });
 * ```
 */
export function useSentimentAnalysis(
  options: UseSentimentAnalysisOptions = {}
): UseSentimentAnalysisReturn {
  const { newsItems = [], autoAnalyze = false, enabled = true } = options;

  const [analyzedNews, setAnalyzedNews] = useState<NewsItem[]>([]);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [isAIAvailable, setIsAIAvailable] = useState<boolean>(false);

  /**
   * Check AI service availability
   */
  useEffect(() => {
    const checkAvailability = async () => {
      const status = await aiAnalysisService.getStatus();
      setIsAIAvailable(status.available);

      if (!status.available) {
        console.warn('Ollama AI is not available. Sentiment analysis will use fallback method.');
      }
    };

    checkAvailability();
  }, []);

  /**
   * Analyze news items for sentiment
   */
  const analyzeNews = useCallback(async (items: NewsItem[]) => {
    if (!enabled || items.length === 0) {
      return;
    }

    setAnalyzing(true);
    setError(null);

    try {
      // Filter items that don't already have sentiment
      const itemsToAnalyze = items.filter(item => !item.sentiment);

      if (itemsToAnalyze.length === 0) {
        // All items already have sentiment
        setAnalyzedNews(items);
        setAnalyzing(false);
        return;
      }

      // Analyze in batches for better performance
      const analyzed = await aiAnalysisService.analyzeBatchSentiment(itemsToAnalyze);

      // Merge with items that already had sentiment
      const itemsWithSentiment = items.filter(item => item.sentiment);
      const allAnalyzed = [...itemsWithSentiment, ...analyzed];

      setAnalyzedNews(allAnalyzed);
      setAnalyzing(false);
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error('Sentiment analysis failed');
      setError(errorObj);
      setAnalyzing(false);
      console.error('useSentimentAnalysis error:', errorObj);

      // Return original news items without sentiment on error
      setAnalyzedNews(items);
    }
  }, [enabled]);

  /**
   * Auto-analyze when newsItems change
   */
  useEffect(() => {
    if (autoAnalyze && newsItems.length > 0) {
      analyzeNews(newsItems);
    }
  }, [newsItems, autoAnalyze, analyzeNews]);

  return {
    analyzedNews,
    analyzing,
    error,
    analyzeNews,
    isAIAvailable
  };
}

/**
 * Hook for analyzing a single text/headline
 */
export function useSingleSentiment(text: string) {
  const [sentiment, setSentiment] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!text) {return;}

    const analyzeSentiment = async () => {
      setAnalyzing(true);
      setError(null);

      try {
        const result = await aiAnalysisService.analyzeSentiment(text);
        setSentiment(result);
        setAnalyzing(false);
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error('Sentiment analysis failed');
        setError(errorObj);
        setAnalyzing(false);
      }
    };

    analyzeSentiment();
  }, [text]);

  return { sentiment, analyzing, error };
}

/**
 * Hook for generating market brief
 */
export function useMarketBrief(marketData: any, refreshInterval?: number) {
  const [brief, setBrief] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const generateBrief = useCallback(async () => {
    if (!marketData) {return;}

    setLoading(true);
    setError(null);

    try {
      const result = await aiAnalysisService.generateMarketBrief(marketData);
      setBrief(result);
      setLoading(false);
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error('Brief generation failed');
      setError(errorObj);
      setLoading(false);
    }
  }, [marketData]);

  useEffect(() => {
    generateBrief();

    if (refreshInterval && refreshInterval > 0) {
      const interval = setInterval(generateBrief, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [generateBrief, refreshInterval]);

  return { brief, loading, error, refresh: generateBrief };
}

/**
 * Hook for generating market DNA
 */
export function useMarketDNA(marketData: any) {
  const [dna, setDNA] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!marketData) {return;}

    const generateDNA = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await aiAnalysisService.generateMarketDNA(marketData);
        setDNA(result);
        setLoading(false);
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error('DNA generation failed');
        setError(errorObj);
        setLoading(false);
      }
    };

    generateDNA();
  }, [marketData]);

  return { dna, loading, error };
}
