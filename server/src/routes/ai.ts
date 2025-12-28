// AI Routes - Ollama-powered endpoints for market analysis
import { Hono } from 'hono';
import { ollamaService } from '../services/ollama';

const ai = new Hono();

/**
 * GET /ai/health
 * Check if Ollama is available
 */
ai.get('/health', async (c) => {
  const available = await ollamaService.isAvailable();
  const models = available ? await ollamaService.listModels() : [];

  return c.json({
    success: true,
    data: {
      available,
      models: models.slice(0, 10), // Limit to first 10 models
      defaultModel: 'qwen2.5:14b',
      fastModel: 'llama3.2:3b',
    },
  });
});

/**
 * GET /ai/models
 * List available Ollama models
 */
ai.get('/models', async (c) => {
  try {
    const models = await ollamaService.listModels();
    return c.json({
      success: true,
      data: { models },
    });
  } catch (error) {
    return c.json(
      {
        success: false,
        error: 'Failed to list models',
      },
      500
    );
  }
});

/**
 * POST /ai/sentiment
 * Classify sentiment of text
 */
ai.post('/sentiment', async (c) => {
  try {
    const { text } = await c.req.json();

    if (!text) {
      return c.json({ success: false, error: 'Text is required' }, 400);
    }

    const result = await ollamaService.classifySentiment(text);

    return c.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('[AI] Sentiment analysis failed:', error);
    return c.json(
      {
        success: false,
        error: 'Sentiment analysis failed',
        data: { sentiment: 'neutral', confidence: 0 },
      },
      500
    );
  }
});

/**
 * POST /ai/sentiment/batch
 * Classify sentiment for multiple headlines
 */
ai.post('/sentiment/batch', async (c) => {
  try {
    const { headlines } = await c.req.json();

    if (!headlines || !Array.isArray(headlines)) {
      return c.json({ success: false, error: 'Headlines array is required' }, 400);
    }

    // Limit to 20 headlines at a time
    const limitedHeadlines = headlines.slice(0, 20);
    const results = await ollamaService.analyzeBatchSentiment(limitedHeadlines);

    return c.json({
      success: true,
      data: { results },
    });
  } catch (error) {
    console.error('[AI] Batch sentiment failed:', error);
    return c.json(
      {
        success: false,
        error: 'Batch sentiment analysis failed',
      },
      500
    );
  }
});

/**
 * POST /ai/morning-brief
 * Generate AI-powered morning market brief
 */
ai.post('/morning-brief', async (c) => {
  try {
    const marketData = await c.req.json();

    const brief = await ollamaService.generateMorningBrief(marketData);

    return c.json({
      success: true,
      data: {
        brief,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('[AI] Morning brief failed:', error);
    return c.json({
      success: true,
      data: {
        brief:
          'Markets are active today. Watch key support and resistance levels for potential opportunities.',
        generatedAt: new Date().toISOString(),
        fallback: true,
      },
    });
  }
});

/**
 * POST /ai/signal-story
 * Generate narrative market story from signals
 */
ai.post('/signal-story', async (c) => {
  try {
    const { signals } = await c.req.json();

    if (!signals || !Array.isArray(signals)) {
      return c.json({ success: false, error: 'Signals array is required' }, 400);
    }

    const story = await ollamaService.generateSignalStory(signals);

    return c.json({
      success: true,
      data: {
        story,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('[AI] Signal story failed:', error);
    return c.json({
      success: true,
      data: {
        story:
          'Bulls and bears continue their dance across the markets. Watch for key levels and momentum shifts.',
        generatedAt: new Date().toISOString(),
        fallback: true,
      },
    });
  }
});

/**
 * POST /ai/explain-pattern
 * Generate explanation for a trading pattern
 */
ai.post('/explain-pattern', async (c) => {
  try {
    const pattern = await c.req.json();

    if (!pattern || !pattern.name) {
      return c.json({ success: false, error: 'Pattern object with name is required' }, 400);
    }

    const explanation = await ollamaService.explainPattern(pattern);

    return c.json({
      success: true,
      data: {
        explanation,
        pattern: pattern.name,
      },
    });
  } catch (error) {
    console.error('[AI] Pattern explanation failed:', error);
    return c.json({
      success: true,
      data: {
        explanation: `The ${
          (await c.req.json()).name || 'pattern'
        } suggests potential price movement. Monitor closely.`,
        fallback: true,
      },
    });
  }
});

/**
 * POST /ai/coaching-tip
 * Generate personalized trading coaching tip
 */
ai.post('/coaching-tip', async (c) => {
  try {
    const context = await c.req.json();

    const tip = await ollamaService.generateCoachingTip({
      userLevel: context.userLevel || 'intermediate',
      recentActivity: context.recentActivity,
      marketCondition: context.marketCondition,
    });

    return c.json({
      success: true,
      data: {
        tip,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('[AI] Coaching tip failed:', error);
    return c.json({
      success: true,
      data: {
        tip: 'Focus on your process, not just profits. Keep learning and stay disciplined.',
        generatedAt: new Date().toISOString(),
        fallback: true,
      },
    });
  }
});

/**
 * POST /ai/generate
 * General-purpose text generation
 */
ai.post('/generate', async (c) => {
  try {
    const { prompt, model, temperature, maxTokens } = await c.req.json();

    if (!prompt) {
      return c.json({ success: false, error: 'Prompt is required' }, 400);
    }

    const result = await ollamaService.generate(prompt, {
      model,
      temperature,
      maxTokens,
    });

    return c.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('[AI] Generation failed:', error);
    return c.json(
      {
        success: false,
        error: 'Text generation failed',
      },
      500
    );
  }
});

export default ai;
