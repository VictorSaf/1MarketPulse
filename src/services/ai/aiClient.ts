/**
 * AI Client - Frontend service for Ollama-powered AI features
 * Communicates with backend AI endpoints
 */

import { BACKEND_CONFIG } from '@/config/backend.config';

export interface AIInsight {
  content: string;
  model: string;
  tokens: number;
  durationMs: number;
  cached: boolean;
}

export interface SentimentResult {
  sentiment: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
}

export interface MorningBriefData {
  brief: string;
  generatedAt: string;
  fallback?: boolean;
}

export interface SignalStoryData {
  story: string;
  generatedAt: string;
  fallback?: boolean;
}

export interface CoachingTipData {
  tip: string;
  generatedAt: string;
  fallback?: boolean;
}

export interface AIHealthStatus {
  available: boolean;
  models: string[];
  defaultModel: string;
  fastModel: string;
}

class AIClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${BACKEND_CONFIG.baseUrl}/api/ai`;
  }

  /**
   * Check if AI service is available
   */
  async checkHealth(): Promise<AIHealthStatus> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('[AIClient] Health check failed:', error);
      return {
        available: false,
        models: [],
        defaultModel: '',
        fastModel: '',
      };
    }
  }

  /**
   * Classify sentiment of text
   */
  async classifySentiment(text: string): Promise<SentimentResult> {
    try {
      const response = await fetch(`${this.baseUrl}/sentiment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('[AIClient] Sentiment classification failed:', error);
      return { sentiment: 'neutral', confidence: 0 };
    }
  }

  /**
   * Batch sentiment analysis for multiple headlines
   */
  async batchSentiment(
    headlines: string[]
  ): Promise<{ headline: string; sentiment: 'bullish' | 'bearish' | 'neutral' }[]> {
    try {
      const response = await fetch(`${this.baseUrl}/sentiment/batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ headlines }),
      });

      const data = await response.json();
      return data.data?.results || [];
    } catch (error) {
      console.error('[AIClient] Batch sentiment failed:', error);
      return headlines.map((headline) => ({ headline, sentiment: 'neutral' as const }));
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
  }): Promise<MorningBriefData> {
    try {
      const response = await fetch(`${this.baseUrl}/morning-brief`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(marketData),
      });

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('[AIClient] Morning brief failed:', error);
      return {
        brief: 'Markets are active today. Watch for key developments and sentiment shifts.',
        generatedAt: new Date().toISOString(),
        fallback: true,
      };
    }
  }

  /**
   * Generate signal story narrative
   */
  async generateSignalStory(
    signals: { type: string; description: string; strength: number }[]
  ): Promise<SignalStoryData> {
    try {
      const response = await fetch(`${this.baseUrl}/signal-story`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signals }),
      });

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('[AIClient] Signal story failed:', error);
      return {
        story:
          'Bulls and bears continue their dance across the markets. Watch for key support and resistance levels.',
        generatedAt: new Date().toISOString(),
        fallback: true,
      };
    }
  }

  /**
   * Get pattern explanation
   */
  async explainPattern(pattern: {
    name: string;
    timeframe: string;
    accuracy: number;
    status: string;
  }): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/explain-pattern`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pattern),
      });

      const data = await response.json();
      return data.data?.explanation || `The ${pattern.name} suggests potential price movement.`;
    } catch (error) {
      console.error('[AIClient] Pattern explanation failed:', error);
      return `The ${pattern.name} suggests potential price movement. Monitor closely.`;
    }
  }

  /**
   * Get personalized coaching tip
   */
  async getCoachingTip(context: {
    userLevel?: 'beginner' | 'intermediate' | 'advanced';
    recentActivity?: string;
    marketCondition?: string;
  }): Promise<CoachingTipData> {
    try {
      const response = await fetch(`${this.baseUrl}/coaching-tip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(context),
      });

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('[AIClient] Coaching tip failed:', error);
      return {
        tip: 'Focus on your process, not just profits. Keep learning and stay disciplined.',
        generatedAt: new Date().toISOString(),
        fallback: true,
      };
    }
  }

  /**
   * General text generation
   */
  async generate(
    prompt: string,
    options?: {
      model?: string;
      temperature?: number;
      maxTokens?: number;
    }
  ): Promise<AIInsight | null> {
    try {
      const response = await fetch(`${this.baseUrl}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, ...options }),
      });

      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error('[AIClient] Generation failed:', error);
      return null;
    }
  }
}

export const aiClient = new AIClient();
