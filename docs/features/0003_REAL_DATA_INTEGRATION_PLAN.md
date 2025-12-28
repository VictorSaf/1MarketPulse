# Feature Plan: Real Data Integration - Replace All Mock Data

**Plan ID**: 0003
**Created**: 2025-12-24
**Status**: Ready for Implementation
**Priority**: CRITICAL
**Estimated Effort**: 6-8 weeks
**Dependencies**: Ollama installation, API key acquisition

---

## Executive Summary

This comprehensive plan details the complete replacement of all mock/demo data in the 1MarketPulse platform with real, live financial data. The implementation uses **100% FREE** data sources combined with local AI analysis powered by Ollama open-source models. This approach ensures zero ongoing costs while providing production-quality market intelligence.

**Key Strategy**: API-first approach with web scraping fallbacks, processed through local Ollama AI agents for sentiment analysis, pattern recognition, and market summaries.

---

## Table of Contents

1. [Data Sources Research](#part-1-data-sources-research)
2. [Ollama AI Analysis Setup](#part-2-ollama-ai-analysis-setup)
3. [Architecture & Implementation](#part-3-architecture--implementation)
4. [Implementation Roadmap](#implementation-roadmap)
5. [Code Examples](#code-examples)
6. [Testing Strategy](#testing-strategy)

---

## Part 1: Data Sources Research

### 1.1 Stock Market Data

#### Recommended: Finnhub (Primary)
**URL**: https://finnhub.io/
**Free Tier**: 60 calls/minute, 15-minute delayed real-time data
**Coverage**: US & International stocks, forex, crypto

**Pros**:
- Most generous free tier (60 calls/min)
- Excellent documentation
- WebSocket support for streaming
- Good international market coverage
- Reliable uptime

**Cons**:
- 15-minute delay on free tier
- Limited historical data (few years only)

**API Endpoint Example**:
```bash
# Quote endpoint
GET https://finnhub.io/api/v1/quote?symbol=AAPL&token=YOUR_API_KEY

# Response
{
  "c": 175.43,  // Current price
  "d": 2.13,    // Change
  "dp": 1.23,   // Percent change
  "h": 176.82,  // High
  "l": 174.21,  // Low
  "o": 174.55,  // Open
  "pc": 173.30, // Previous close
  "t": 1703260800
}
```

#### Backup: Alpha Vantage
**URL**: https://www.alphavantage.co/
**Free Tier**: 25 calls/day, 5 calls/minute
**Coverage**: 20+ years historical data

**Pros**:
- Extensive historical data
- 50+ technical indicators
- Good for backtesting

**Cons**:
- Very restrictive rate limits (25/day)
- Steep jump to paid ($49.99/month)

**Use Case**: Historical data for DNA matching, pattern archaeology

#### Alternative: Twelve Data
**URL**: https://twelvedata.com/
**Free Tier**: 800 calls/day
**Coverage**: Stocks, forex, crypto, ETFs

**Pros**:
- 99.95% uptime guarantee
- Usable free tier for development
- Good documentation

**Rate Limit Strategy**: Use for secondary data when Finnhub limits are hit

#### Web Scraping Fallback: Yahoo Finance
**URL**: https://finance.yahoo.com/
**Method**: Python with yfinance library or Playwright scraping
**Cost**: Free (unofficial)

**Implementation**:
```python
import yfinance as yf

# Simple approach using yfinance wrapper
ticker = yf.Ticker("AAPL")
data = ticker.history(period="1d")
info = ticker.info

print(f"Price: ${info['currentPrice']}")
print(f"Change: {info['regularMarketChangePercent']}%")
```

**Important**: Yahoo Finance API was discontinued in 2017. All wrappers rely on reverse-engineering and may break. Use as fallback only.

---

### 1.2 Cryptocurrency Data

#### Recommended: CoinGecko (Primary)
**URL**: https://www.coingecko.com/en/api
**Free Tier**: 30 calls/minute, 10,000 calls/month
**Coverage**: 18,000+ cryptocurrencies, 1,000+ exchanges

**Pros**:
- Comprehensive coverage (18K+ coins)
- 10+ years historical data
- Multi-chain support (200+ networks)
- DeFi and NFT data included
- Trusted by Metamask, Coinbase, Etherscan

**Cons**:
- 30 calls/minute limit
- Free tier has monthly cap (10K calls)

**API Endpoint Examples**:
```bash
# Simple price endpoint
GET https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true

# Response
{
  "bitcoin": {
    "usd": 43250.00,
    "usd_24h_change": 2.34
  },
  "ethereum": {
    "usd": 2280.50,
    "usd_24h_change": -1.12
  }
}

# Market data endpoint
GET https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10

# Historical data
GET https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=7
```

#### Alternative: Binance Public API
**URL**: https://binance-docs.github.io/apidocs/
**Free Tier**: No rate limits on public endpoints
**Coverage**: 1,000+ cryptocurrencies on Binance

**Pros**:
- No rate limits on public data
- Real-time, low latency
- Professional-grade infrastructure
- Best for trading applications

**Cons**:
- Limited to Binance ecosystem only
- No cross-exchange data

**Use Case**: Real-time crypto price updates (refresh every 5-10 seconds)

**API Example**:
```bash
# 24hr ticker price change
GET https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT

# Response
{
  "symbol": "BTCUSDT",
  "priceChange": "1200.00",
  "priceChangePercent": "2.85",
  "lastPrice": "43250.00",
  "volume": "25000.50",
  "quoteVolume": "1081271375.00"
}
```

#### Backup: CoinCap
**URL**: https://docs.coincap.io/
**Free Tier**: Unlimited requests
**Coverage**: Top cryptocurrencies

**Use Case**: Fallback when CoinGecko rate limits are hit

---

### 1.3 Economic News Feeds

#### Recommended: Finnhub News (Primary)
**URL**: https://finnhub.io/docs/api/market-news
**Free Tier**: Included in 60 calls/minute
**Coverage**: Company news, market news, press releases

**API Example**:
```bash
# Market news
GET https://finnhub.io/api/v1/news?category=general&token=YOUR_API_KEY

# Company news
GET https://finnhub.io/api/v1/company-news?symbol=AAPL&from=2025-12-20&to=2025-12-24&token=YOUR_API_KEY

# Response
[
  {
    "category": "company news",
    "datetime": 1703260800,
    "headline": "Apple Announces New Product Line",
    "id": 123456,
    "image": "https://...",
    "source": "Reuters",
    "summary": "Apple Inc. announced...",
    "url": "https://..."
  }
]
```

#### Alternative: Marketaux
**URL**: https://www.marketaux.com/
**Free Tier**: Limited requests
**Coverage**: Financial and stock market news

**Pros**:
- Specifically designed for financial news
- JSON format
- Good categorization

#### RSS Feed Aggregation (Backup)
**Sources**:
- Financial Times RSS: https://www.ft.com/rss/home
- NASDAQ RSS: https://www.nasdaq.com/feed/nasdaq-original/rss.xml
- Reuters Business: http://feeds.reuters.com/reuters/businessNews
- Bloomberg: https://www.bloomberg.com/feed/

**Implementation**:
```python
import feedparser

# Parse RSS feed
feed = feedparser.parse('https://www.ft.com/rss/home')

for entry in feed.entries[:10]:
    print(f"Title: {entry.title}")
    print(f"Published: {entry.published}")
    print(f"Link: {entry.link}")
    print("---")
```

**Sentiment Analysis**: Process through Ollama FinBERT model (see Part 2)

---

### 1.4 Economic Calendar Events

#### Recommended: Finnhub Economic Calendar
**URL**: https://finnhub.io/docs/api/economic-calendar
**Free Tier**: Included in 60 calls/minute
**Coverage**: Global economic events

**API Example**:
```bash
GET https://finnhub.io/api/v1/calendar/economic?token=YOUR_API_KEY

# Response
{
  "economicCalendar": [
    {
      "event": "Non-Farm Payrolls",
      "time": "2025-12-24T13:30:00Z",
      "country": "US",
      "actual": null,
      "estimate": "200K",
      "previous": "195K",
      "impact": "high"
    }
  ]
}
```

#### Alternative: JBlanked Economic Calendar API
**URL**: Free API aggregating MQL5 and Forex Factory data
**Rate Limit**: 1 request/second
**Format**: JSON with event name, currency, date, actual, forecast, previous

**Pros**:
- Free and dedicated to economic calendar
- Python and MQL libraries available
- Good for forex events

**Cons**:
- Stricter rate limiting (1/second)
- Less reliable than official sources

#### Web Scraping: Forex Factory
**URL**: https://www.forexfactory.com/calendar
**Method**: Unofficial scraper from GitHub

**Note**: No official API. Use scrapers cautiously as they may break.

**Recommended Approach**: Use Finnhub as primary, fallback to cached data

---

### 1.5 Market Sentiment / Fear & Greed Index

#### Recommended: CNN Fear & Greed Index (Direct Access)
**URL**: `https://production.dataviz.cnn.io/index/fearandgreed/graphdata/`
**Method**: Direct JSON endpoint (unofficial but stable)
**Cost**: Free
**Update Frequency**: Daily

**Implementation**:
```javascript
// Fetch current Fear & Greed Index
async function fetchFearGreedIndex() {
  const response = await fetch(
    'https://production.dataviz.cnn.io/index/fearandgreed/graphdata/'
  );
  const data = await response.json();

  return {
    score: data.fear_and_greed.score,
    rating: data.fear_and_greed.rating, // "Greed", "Fear", etc.
    timestamp: data.fear_and_greed.timestamp,
    components: {
      marketMomentum: data.market_momentum_sp500.score,
      stockPriceStrength: data.stock_price_strength.score,
      stockPriceBreadth: data.stock_price_breadth.score,
      putCallOptions: data.put_call_options.score,
      marketVolatility: data.market_volatility_vix.score,
      safeHavenDemand: data.safe_haven_demand.score,
      junkBondDemand: data.junk_bond_demand.score
    }
  };
}
```

**Historical Data**:
```javascript
// Get historical data from specific date
const startDate = '2025-01-01'; // YYYY-MM-DD
const url = `https://production.dataviz.cnn.io/index/fearandgreed/graphdata/${startDate}`;
```

#### Alternative: RapidAPI CNN Fear & Greed Index
**URL**: https://rapidapi.com/dataapi/api/cnn-fear-and-greed-index
**Cost**: Free tier available
**Features**: Real-time and historical data

**Use Case**: If direct endpoint becomes unreliable

#### Crypto Fear & Greed Index
**URL**: CoinMarketCap API
**Endpoint**: Available through CMC API (free)

**Implementation**: Similar to stock index, but crypto-specific

---

### 1.6 Data Source Comparison Matrix

| Data Type | Primary Source | Backup Source | Rate Limit | Refresh Interval |
|-----------|---------------|---------------|------------|------------------|
| Stock Prices | Finnhub | Alpha Vantage | 60/min | 15 seconds |
| Crypto Prices | CoinGecko | Binance | 30/min | 10 seconds |
| Economic News | Finnhub News | RSS Feeds | 60/min | 5 minutes |
| News Sentiment | Ollama FinBERT | N/A | Local | On-demand |
| Economic Calendar | Finnhub | JBlanked API | 60/min | 1 hour |
| Fear & Greed | CNN Direct | RapidAPI | No limit | 24 hours |
| Market Summaries | Ollama Qwen3 | N/A | Local | 15 minutes |

---

## Part 2: Ollama AI Analysis Setup

### 2.1 Ollama Installation

#### macOS Installation
```bash
# Install via Homebrew (recommended)
brew install ollama

# OR download direct installer
curl -fsSL https://ollama.com/install.sh | sh

# Start Ollama service
ollama serve
```

#### Linux Installation
```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Set up as systemd service (automatic)
# Ollama will run on http://localhost:11434

# Configure environment variables (optional)
export OLLAMA_HOST=0.0.0.0:11434
export OLLAMA_MODELS=/path/to/models
```

#### Windows Installation
```bash
# Install WSL2 first
wsl --install

# Then follow Linux instructions inside WSL
```

#### Verify Installation
```bash
# Check Ollama is running
curl http://localhost:11434/api/tags

# Should return list of installed models (empty initially)
```

---

### 2.2 Recommended Ollama Models for Financial Analysis

#### Model Selection Matrix

| Use Case | Model | Size | RAM Required | Reasoning |
|----------|-------|------|--------------|-----------|
| Financial Analysis | qwen2.5:14b | 14B | 16GB | Best math/reasoning |
| Sentiment Analysis | llama3.2:3b | 3B | 4GB | Fast, good for NLP |
| Pattern Recognition | qwen2.5:32b | 32B | 32GB | Deep analysis |
| Market Summaries | mistral:7b | 7B | 8GB | Fast, concise |
| Code Generation | qwen2.5-coder:14b | 14B | 16GB | Data pipelines |
| Embeddings | nomic-embed-text | N/A | 2GB | Semantic search |

---

### 2.3 Model Installation Commands

#### Essential Models (Install These First)
```bash
# Primary financial analysis model - BEST for reasoning
ollama pull qwen2.5:14b

# Fast sentiment analysis - lightweight
ollama pull llama3.2:3b

# General purpose - good balance
ollama pull mistral:7b

# Embeddings for pattern matching
ollama pull nomic-embed-text
```

#### Advanced Models (Install If You Have Resources)
```bash
# Deep reasoning for complex analysis (32GB RAM required)
ollama pull qwen2.5:32b

# Advanced coding for data pipelines
ollama pull qwen2.5-coder:14b

# Latest reasoning model (14B, powerful)
ollama pull deepseek-r1:8b

# Fast inference for batch processing
ollama pull phi4:14b
```

#### Model Size & Performance Reference
```
Lightweight (4-8GB RAM):
- llama3.2:3b      → Fast sentiment, summaries
- mistral:7b       → General tasks
- phi4:14b         → Balanced reasoning

Medium (16GB RAM):
- qwen2.5:14b      → RECOMMENDED for financial analysis
- qwen2.5-coder:14b → Data pipeline generation
- llama3.1:8b      → General analysis

Heavy (32GB+ RAM):
- qwen2.5:32b      → Deep pattern analysis
- qwen2.5:72b      → Enterprise-grade (64GB+ RAM)
- llama3.3:70b     → Maximum reasoning (64GB+ RAM)
```

---

### 2.4 Sentiment Analysis with Ollama

#### Approach 1: FinBERT-Style Prompting with Llama/Qwen

While Ollama doesn't directly run FinBERT (which is a BERT model from Hugging Face), we can achieve similar results using prompt engineering with general LLMs.

**Implementation**:
```python
import requests
import json

def analyze_sentiment_ollama(news_text):
    """
    Analyze financial news sentiment using Ollama
    Returns: 'positive', 'negative', or 'neutral' with confidence
    """
    prompt = f"""You are a financial sentiment analysis expert. Analyze the following financial news headline and determine if it's POSITIVE, NEGATIVE, or NEUTRAL for the stock market.

News: "{news_text}"

Respond ONLY with a JSON object in this exact format:
{{"sentiment": "positive|negative|neutral", "confidence": 0.85, "reasoning": "brief explanation"}}

Rules:
- positive: Good news for markets/stocks (earnings beat, rate cuts, positive guidance)
- negative: Bad news for markets/stocks (earnings miss, rate hikes, recession fears)
- neutral: No clear market impact

Response:"""

    response = requests.post('http://localhost:11434/api/generate', json={
        "model": "llama3.2:3b",  # Fast model for sentiment
        "prompt": prompt,
        "stream": False,
        "temperature": 0.1,  # Low temp for consistent classification
        "format": "json"
    })

    result = response.json()
    return json.loads(result['response'])

# Example usage
news = "Apple reports record Q4 earnings, beating analyst expectations by 15%"
sentiment = analyze_sentiment_ollama(news)
print(sentiment)
# Output: {"sentiment": "positive", "confidence": 0.92, "reasoning": "Earnings beat is bullish"}
```

#### Approach 2: Batch Sentiment Analysis
```python
def batch_sentiment_analysis(news_list):
    """Process multiple news items efficiently"""
    results = []

    for news_item in news_list:
        sentiment = analyze_sentiment_ollama(news_item['title'])
        results.append({
            **news_item,
            'ai_sentiment': sentiment['sentiment'],
            'confidence': sentiment['confidence'],
            'reasoning': sentiment['reasoning']
        })

    return results
```

#### Alternative: Use FinBERT via Hugging Face (Not Ollama)
```python
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

# Load FinBERT model (separate from Ollama)
tokenizer = AutoTokenizer.from_pretrained("ProsusAI/finbert")
model = AutoModelForSequenceClassification.from_pretrained("ProsusAI/finbert")

def analyze_with_finbert(text):
    inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True)
    outputs = model(**inputs)
    predictions = torch.nn.functional.softmax(outputs.logits, dim=-1)

    labels = ['positive', 'negative', 'neutral']
    scores = predictions[0].tolist()

    return {
        'sentiment': labels[scores.index(max(scores))],
        'confidence': max(scores),
        'scores': dict(zip(labels, scores))
    }
```

**Note**: FinBERT is more accurate for financial sentiment but requires separate setup. Ollama LLMs are good enough for most use cases and run locally.

---

### 2.5 Pattern Recognition with Ollama

#### DNA Sequence Matching
```python
def generate_market_dna(market_data):
    """
    Use Qwen2.5 to analyze market data and generate DNA sequence
    """
    prompt = f"""Analyze this market data and create a DNA-style profile:

Market Data:
- S&P 500: {market_data['sp500']['change']}%
- VIX: {market_data['vix']}
- Volume vs Avg: {market_data['volume_ratio']}
- Sector Leaders: {market_data['sector_leaders']}
- News Sentiment: {market_data['news_sentiment']}

Create a 4-letter DNA code (A, T, G, C) where:
- A (Appetite): Risk appetite (A=high, T=low)
- T (Trend): Market direction (G=up, C=down)
- G (Gravity): Mean reversion pull
- C (Catalyst): News/event impact

Return JSON: {{"dna": "ATGC", "appetite": "high", "trend": "bullish", "gravity": "weak", "catalyst": "strong", "explanation": "..."}}"""

    response = requests.post('http://localhost:11434/api/generate', json={
        "model": "qwen2.5:14b",
        "prompt": prompt,
        "stream": False,
        "format": "json"
    })

    return json.loads(response.json()['response'])
```

#### Historical Pattern Matching
```python
def find_similar_patterns(current_dna, historical_database):
    """
    Use embeddings to find similar historical market patterns
    """
    # Generate embedding for current market state
    current_embedding = requests.post('http://localhost:11434/api/embeddings', json={
        "model": "nomic-embed-text",
        "prompt": f"Market DNA: {current_dna['dna']}, {current_dna['explanation']}"
    }).json()['embedding']

    # Compare with historical patterns using cosine similarity
    # (Implementation would use vector database like ChromaDB or FAISS)

    return similar_historical_days
```

---

### 2.6 Market Summary Generation

#### Daily Market Brief
```python
def generate_daily_brief(market_data, news, calendar_events):
    """
    Generate AI-powered market brief using Mistral (fast)
    """
    prompt = f"""You are a professional market analyst. Create a concise daily market brief.

Market Data:
{json.dumps(market_data, indent=2)}

Top News:
{json.dumps(news[:5], indent=2)}

Economic Events Today:
{json.dumps(calendar_events, indent=2)}

Create a brief (3-4 sentences) covering:
1. Overall market sentiment
2. Key movers and why
3. What to watch today

Write in engaging, accessible language. Return JSON: {{"brief": "...", "key_levels": [...], "watch_list": [...]}}"""

    response = requests.post('http://localhost:11434/api/generate', json={
        "model": "mistral:7b",  # Fast for daily generation
        "prompt": prompt,
        "stream": False,
        "format": "json"
    })

    return json.loads(response.json()['response'])
```

#### Real-Time Analysis Stream
```python
def stream_market_analysis(market_event):
    """
    Stream real-time analysis for breaking events
    """
    prompt = f"""BREAKING: {market_event}

Provide immediate analysis: What does this mean for markets? Who wins/loses?"""

    response = requests.post('http://localhost:11434/api/generate', json={
        "model": "qwen2.5:14b",
        "prompt": prompt,
        "stream": True  # Stream for real-time display
    })

    # Yield chunks for progressive display
    for line in response.iter_lines():
        if line:
            yield json.loads(line)['response']
```

---

### 2.7 Ollama Agent Framework Setup

#### CrewAI + Ollama for Multi-Agent Analysis
```python
from crewai import Agent, Task, Crew
from langchain_community.llms import Ollama

# Initialize Ollama LLM
llama = Ollama(model="qwen2.5:14b")

# Define specialized agents
sentiment_analyst = Agent(
    role='Financial Sentiment Analyst',
    goal='Analyze news sentiment and market psychology',
    backstory='Expert in behavioral finance and market sentiment',
    llm=llama
)

technical_analyst = Agent(
    role='Technical Pattern Analyst',
    goal='Identify chart patterns and technical signals',
    backstory='20 years experience in technical analysis',
    llm=llama
)

risk_analyst = Agent(
    role='Risk Assessment Specialist',
    goal='Evaluate market risks and volatility',
    backstory='Former hedge fund risk manager',
    llm=llama
)

# Define tasks
analyze_sentiment = Task(
    description="Analyze today's market news and determine overall sentiment",
    agent=sentiment_analyst
)

find_patterns = Task(
    description="Identify significant chart patterns in major indices",
    agent=technical_analyst
)

assess_risks = Task(
    description="Evaluate current market risks and tail events",
    agent=risk_analyst
)

# Create crew
market_analysis_crew = Crew(
    agents=[sentiment_analyst, technical_analyst, risk_analyst],
    tasks=[analyze_sentiment, find_patterns, assess_risks],
    verbose=True
)

# Run analysis
result = market_analysis_crew.kickoff()
```

#### Scheduled Analysis Pipeline
```python
from apscheduler.schedulers.background import BackgroundScheduler

def run_ai_analysis_pipeline():
    """
    Scheduled pipeline for continuous AI analysis
    """
    # 1. Fetch latest data
    market_data = fetch_market_data()
    news = fetch_news()

    # 2. Run sentiment analysis on news
    news_with_sentiment = batch_sentiment_analysis(news)

    # 3. Generate market DNA
    dna = generate_market_dna(market_data)

    # 4. Create daily brief
    brief = generate_daily_brief(market_data, news_with_sentiment, [])

    # 5. Store results
    store_analysis_results({
        'timestamp': datetime.now(),
        'dna': dna,
        'brief': brief,
        'sentiment': news_with_sentiment
    })

# Schedule analysis
scheduler = BackgroundScheduler()
scheduler.add_job(run_ai_analysis_pipeline, 'interval', minutes=15)
scheduler.start()
```

---

## Part 3: Architecture & Implementation

### 3.1 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     PULSE Frontend (React)                   │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│  │ QuickPulse   │ │  NewsFeed    │ │EconomicCalendar│      │
│  │ (Real Prices)│ │ (Sentiment)  │ │  (Events)     │        │
│  └──────────────┘ └──────────────┘ └──────────────┘        │
└─────────────────────────────────────────────────────────────┘
                              ↑
                              │ API Calls
                              ↓
┌─────────────────────────────────────────────────────────────┐
│               Data Aggregation Service (Node/Python)         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Data Fetchers (Scheduled)                           │  │
│  │  • Stock prices → every 15 sec                       │  │
│  │  • Crypto prices → every 10 sec                      │  │
│  │  • News → every 5 min                                │  │
│  │  • Economic calendar → every 1 hour                  │  │
│  │  • Fear & Greed → every 24 hours                     │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Cache Layer (Redis)                                 │  │
│  │  • Reduce API calls                                  │  │
│  │  • Fallback when rate limited                        │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↑
                              │ Raw Data
                              ↓
┌─────────────────────────────────────────────────────────────┐
│            Ollama AI Analysis Layer (Local)                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Sentiment Analyzer (llama3.2:3b)                    │  │
│  │  • Process news → bullish/bearish/neutral            │  │
│  │  • Confidence scores                                 │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Pattern Recognizer (qwen2.5:14b)                    │  │
│  │  • Generate Market DNA                               │  │
│  │  • Match historical patterns                         │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Brief Generator (mistral:7b)                        │  │
│  │  • Daily market summaries                            │  │
│  │  • Breaking news analysis                            │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↑
                              │ API Calls
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                  External Free Data Sources                  │
│  • Finnhub API (60 calls/min)                               │
│  • CoinGecko API (30 calls/min)                             │
│  • CNN Fear & Greed (direct JSON)                           │
│  • RSS Feeds (unlimited)                                     │
│  • Alpha Vantage (25 calls/day - historical only)           │
└─────────────────────────────────────────────────────────────┘
```

---

### 3.2 Data Flow & Refresh Intervals

#### Real-Time Data (High Frequency)
```javascript
// Stock prices - Every 15 seconds during market hours
const STOCK_REFRESH_INTERVAL = 15000; // 15 seconds
const MARKET_HOURS = {
  start: '09:30',
  end: '16:00',
  timezone: 'America/New_York'
};

// Crypto prices - Every 10 seconds (24/7)
const CRYPTO_REFRESH_INTERVAL = 10000; // 10 seconds
```

#### Medium Frequency Data
```javascript
// News feed - Every 5 minutes
const NEWS_REFRESH_INTERVAL = 300000; // 5 minutes

// Market summaries (AI-generated) - Every 15 minutes
const SUMMARY_REFRESH_INTERVAL = 900000; // 15 minutes
```

#### Low Frequency Data
```javascript
// Economic calendar - Every 1 hour
const CALENDAR_REFRESH_INTERVAL = 3600000; // 1 hour

// Fear & Greed Index - Every 24 hours
const FEAR_GREED_REFRESH_INTERVAL = 86400000; // 24 hours

// Historical data for patterns - Weekly
const HISTORICAL_REFRESH_INTERVAL = 604800000; // 7 days
```

---

### 3.3 Caching Strategy

#### Redis Cache Architecture
```javascript
// Cache configuration
const CACHE_TTL = {
  stockQuotes: 15,        // 15 seconds
  cryptoQuotes: 10,       // 10 seconds
  news: 300,              // 5 minutes
  sentiment: 300,         // 5 minutes (cached after AI analysis)
  calendar: 3600,         // 1 hour
  fearGreed: 86400,       // 24 hours
  historicalData: 604800  // 7 days
};

// Cache key patterns
const CACHE_KEYS = {
  stockQuote: (symbol) => `quote:stock:${symbol}`,
  cryptoQuote: (symbol) => `quote:crypto:${symbol}`,
  news: (category) => `news:${category}`,
  sentiment: (newsId) => `sentiment:${newsId}`,
  fearGreed: () => `index:feargreed`,
  marketDNA: (date) => `dna:${date}`
};
```

#### Cache Implementation
```javascript
import Redis from 'ioredis';

const redis = new Redis();

async function getCachedOrFetch(key, fetchFn, ttl) {
  // Try cache first
  const cached = await redis.get(key);
  if (cached) {
    return JSON.parse(cached);
  }

  // Fetch from API
  const data = await fetchFn();

  // Store in cache
  await redis.setex(key, ttl, JSON.stringify(data));

  return data;
}

// Usage
const quote = await getCachedOrFetch(
  CACHE_KEYS.stockQuote('AAPL'),
  () => fetchFinnhubQuote('AAPL'),
  CACHE_TTL.stockQuotes
);
```

---

### 3.4 Fallback Mechanisms

#### Graceful Degradation Strategy
```javascript
class DataFetcher {
  constructor() {
    this.sources = {
      stocks: [
        { name: 'Finnhub', fetch: this.fetchFinnhub, limit: 60 },
        { name: 'AlphaVantage', fetch: this.fetchAlphaVantage, limit: 5 },
        { name: 'YahooFinance', fetch: this.fetchYahoo, limit: Infinity }
      ],
      crypto: [
        { name: 'CoinGecko', fetch: this.fetchCoinGecko, limit: 30 },
        { name: 'Binance', fetch: this.fetchBinance, limit: Infinity },
        { name: 'CoinCap', fetch: this.fetchCoinCap, limit: Infinity }
      ]
    };
  }

  async fetchWithFallback(type, symbol) {
    const sources = this.sources[type];

    for (const source of sources) {
      try {
        // Check rate limit
        if (await this.isRateLimited(source.name)) {
          console.warn(`${source.name} rate limited, trying next source`);
          continue;
        }

        // Attempt fetch
        const data = await source.fetch(symbol);

        // Track successful call
        await this.recordCall(source.name);

        return {
          data,
          source: source.name,
          cached: false
        };

      } catch (error) {
        console.error(`${source.name} failed:`, error.message);
        // Continue to next source
      }
    }

    // All sources failed - return cached data
    const cached = await this.getFromCache(type, symbol);
    if (cached) {
      return {
        data: cached,
        source: 'cache',
        cached: true,
        stale: true
      };
    }

    throw new Error(`All sources failed for ${type}:${symbol}`);
  }
}
```

#### Rate Limit Tracking
```javascript
class RateLimiter {
  constructor(redis) {
    this.redis = redis;
  }

  async checkLimit(source, maxCalls, window) {
    const key = `ratelimit:${source}`;
    const current = await this.redis.get(key);

    if (!current) {
      await this.redis.setex(key, window, '1');
      return true; // Allowed
    }

    if (parseInt(current) >= maxCalls) {
      return false; // Rate limited
    }

    await this.redis.incr(key);
    return true; // Allowed
  }

  async recordCall(source, window = 60) {
    await this.checkLimit(source, Infinity, window);
  }
}

// Usage
const limiter = new RateLimiter(redis);
const allowed = await limiter.checkLimit('Finnhub', 60, 60);
```

---

### 3.5 Error Handling & Monitoring

#### Error Boundary for API Failures
```javascript
class APIErrorHandler {
  constructor() {
    this.errorLog = [];
    this.alertThreshold = 5; // Alert after 5 consecutive failures
  }

  async handleError(error, context) {
    const errorRecord = {
      timestamp: new Date(),
      context,
      error: error.message,
      stack: error.stack
    };

    this.errorLog.push(errorRecord);

    // Log to console
    console.error(`[${context.source}] API Error:`, error.message);

    // Check if we should alert
    const recentErrors = this.errorLog.filter(
      e => Date.now() - e.timestamp < 300000 // Last 5 minutes
    );

    if (recentErrors.length >= this.alertThreshold) {
      await this.sendAlert({
        type: 'API_FAILURE',
        message: `${context.source} has failed ${recentErrors.length} times in 5 minutes`,
        errors: recentErrors
      });
    }

    // Store in database for analytics
    await this.logToDatabase(errorRecord);
  }

  async sendAlert(alert) {
    // Could integrate with email, Slack, etc.
    console.error('ALERT:', alert);
  }
}
```

#### Health Check Endpoint
```javascript
// Express.js health check
app.get('/api/health', async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date(),
    services: {}
  };

  // Check each data source
  const sources = ['Finnhub', 'CoinGecko', 'CNN', 'Ollama'];

  for (const source of sources) {
    try {
      const isHealthy = await checkServiceHealth(source);
      health.services[source] = {
        status: isHealthy ? 'up' : 'down',
        lastCheck: new Date()
      };
    } catch (error) {
      health.services[source] = {
        status: 'error',
        error: error.message
      };
      health.status = 'degraded';
    }
  }

  res.json(health);
});
```

---

## Implementation Roadmap

### Week 1-2: Infrastructure Setup
- [ ] Set up Ollama locally
- [ ] Install recommended models (qwen2.5:14b, llama3.2:3b, mistral:7b)
- [ ] Test Ollama API connectivity
- [ ] Acquire API keys (Finnhub, CoinGecko, Alpha Vantage)
- [ ] Set up Redis cache server
- [ ] Create environment variable configuration

### Week 2-3: Data Service Layer
- [ ] Create `/src/services/marketData.ts`
  - Finnhub integration
  - Alpha Vantage integration (historical)
  - Fallback mechanisms
- [ ] Create `/src/services/cryptoData.ts`
  - CoinGecko integration
  - Binance integration
- [ ] Create `/src/services/newsData.ts`
  - Finnhub news
  - RSS feed parser
- [ ] Create `/src/services/economicCalendar.ts`
  - Finnhub calendar
  - Fallback sources
- [ ] Create `/src/services/fearGreed.ts`
  - CNN direct endpoint
- [ ] Implement caching layer
- [ ] Implement rate limiting

### Week 3-4: Ollama AI Integration
- [ ] Create `/src/services/ollamaClient.ts`
  - Base Ollama API client
  - Model selection logic
- [ ] Create `/src/services/aiSentiment.ts`
  - News sentiment analysis
  - Batch processing
- [ ] Create `/src/services/aiPatterns.ts`
  - Market DNA generation
  - Pattern matching
- [ ] Create `/src/services/aiBrief.ts`
  - Daily market summaries
  - Real-time analysis
- [ ] Set up scheduled jobs
  - Every 15 min: Market summary
  - Every 5 min: News sentiment
  - On-demand: Breaking news analysis

### Week 4-5: Component Integration
- [ ] Update `QuickPulse.tsx`
  - Replace mock data with real stock/crypto prices
  - Real-time VIX data
  - Real Fear & Greed Index
- [ ] Update `NewsFeed.tsx`
  - Real news from Finnhub
  - AI-generated sentiment badges
- [ ] Update `EconomicCalendar.tsx`
  - Real economic events
  - Impact levels from API
- [ ] Update `MarketHeartbeat.tsx`
  - Real BPM calculation from volatility
  - Actual market segments
- [ ] Update `MarketWeather.tsx`
  - Real sentiment temperature
  - Actual forecast data
- [ ] Update `MarketDNA.tsx`
  - AI-generated DNA sequences
  - Historical pattern matching

### Week 5-6: Testing & Optimization
- [ ] Test all data sources
- [ ] Verify rate limits and fallbacks
- [ ] Test Ollama performance
- [ ] Optimize AI model selection
- [ ] Load testing
- [ ] Error handling verification
- [ ] Cache hit rate optimization
- [ ] Documentation updates

### Week 6-7: Advanced Features
- [ ] Implement WebSocket for real-time updates
- [ ] Add AI-powered alerts
- [ ] Create pattern similarity search
- [ ] Build historical data warehouse
- [ ] Implement CrewAI multi-agent system

### Week 7-8: Deployment & Monitoring
- [ ] Set up production environment
- [ ] Deploy Ollama on server
- [ ] Configure monitoring (health checks)
- [ ] Set up error alerting
- [ ] Performance monitoring
- [ ] User acceptance testing
- [ ] Final documentation

---

## Code Examples

### 5.1 Complete Data Service Implementation

#### `/src/services/marketData.ts`
```typescript
import axios from 'axios';

const FINNHUB_API_KEY = import.meta.env.VITE_FINNHUB_API_KEY;
const ALPHA_VANTAGE_API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;

interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: number;
}

class MarketDataService {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private rateLimits = new Map<string, number>();

  // Finnhub - Primary source
  async fetchFinnhubQuote(symbol: string): Promise<StockQuote> {
    try {
      const response = await axios.get(
        `https://finnhub.io/api/v1/quote`,
        {
          params: { symbol, token: FINNHUB_API_KEY },
          timeout: 5000
        }
      );

      const data = response.data;
      return {
        symbol,
        price: data.c,
        change: data.d,
        changePercent: data.dp,
        volume: data.v || 0,
        timestamp: data.t * 1000
      };
    } catch (error) {
      console.error(`Finnhub failed for ${symbol}:`, error.message);
      throw error;
    }
  }

  // Alpha Vantage - Backup source
  async fetchAlphaVantageQuote(symbol: string): Promise<StockQuote> {
    try {
      const response = await axios.get(
        `https://www.alphavantage.co/query`,
        {
          params: {
            function: 'GLOBAL_QUOTE',
            symbol,
            apikey: ALPHA_VANTAGE_API_KEY
          },
          timeout: 5000
        }
      );

      const quote = response.data['Global Quote'];
      return {
        symbol: quote['01. symbol'],
        price: parseFloat(quote['05. price']),
        change: parseFloat(quote['09. change']),
        changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
        volume: parseInt(quote['06. volume']),
        timestamp: Date.now()
      };
    } catch (error) {
      console.error(`Alpha Vantage failed for ${symbol}:`, error.message);
      throw error;
    }
  }

  // Main method with fallback logic
  async getQuote(symbol: string): Promise<StockQuote> {
    // Check cache first (15 second TTL)
    const cached = this.getFromCache(`quote:${symbol}`, 15000);
    if (cached) {
      return cached;
    }

    // Try Finnhub first
    try {
      const quote = await this.fetchFinnhubQuote(symbol);
      this.setCache(`quote:${symbol}`, quote);
      return quote;
    } catch (error) {
      console.warn('Finnhub failed, trying Alpha Vantage...');
    }

    // Fallback to Alpha Vantage
    try {
      const quote = await this.fetchAlphaVantageQuote(symbol);
      this.setCache(`quote:${symbol}`, quote);
      return quote;
    } catch (error) {
      console.error('All sources failed, returning stale cache if available');

      // Return stale cache as last resort
      const stale = this.getFromCache(`quote:${symbol}`, Infinity);
      if (stale) {
        return { ...stale, stale: true };
      }

      throw new Error(`Unable to fetch quote for ${symbol}`);
    }
  }

  // Batch fetch multiple quotes
  async getQuotes(symbols: string[]): Promise<StockQuote[]> {
    const promises = symbols.map(symbol => this.getQuote(symbol));
    const results = await Promise.allSettled(promises);

    return results
      .filter(r => r.status === 'fulfilled')
      .map(r => (r as PromiseFulfilledResult<StockQuote>).value);
  }

  // Cache helpers
  private getFromCache(key: string, maxAge: number): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const age = Date.now() - cached.timestamp;
    if (age > maxAge) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
}

export const marketDataService = new MarketDataService();
```

#### `/src/services/ollamaClient.ts`
```typescript
import axios from 'axios';

const OLLAMA_BASE_URL = 'http://localhost:11434';

interface OllamaResponse {
  model: string;
  response: string;
  done: boolean;
}

interface SentimentResult {
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  reasoning: string;
}

class OllamaClient {
  private baseURL: string;

  constructor(baseURL = OLLAMA_BASE_URL) {
    this.baseURL = baseURL;
  }

  async generate(model: string, prompt: string, options = {}): Promise<string> {
    try {
      const response = await axios.post(`${this.baseURL}/api/generate`, {
        model,
        prompt,
        stream: false,
        format: 'json',
        ...options
      });

      return response.data.response;
    } catch (error) {
      console.error('Ollama generation failed:', error);
      throw error;
    }
  }

  async analyzeSentiment(text: string): Promise<SentimentResult> {
    const prompt = `You are a financial sentiment analyst. Analyze this text and respond ONLY with JSON.

Text: "${text}"

Respond with: {"sentiment": "positive|negative|neutral", "confidence": 0.0-1.0, "reasoning": "brief explanation"}

Rules:
- positive: Good for markets/stocks
- negative: Bad for markets/stocks
- neutral: No clear impact

JSON:`;

    const response = await this.generate('llama3.2:3b', prompt, {
      temperature: 0.1
    });

    return JSON.parse(response);
  }

  async generateMarketBrief(data: any): Promise<string> {
    const prompt = `Create a concise market brief (3-4 sentences).

Data: ${JSON.stringify(data, null, 2)}

Brief:`;

    const response = await this.generate('mistral:7b', prompt, {
      temperature: 0.7
    });

    return JSON.parse(response).brief;
  }

  async generateMarketDNA(marketData: any): Promise<any> {
    const prompt = `Analyze market data and create a DNA code (A, T, G, C).

Data: ${JSON.stringify(marketData)}

A = Appetite (risk), T = Trend (direction), G = Gravity (mean reversion), C = Catalyst (events)

Return JSON: {"dna": "XXXX", "appetite": "...", "trend": "...", "gravity": "...", "catalyst": "...", "explanation": "..."}

JSON:`;

    const response = await this.generate('qwen2.5:14b', prompt);
    return JSON.parse(response);
  }

  async checkHealth(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseURL}/api/tags`);
      return response.status === 200;
    } catch {
      return false;
    }
  }
}

export const ollamaClient = new OllamaClient();
```

---

### 5.2 React Component Updates

#### Updated `QuickPulse.tsx` with Real Data
```typescript
import { memo, useMemo, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { TrendingUp, TrendingDown, Activity, AlertCircle } from 'lucide-react';
import { marketDataService } from '@/services/marketData';
import { fearGreedService } from '@/services/fearGreed';

export const QuickPulse = memo(function QuickPulse() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        const [spyQuote, vixQuote, fearGreed] = await Promise.all([
          marketDataService.getQuote('SPY'),
          marketDataService.getQuote('VIX'),
          fearGreedService.getCurrentIndex()
        ]);

        if (mounted) {
          setData({
            trend: spyQuote.changePercent > 0 ? 'Bullish' : 'Bearish',
            trendChange: `${spyQuote.changePercent > 0 ? '+' : ''}${spyQuote.changePercent.toFixed(2)}%`,
            trendPositive: spyQuote.changePercent > 0,

            volatility: vixQuote.price < 15 ? 'Low' : vixQuote.price < 20 ? 'Medium' : 'High',
            volatilityValue: `VIX: ${vixQuote.price.toFixed(2)}`,

            sentiment: fearGreed.rating,
            sentimentScore: `${fearGreed.score}/100`,
            sentimentPositive: fearGreed.score < 50,

            volume: spyQuote.volume > 0 ? 'Above Avg' : 'Below Avg',
            volumeChange: '+15%' // Calculate from historical average
          });
          setLoading(false);
        }
      } catch (error) {
        console.error('Failed to fetch Quick Pulse data:', error);
        setLoading(false);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 15000); // Refresh every 15 seconds

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const metrics = useMemo(() => {
    if (!data) return [];

    return [
      {
        name: 'Market Trend',
        value: data.trend,
        change: data.trendChange,
        positive: data.trendPositive,
        icon: data.trendPositive ? TrendingUp : TrendingDown,
        color: data.trendPositive ? 'text-green-500' : 'text-red-500'
      },
      {
        name: 'Volatility',
        value: data.volatility,
        change: data.volatilityValue,
        positive: data.volatility === 'Low',
        icon: Activity,
        color: 'text-blue-500'
      },
      {
        name: 'Sentiment',
        value: data.sentiment,
        change: data.sentimentScore,
        positive: data.sentimentPositive,
        icon: AlertCircle,
        color: 'text-yellow-500'
      },
      {
        name: 'Volume',
        value: data.volume,
        change: data.volumeChange,
        positive: true,
        icon: TrendingUp,
        color: 'text-purple-500'
      }
    ];
  }, [data]);

  if (loading) {
    return (
      <Card className="glass-card border-purple-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-400 animate-pulse" />
            Loading Market Data...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-purple-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-purple-400" />
          Quick Pulse
          <Badge variant="outline" className="ml-auto text-xs">
            Live
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((metric) => (
            <div
              key={metric.name}
              className="p-4 rounded-lg bg-gray-800/50 border border-white/5 hover:border-purple-500/30 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <metric.icon className={`w-5 h-5 ${metric.color}`} />
                <Badge
                  variant={metric.positive ? 'default' : 'secondary'}
                  className={metric.positive ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}
                >
                  {metric.change}
                </Badge>
              </div>
              <div className="text-sm text-gray-400">{metric.name}</div>
              <div className="text-lg font-bold text-white">{metric.value}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});
```

---

### 5.3 Scheduled Jobs Setup

#### `/src/services/scheduler.ts`
```typescript
import cron from 'node-cron';
import { ollamaClient } from './ollamaClient';
import { newsService } from './newsData';
import { marketDataService } from './marketData';

class DataScheduler {
  private jobs: cron.ScheduledTask[] = [];

  start() {
    // Every 5 minutes: Fetch and analyze news
    this.jobs.push(cron.schedule('*/5 * * * *', async () => {
      console.log('[Scheduler] Running news sentiment analysis...');

      const news = await newsService.getLatestNews();
      const analyzed = await Promise.all(
        news.map(async (item) => ({
          ...item,
          aiSentiment: await ollamaClient.analyzeSentiment(item.title)
        }))
      );

      // Store analyzed news
      await newsService.storeAnalyzedNews(analyzed);
    }));

    // Every 15 minutes: Generate market brief
    this.jobs.push(cron.schedule('*/15 * * * *', async () => {
      console.log('[Scheduler] Generating market brief...');

      const marketData = await marketDataService.getMarketSnapshot();
      const brief = await ollamaClient.generateMarketBrief(marketData);

      // Store brief
      await marketDataService.storeBrief(brief);
    }));

    // Every hour: Update economic calendar
    this.jobs.push(cron.schedule('0 * * * *', async () => {
      console.log('[Scheduler] Updating economic calendar...');
      await economicCalendarService.updateEvents();
    }));

    // Daily at 6 AM: Generate market DNA
    this.jobs.push(cron.schedule('0 6 * * *', async () => {
      console.log('[Scheduler] Generating daily market DNA...');

      const marketData = await marketDataService.getMarketSnapshot();
      const dna = await ollamaClient.generateMarketDNA(marketData);

      // Store DNA sequence
      await marketDataService.storeDNA(dna);
    }));

    console.log('[Scheduler] All jobs started successfully');
  }

  stop() {
    this.jobs.forEach(job => job.stop());
    console.log('[Scheduler] All jobs stopped');
  }
}

export const scheduler = new DataScheduler();
```

---

## Testing Strategy

### 6.1 API Testing Checklist

#### Finnhub API Tests
- [ ] Verify API key works
- [ ] Test stock quote endpoint
- [ ] Test news endpoint
- [ ] Test economic calendar endpoint
- [ ] Verify rate limit handling (60/min)
- [ ] Test WebSocket connection
- [ ] Verify error responses

#### CoinGecko API Tests
- [ ] Test simple price endpoint
- [ ] Test market data endpoint
- [ ] Test historical data endpoint
- [ ] Verify rate limit (30/min)
- [ ] Test batch requests
- [ ] Verify response format

#### Ollama Tests
- [ ] Verify Ollama service is running
- [ ] Test sentiment analysis accuracy
- [ ] Test market DNA generation
- [ ] Test brief generation speed
- [ ] Measure response times
- [ ] Test with different models
- [ ] Verify JSON parsing

### 6.2 Integration Tests

```typescript
import { describe, it, expect } from 'vitest';
import { marketDataService } from '@/services/marketData';
import { ollamaClient } from '@/services/ollamaClient';

describe('Market Data Integration', () => {
  it('should fetch stock quote from Finnhub', async () => {
    const quote = await marketDataService.getQuote('AAPL');

    expect(quote).toHaveProperty('symbol', 'AAPL');
    expect(quote).toHaveProperty('price');
    expect(typeof quote.price).toBe('number');
    expect(quote.price).toBeGreaterThan(0);
  });

  it('should fallback to Alpha Vantage if Finnhub fails', async () => {
    // Mock Finnhub failure
    jest.spyOn(marketDataService, 'fetchFinnhubQuote')
      .mockRejectedValueOnce(new Error('API Error'));

    const quote = await marketDataService.getQuote('AAPL');

    expect(quote).toBeDefined();
    expect(quote.source).toBe('AlphaVantage');
  });

  it('should analyze news sentiment with Ollama', async () => {
    const news = 'Apple reports record quarterly earnings, beating estimates';
    const sentiment = await ollamaClient.analyzeSentiment(news);

    expect(sentiment).toHaveProperty('sentiment');
    expect(['positive', 'negative', 'neutral']).toContain(sentiment.sentiment);
    expect(sentiment.confidence).toBeGreaterThanOrEqual(0);
    expect(sentiment.confidence).toBeLessThanOrEqual(1);
  });
});
```

### 6.3 Performance Benchmarks

#### Target Performance Metrics
```
API Response Times (P95):
- Stock quote fetch: < 500ms
- Crypto quote fetch: < 300ms
- News fetch: < 1s
- Economic calendar: < 800ms
- Fear & Greed: < 400ms

Ollama AI Response Times (P95):
- Sentiment analysis: < 2s (llama3.2:3b)
- Market brief: < 5s (mistral:7b)
- DNA generation: < 8s (qwen2.5:14b)
- Pattern matching: < 10s (qwen2.5:14b)

Cache Hit Rates:
- Stock quotes: > 80%
- Crypto quotes: > 75%
- News: > 90%
- Calendar events: > 95%

Data Freshness:
- Stock prices: < 30 seconds old
- Crypto prices: < 20 seconds old
- News: < 10 minutes old
- Sentiment scores: < 10 minutes old
```

---

## Deployment Considerations

### 7.1 Environment Variables

```bash
# .env.example

# API Keys (FREE)
VITE_FINNHUB_API_KEY=your_finnhub_key
VITE_ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key
VITE_COINGECKO_API_KEY=optional

# Ollama Configuration
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODELS_PATH=/path/to/models

# Cache Configuration
REDIS_URL=redis://localhost:6379
CACHE_TTL_QUOTES=15
CACHE_TTL_NEWS=300

# Feature Flags
ENABLE_REAL_DATA=true
ENABLE_AI_ANALYSIS=true
ENABLE_WEBSOCKETS=false
```

### 7.2 Resource Requirements

#### Minimum System Requirements
- **CPU**: 4 cores (for Ollama inference)
- **RAM**: 16GB (8GB for OS + apps, 8GB for Ollama models)
- **Storage**: 50GB (for Ollama models + cache)
- **Network**: Stable internet for API calls

#### Recommended System Requirements
- **CPU**: 8 cores (faster AI inference)
- **RAM**: 32GB (can run larger Ollama models)
- **GPU**: Optional (NVIDIA/AMD for faster inference)
- **Storage**: 100GB SSD
- **Redis**: 2GB RAM allocated

#### Cloud Deployment (Optional)
- **Frontend**: Vercel/Netlify (free tier)
- **Backend**: AWS EC2 t3.medium or DigitalOcean Droplet ($24/mo)
- **Ollama**: Same server as backend (local inference)
- **Redis**: ElastiCache or managed Redis ($10-20/mo)

**Total Monthly Cost**: ~$35-50/mo (vs $200+ for paid API plans)

---

## Risk Assessment

### Data Source Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Finnhub rate limit exceeded | Medium | Medium | Implement Redis caching, use Alpha Vantage fallback |
| CoinGecko API changes | Low | Medium | Version pinning, monitor API changelog |
| Yahoo Finance scraper breaks | High | Low | Use as last resort only, maintain API alternatives |
| CNN Fear & Greed endpoint removed | Low | Low | Use RapidAPI alternative |
| Alpha Vantage daily limit hit | High | Low | Reserve for historical data only |

### Ollama Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Model hallucination in analysis | Medium | Medium | Use low temperature, validate outputs |
| Slow inference on large models | Medium | High | Use appropriate model sizes, implement timeouts |
| Out of memory errors | Low | High | Monitor RAM usage, restart service if needed |
| Model incompatibility after update | Low | Medium | Pin model versions, test before production |

### Operational Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Cache failure | Low | Medium | Implement fallback to direct API calls |
| Network outages | Low | High | Graceful degradation to cached data |
| High traffic spike | Medium | High | Implement request queuing, rate limiting |
| Disk space exhaustion | Low | Medium | Monitor storage, implement log rotation |

---

## Success Criteria

### Functional Requirements
- [ ] All mock data replaced with real data sources
- [ ] Stock prices update every 15 seconds during market hours
- [ ] Crypto prices update every 10 seconds
- [ ] News feed updates every 5 minutes with AI sentiment
- [ ] Economic calendar updates hourly
- [ ] Fear & Greed Index updates daily
- [ ] Market DNA generated daily at 6 AM
- [ ] Market brief generated every 15 minutes

### Performance Requirements
- [ ] 95% cache hit rate achieved
- [ ] API response times < 1 second (P95)
- [ ] Ollama sentiment analysis < 2 seconds
- [ ] Page load time < 3 seconds
- [ ] Zero data loss during API failures
- [ ] Graceful degradation to cached data

### Quality Requirements
- [ ] 90%+ uptime for data feeds
- [ ] Sentiment analysis accuracy > 70%
- [ ] Error rate < 5%
- [ ] All API keys properly secured
- [ ] No API keys committed to git
- [ ] Comprehensive error logging
- [ ] Health check endpoint functional

---

## Appendix: API Key Acquisition

### Finnhub
1. Visit: https://finnhub.io/register
2. Sign up for free account
3. Get API key from dashboard
4. Free tier: 60 API calls/minute

### Alpha Vantage
1. Visit: https://www.alphavantage.co/support/#api-key
2. Enter email to receive API key
3. Free tier: 25 API calls/day, 5 calls/minute

### CoinGecko
1. Visit: https://www.coingecko.com/en/api
2. Free tier requires no API key (Demo plan)
3. For higher limits, sign up for API key

### All Other Sources
- CNN Fear & Greed: No API key required (direct endpoint)
- RSS Feeds: No API key required
- Binance Public API: No API key required
- Yahoo Finance: No official API (scraping fallback)

---

## References & Sources

### Data Source Documentation
- [Finnhub API](https://finnhub.io/)
- [Alpha Vantage Documentation](https://www.alphavantage.co/documentation/)
- [CoinGecko API](https://www.coingecko.com/en/api)
- [Best Real-Time Stock APIs 2025](https://site.financialmodelingprep.com/education/other/best-realtime-stock-market-data-apis-in-)
- [Financial Data APIs Guide](https://www.ksred.com/the-complete-guide-to-financial-data-apis-building-your-own-stock-market-data-pipeline-in-2025/)
- [Free Cryptocurrency APIs](https://dev.to/saira_zeeshan_35fc05971fd/free-cryptocurrency-price-apis-complete-guide-2025-430c)
- [Economic Calendar APIs](https://tradingeconomics.com/api/calendar.aspx)
- [CNN Fear & Greed Index](https://www.cnn.com/markets/fear-and-greed)

### Ollama & AI Resources
- [Ollama Models List 2025](https://skywork.ai/blog/llm/ollama-models-list-2025-100-models-compared/)
- [Ollama Library](https://ollama.com/library)
- [Best Open-Source LLMs](https://huggingface.co/blog/daya-shankar/open-source-llms)
- [Qwen3 Documentation](https://github.com/QwenLM/Qwen3)
- [FinBERT Sentiment Analysis](https://github.com/ProsusAI/finBERT)
- [Financial Sentiment with AI](https://vincent.codes.finance/posts/sentiment/)

### Web Scraping Resources
- [Yahoo Finance Scraping Guide](https://decodo.com/blog/scrape-yahoo-finance)
- [Beautiful Soup + Playwright](https://blog.apify.com/scrape-yahoo-finance-python/)
- [Web Scraping Best Practices](https://medium.com/@trading.dude/web-scraping-vs-official-apis-for-financial-data-stocks-crypto-and-forex-89efb2a1818f)

---

**Plan Created By**: Master Orchestrator
**Research Date**: 2025-12-24
**Next Steps**: Begin Week 1 implementation
**Approval**: Ready for development team review
