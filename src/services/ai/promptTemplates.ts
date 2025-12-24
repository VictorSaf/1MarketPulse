/**
 * Prompt Templates for Ollama AI Analysis
 * Optimized prompts for financial sentiment and market analysis
 */

export interface SentimentAnalysisResult {
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number; // 0-1
  reasoning: string;
}

export interface MarketBriefResult {
  brief: string;
  key_points: string[];
  outlook: 'bullish' | 'bearish' | 'neutral';
}

export interface MarketDNAResult {
  dna: string; // 4-letter code (A, T, G, C)
  appetite: 'high' | 'medium' | 'low';
  trend: 'bullish' | 'bearish' | 'neutral';
  gravity: 'strong' | 'weak';
  catalyst: 'high' | 'medium' | 'low';
  explanation: string;
}

/**
 * Financial sentiment analysis prompt
 * Analyzes news headlines for bullish/bearish sentiment
 */
export function sentimentAnalysisPrompt(text: string): string {
  return `You are a financial sentiment analysis expert specializing in market psychology and news interpretation.

Analyze the following financial news headline or text and determine its sentiment impact on the broader market.

Text: "${text}"

Respond ONLY with valid JSON in this exact format:
{
  "sentiment": "positive|negative|neutral",
  "confidence": 0.85,
  "reasoning": "Brief 1-2 sentence explanation"
}

Classification Rules:
- "positive": Bullish news that should drive markets UP (earnings beats, rate cuts, positive economic data, strong growth, acquisitions, innovations)
- "negative": Bearish news that should drive markets DOWN (earnings misses, rate hikes, recession fears, weak data, layoffs, regulatory issues)
- "neutral": No clear directional impact on markets OR mixed signals

Confidence Rules:
- 0.9-1.0: Very clear sentiment with strong market implications
- 0.7-0.9: Clear sentiment with moderate implications
- 0.5-0.7: Weak or mixed signals
- Below 0.5: Highly ambiguous

Response (JSON only):`;
}

/**
 * Market brief generation prompt
 * Creates concise daily market summaries
 */
export function marketBriefPrompt(marketData: any): string {
  return `You are a professional market analyst creating a daily market brief for retail investors.

Market Data:
${JSON.stringify(marketData, null, 2)}

Create a concise market brief (3-4 sentences) that:
1. Summarizes the overall market sentiment and key moves
2. Highlights the main drivers (earnings, economic data, geopolitical events)
3. Mentions key sectors or stocks moving the market
4. Provides a forward-looking outlook for the next session

Tone: Professional but accessible, avoid jargon, be specific with numbers.

Respond ONLY with valid JSON in this format:
{
  "brief": "Full brief text here...",
  "key_points": ["Point 1", "Point 2", "Point 3"],
  "outlook": "bullish|bearish|neutral"
}

Response (JSON only):`;
}

/**
 * Market DNA generation prompt
 * Creates DNA-style market profile using A/T/G/C codes
 */
export function marketDNAPrompt(marketData: any): string {
  return `You are a market analyst creating a DNA-style profile for today's trading day.

Market Data:
${JSON.stringify(marketData, null, 2)}

Analyze this data and create a 4-letter DNA code where:
- A (Appetite): Risk appetite level
  - "A" if high risk-on sentiment (VIX < 15, strong breadth, greed)
  - "T" if low risk-off sentiment (VIX > 20, weak breadth, fear)

- T (Trend): Market direction
  - "G" if strong bullish trend (major indices up, momentum positive)
  - "C" if bearish trend (major indices down, momentum negative)

- G (Gravity): Mean reversion pull
  - "A" if strong gravity (overbought/oversold, extreme sentiment)
  - "T" if weak gravity (balanced, normal conditions)

- C (Catalyst): News/event impact
  - "G" if major catalysts present (earnings, Fed, geopolitics)
  - "C" if low catalyst activity (quiet news day)

Example DNA codes:
- "AGAG" = High risk appetite + Bullish trend + Strong mean reversion + Major catalysts
- "TCTC" = Low risk appetite + Bearish trend + Weak reversion + Low catalysts

Respond ONLY with valid JSON in this format:
{
  "dna": "XXXX",
  "appetite": "high|medium|low",
  "trend": "bullish|bearish|neutral",
  "gravity": "strong|weak",
  "catalyst": "high|medium|low",
  "explanation": "Brief explanation of the DNA code"
}

Response (JSON only):`;
}

/**
 * Pattern matching prompt
 * Finds similar historical market days
 */
export function patternMatchingPrompt(currentDNA: string, historicalDNAs: any[]): string {
  return `You are a market pattern recognition expert.

Current Market DNA: ${currentDNA}

Historical DNA Sequences:
${JSON.stringify(historicalDNAs, null, 2)}

Find the 3 most similar historical trading days based on DNA matching.

Respond ONLY with valid JSON in this format:
{
  "matches": [
    {
      "date": "YYYY-MM-DD",
      "dna": "XXXX",
      "similarity": 0.95,
      "outcome": "Brief description of what happened next"
    }
  ],
  "pattern_name": "Descriptive name for this pattern",
  "confidence": 0.85
}

Response (JSON only):`;
}

/**
 * Real-time event analysis prompt
 * Analyzes breaking market events
 */
export function eventAnalysisPrompt(event: string): string {
  return `You are a real-time market analyst responding to breaking news.

BREAKING EVENT: ${event}

Provide immediate analysis covering:
1. What this means for markets (bullish/bearish/neutral)
2. Which sectors/stocks are impacted (winners/losers)
3. Expected market reaction and key levels to watch

Be concise (2-3 sentences total), specific, and actionable.

Respond ONLY with valid JSON in this format:
{
  "impact": "bullish|bearish|neutral",
  "analysis": "Your 2-3 sentence analysis",
  "affected_sectors": ["Sector 1", "Sector 2"],
  "key_levels": ["Level description 1", "Level description 2"]
}

Response (JSON only):`;
}

/**
 * Risk assessment prompt
 * Evaluates current market risks
 */
export function riskAssessmentPrompt(marketData: any): string {
  return `You are a risk management specialist analyzing market conditions.

Market Data:
${JSON.stringify(marketData, null, 2)}

Assess the current risk level and identify key risks.

Respond ONLY with valid JSON in this format:
{
  "risk_level": "low|medium|high|extreme",
  "risk_score": 45,
  "top_risks": [
    {
      "risk": "Risk description",
      "probability": "low|medium|high",
      "impact": "low|medium|high"
    }
  ],
  "recommendation": "Brief risk management recommendation"
}

Response (JSON only):`;
}

/**
 * Helper function to extract JSON from Ollama response
 * Sometimes Ollama includes extra text before/after JSON
 */
export function extractJSON<T>(response: string): T {
  // Try direct parse first
  try {
    return JSON.parse(response);
  } catch {
    // Try to find JSON in the response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('No valid JSON found in response');
  }
}
