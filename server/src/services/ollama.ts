// Ollama AI Service for financial analysis
// Integrates with local Ollama instance for AI-powered market insights

import { config } from '../config/env';
import { cache } from './cache';

interface OllamaGenerateRequest {
  model: string;
  prompt: string;
  stream?: boolean;
  options?: {
    temperature?: number;
    num_predict?: number;
    top_p?: number;
  };
}

interface OllamaGenerateResponse {
  model: string;
  response: string;
  done: boolean;
  total_duration?: number;
  prompt_eval_count?: number;
  eval_count?: number;
}

export interface AIInsight {
  content: string;
  model: string;
  tokens: number;
  durationMs: number;
  cached: boolean;
}

export class OllamaService {
  private baseUrl: string;
  private defaultModel: string;
  private fastModel: string;
  private timeout: number;

  constructor() {
    this.baseUrl = config.ollamaHost || 'http://localhost:11434';
    this.defaultModel = 'qwen2.5:14b';
    this.fastModel = 'llama3.2:3b';
    this.timeout = 60000; // 60 seconds
  }

  /**
   * Check if Ollama is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });
      return response.ok;
    } catch (error) {
      console.error('[Ollama] Connection failed:', error);
      return false;
    }
  }

  /**
   * List available models
   */
  async listModels(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      const data = await response.json() as { models?: Array<{ name: string }> };
      return data.models?.map((m) => m.name) || [];
    } catch (error) {
      console.error('[Ollama] Failed to list models:', error);
      return [];
    }
  }

  /**
   * Generate a response from Ollama
   */
  async generate(
    prompt: string,
    options?: {
      model?: string;
      temperature?: number;
      maxTokens?: number;
      cache?: boolean;
      cacheTtl?: number;
    }
  ): Promise<AIInsight> {
    const model = options?.model || this.defaultModel;
    const cacheKey = `ollama:${model}:${this.hashPrompt(prompt)}`;

    // Check cache first
    if (options?.cache !== false) {
      const cached = cache.get(cacheKey);
      if (cached) {
        console.log(`[Ollama] Cache hit for prompt`);
        return { ...cached as AIInsight, cached: true };
      }
    }

    const startTime = Date.now();

    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          prompt,
          stream: false,
          options: {
            temperature: options?.temperature ?? 0.7,
            num_predict: options?.maxTokens ?? 500,
          },
        } as OllamaGenerateRequest),
        signal: AbortSignal.timeout(this.timeout),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const data = await response.json() as OllamaGenerateResponse;
      const durationMs = Date.now() - startTime;

      const result: AIInsight = {
        content: data.response.trim(),
        model: data.model,
        tokens: data.eval_count || 0,
        durationMs,
        cached: false,
      };

      // Cache the result
      if (options?.cache !== false) {
        cache.set(cacheKey, result, options?.cacheTtl ?? 3600); // Default 1 hour
      }

      console.log(`[Ollama] Generated response in ${durationMs}ms (${result.tokens} tokens)`);
      return result;
    } catch (error) {
      console.error('[Ollama] Generation failed:', error);
      throw error;
    }
  }

  /**
   * Fast sentiment classification using small model
   */
  async classifySentiment(text: string): Promise<{
    sentiment: 'bullish' | 'bearish' | 'neutral';
    confidence: number;
  }> {
    const prompt = `Classify the financial sentiment of this text as exactly one of: bullish, bearish, or neutral.

Text: "${text}"

Respond with ONLY the sentiment word (bullish/bearish/neutral):`;

    try {
      const result = await this.generate(prompt, {
        model: this.fastModel,
        temperature: 0.2,
        maxTokens: 10,
        cacheTtl: 1800, // 30 minutes
      });

      const response = result.content.toLowerCase().trim();
      let sentiment: 'bullish' | 'bearish' | 'neutral' = 'neutral';

      if (response.includes('bullish')) sentiment = 'bullish';
      else if (response.includes('bearish')) sentiment = 'bearish';

      return {
        sentiment,
        confidence: 0.85, // Approximate based on model performance
      };
    } catch (error) {
      console.error('[Ollama] Sentiment classification failed:', error);
      return { sentiment: 'neutral', confidence: 0 };
    }
  }

  /**
   * Generate morning market brief
   */
  async generateMorningBrief(marketData: {
    spx?: { price: number; change: number };
    nasdaq?: { price: number; change: number };
    btc?: { price: number; change: number };
    fearGreed?: number;
    vix?: number;
  }): Promise<string> {
    const prompt = `You are a professional market analyst creating a personalized morning brief.

Market Data:
- S&P 500: ${marketData.spx?.price?.toFixed(2) || 'N/A'} (${marketData.spx?.change?.toFixed(2) || 0}%)
- NASDAQ: ${marketData.nasdaq?.price?.toFixed(2) || 'N/A'} (${marketData.nasdaq?.change?.toFixed(2) || 0}%)
- Bitcoin: $${marketData.btc?.price?.toFixed(0) || 'N/A'} (${marketData.btc?.change?.toFixed(2) || 0}%)
- Fear & Greed Index: ${marketData.fearGreed || 'N/A'}/100
- VIX: ${marketData.vix || 'N/A'}

Generate a 2-3 sentence brief that:
1. Summarizes the market mood
2. Highlights the most important development
3. Suggests what to watch today

Use a conversational, engaging tone. Max 60 words.`;

    try {
      const result = await this.generate(prompt, {
        temperature: 0.7,
        maxTokens: 150,
        cacheTtl: 1800, // 30 minutes
      });
      return result.content;
    } catch (error) {
      console.error('[Ollama] Morning brief generation failed:', error);
      return 'Markets are active today. Monitor key levels and sentiment shifts for trading opportunities.';
    }
  }

  /**
   * Generate market narrative/signal story
   */
  async generateSignalStory(signals: {
    type: string;
    description: string;
    strength: number;
  }[]): Promise<string> {
    const signalsList = signals
      .map((s) => `- ${s.type}: ${s.description} (strength: ${s.strength}/10)`)
      .join('\n');

    const prompt = `You are a storytelling market analyst. Create a compelling narrative about today's market.

Trading Signals:
${signalsList}

Write a 3-4 paragraph story that:
1. Sets up the market "characters" (Bulls, Bears, key players)
2. Describes the current "plot" (market action and dynamics)
3. Presents possible "endings" (scenarios to watch)

Use metaphors, vivid language, and keep it engaging but informative. Max 200 words.`;

    try {
      const result = await this.generate(prompt, {
        temperature: 0.8,
        maxTokens: 400,
        cacheTtl: 900, // 15 minutes
      });
      return result.content;
    } catch (error) {
      console.error('[Ollama] Signal story generation failed:', error);
      return 'Bulls and bears continue their dance across the market landscape. Watch for key support and resistance levels as the story unfolds.';
    }
  }

  /**
   * Generate pattern explanation
   */
  async explainPattern(pattern: {
    name: string;
    timeframe: string;
    accuracy: number;
    status: string;
  }): Promise<string> {
    const prompt = `Explain this trading pattern in simple terms for a beginner trader:

Pattern: ${pattern.name}
Timeframe: ${pattern.timeframe}
Historical Accuracy: ${pattern.accuracy}%
Current Status: ${pattern.status}

Provide:
1. What this pattern means (2 sentences)
2. Why it matters (1 sentence)
3. What to watch for (1 sentence)

Use beginner-friendly language. Max 60 words.`;

    try {
      const result = await this.generate(prompt, {
        temperature: 0.5,
        maxTokens: 120,
        cacheTtl: 86400, // 24 hours (patterns don't change often)
      });
      return result.content;
    } catch (error) {
      console.error('[Ollama] Pattern explanation failed:', error);
      return `The ${pattern.name} pattern suggests potential price movement. Monitor closely and consider your risk management strategy.`;
    }
  }

  /**
   * Analyze news batch for sentiment
   */
  async analyzeBatchSentiment(
    headlines: string[]
  ): Promise<{ headline: string; sentiment: 'bullish' | 'bearish' | 'neutral' }[]> {
    const results = await Promise.all(
      headlines.map(async (headline) => {
        const { sentiment } = await this.classifySentiment(headline);
        return { headline, sentiment };
      })
    );
    return results;
  }

  /**
   * Generate AI coaching tip
   */
  async generateCoachingTip(context: {
    userLevel: 'beginner' | 'intermediate' | 'advanced';
    recentActivity?: string;
    marketCondition?: string;
  }): Promise<string> {
    const prompt = `You are an AI trading coach. Generate a personalized coaching tip for a ${context.userLevel} trader.

${context.recentActivity ? `Recent activity: ${context.recentActivity}` : ''}
${context.marketCondition ? `Current market: ${context.marketCondition}` : ''}

Provide ONE actionable tip that is:
1. Specific to their level
2. Immediately actionable
3. Educational and encouraging

Keep it to 2-3 sentences. Max 50 words.`;

    try {
      const result = await this.generate(prompt, {
        temperature: 0.7,
        maxTokens: 100,
        cacheTtl: 1800, // 30 minutes
      });
      return result.content;
    } catch (error) {
      console.error('[Ollama] Coaching tip generation failed:', error);
      return 'Focus on your process, not just profits. Keep learning and stay disciplined.';
    }
  }

  /**
   * Hash prompt for caching
   */
  private hashPrompt(prompt: string): string {
    let hash = 0;
    for (let i = 0; i < prompt.length; i++) {
      const char = prompt.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }
}

export const ollamaService = new OllamaService();
