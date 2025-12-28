/**
 * useOllamaAI Hook - React hook for AI-powered features
 * Provides easy access to Ollama AI capabilities
 */

import { useState, useEffect, useCallback, useRef } from 'react';

import { aiClient, type AIHealthStatus, type MorningBriefData, type SentimentResult, type CoachingTipData } from '@/services/ai/aiClient';

// ============================================
// AI Health Hook
// ============================================

interface UseAIHealthReturn {
  isAvailable: boolean;
  models: string[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useAIHealth(): UseAIHealthReturn {
  const [status, setStatus] = useState<AIHealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const checkHealth = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const health = await aiClient.checkHealth();
      setStatus(health);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Health check failed'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  return {
    isAvailable: status?.available ?? false,
    models: status?.models ?? [],
    loading,
    error,
    refetch: checkHealth,
  };
}

// ============================================
// Morning Brief Hook
// ============================================

interface UseMorningBriefOptions {
  marketData: {
    spx?: { price: number; change: number };
    nasdaq?: { price: number; change: number };
    btc?: { price: number; change: number };
    fearGreed?: number;
    vix?: number;
  };
  enabled?: boolean;
  refreshInterval?: number; // ms
}

interface UseMorningBriefReturn {
  brief: string;
  generatedAt: string | null;
  isFallback: boolean;
  loading: boolean;
  error: Error | null;
  regenerate: () => Promise<void>;
}

export function useMorningBrief(options: UseMorningBriefOptions): UseMorningBriefReturn {
  const { marketData, enabled = true, refreshInterval = 0 } = options;
  const [data, setData] = useState<MorningBriefData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const marketDataRef = useRef(marketData);

  // Update ref when marketData changes
  useEffect(() => {
    marketDataRef.current = marketData;
  }, [marketData]);

  const generateBrief = useCallback(async () => {
    if (!enabled) {return;}

    try {
      setLoading(true);
      setError(null);
      const result = await aiClient.generateMorningBrief(marketDataRef.current);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to generate brief'));
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  // Initial fetch
  useEffect(() => {
    if (enabled) {
      generateBrief();
    }
  }, [enabled, generateBrief]);

  // Refresh interval
  useEffect(() => {
    if (!enabled || refreshInterval <= 0) {return;}

    const interval = setInterval(generateBrief, refreshInterval);
    return () => clearInterval(interval);
  }, [enabled, refreshInterval, generateBrief]);

  return {
    brief: data?.brief ?? '',
    generatedAt: data?.generatedAt ?? null,
    isFallback: data?.fallback ?? false,
    loading,
    error,
    regenerate: generateBrief,
  };
}

// ============================================
// Sentiment Hook
// ============================================

interface UseSentimentOptions {
  text: string;
  enabled?: boolean;
}

interface UseSentimentReturn {
  sentiment: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  loading: boolean;
  error: Error | null;
  classify: (text: string) => Promise<SentimentResult>;
}

export function useSentiment(options: UseSentimentOptions): UseSentimentReturn {
  const { text, enabled = true } = options;
  const [result, setResult] = useState<SentimentResult>({ sentiment: 'neutral', confidence: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const classify = useCallback(async (inputText: string) => {
    try {
      setLoading(true);
      setError(null);
      const sentiment = await aiClient.classifySentiment(inputText);
      setResult(sentiment);
      return sentiment;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Classification failed'));
      return { sentiment: 'neutral' as const, confidence: 0 };
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (enabled && text) {
      classify(text);
    }
  }, [enabled, text, classify]);

  return {
    sentiment: result.sentiment,
    confidence: result.confidence,
    loading,
    error,
    classify,
  };
}

// ============================================
// Coaching Tip Hook
// ============================================

interface UseCoachingTipOptions {
  userLevel?: 'beginner' | 'intermediate' | 'advanced';
  recentActivity?: string;
  marketCondition?: string;
  enabled?: boolean;
  refreshInterval?: number;
}

interface UseCoachingTipReturn {
  tip: string;
  generatedAt: string | null;
  loading: boolean;
  error: Error | null;
  regenerate: () => Promise<void>;
}

export function useCoachingTip(options: UseCoachingTipOptions = {}): UseCoachingTipReturn {
  const {
    userLevel = 'intermediate',
    recentActivity,
    marketCondition,
    enabled = true,
    refreshInterval = 0,
  } = options;
  const [data, setData] = useState<CoachingTipData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const generateTip = useCallback(async () => {
    if (!enabled) {return;}

    try {
      setLoading(true);
      setError(null);
      const result = await aiClient.getCoachingTip({
        userLevel,
        recentActivity,
        marketCondition,
      });
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to generate tip'));
    } finally {
      setLoading(false);
    }
  }, [enabled, userLevel, recentActivity, marketCondition]);

  useEffect(() => {
    if (enabled) {
      generateTip();
    }
  }, [enabled, generateTip]);

  useEffect(() => {
    if (!enabled || refreshInterval <= 0) {return;}

    const interval = setInterval(generateTip, refreshInterval);
    return () => clearInterval(interval);
  }, [enabled, refreshInterval, generateTip]);

  return {
    tip: data?.tip ?? '',
    generatedAt: data?.generatedAt ?? null,
    loading,
    error,
    regenerate: generateTip,
  };
}

// ============================================
// Pattern Explanation Hook
// ============================================

interface UsePatternExplanationOptions {
  pattern: {
    name: string;
    timeframe: string;
    accuracy: number;
    status: string;
  } | null;
  enabled?: boolean;
}

interface UsePatternExplanationReturn {
  explanation: string;
  loading: boolean;
  error: Error | null;
  explain: (pattern: { name: string; timeframe: string; accuracy: number; status: string }) => Promise<string>;
}

export function usePatternExplanation(options: UsePatternExplanationOptions): UsePatternExplanationReturn {
  const { pattern, enabled = true } = options;
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const explain = useCallback(
    async (p: { name: string; timeframe: string; accuracy: number; status: string }) => {
      try {
        setLoading(true);
        setError(null);
        const result = await aiClient.explainPattern(p);
        setExplanation(result);
        return result;
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Explanation failed'));
        return '';
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (enabled && pattern) {
      explain(pattern);
    }
  }, [enabled, pattern, explain]);

  return {
    explanation,
    loading,
    error,
    explain,
  };
}

// ============================================
// General AI Generation Hook
// ============================================

interface UseAIGenerateOptions {
  prompt: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  enabled?: boolean;
}

interface UseAIGenerateReturn {
  content: string;
  tokens: number;
  durationMs: number;
  cached: boolean;
  loading: boolean;
  error: Error | null;
  generate: (prompt: string) => Promise<string | null>;
}

export function useAIGenerate(options: UseAIGenerateOptions): UseAIGenerateReturn {
  const { prompt, model, temperature, maxTokens, enabled = true } = options;
  const [content, setContent] = useState('');
  const [tokens, setTokens] = useState(0);
  const [durationMs, setDurationMs] = useState(0);
  const [cached, setCached] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const generate = useCallback(
    async (inputPrompt: string) => {
      try {
        setLoading(true);
        setError(null);
        const result = await aiClient.generate(inputPrompt, { model, temperature, maxTokens });
        if (result) {
          setContent(result.content);
          setTokens(result.tokens);
          setDurationMs(result.durationMs);
          setCached(result.cached);
          return result.content;
        }
        return null;
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Generation failed'));
        return null;
      } finally {
        setLoading(false);
      }
    },
    [model, temperature, maxTokens]
  );

  useEffect(() => {
    if (enabled && prompt) {
      generate(prompt);
    }
  }, [enabled, prompt, generate]);

  return {
    content,
    tokens,
    durationMs,
    cached,
    loading,
    error,
    generate,
  };
}
