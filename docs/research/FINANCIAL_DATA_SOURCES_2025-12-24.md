# Financial Data Sources Research Report

**Project**: 1MarketHood PULSE
**Date**: 2025-12-24
**Researcher**: Financial Data Research Agent
**Status**: Complete

---

## Executive Summary

This report documents free and accessible financial data sources for the PULSE trading intelligence platform. After comprehensive research, we have identified reliable sources for all required data types:

| Data Type | Primary Source | Backup Source | Reliability |
|-----------|---------------|---------------|-------------|
| Stock Prices | Alpha Vantage | Yahoo Finance (yfinance) | High |
| Crypto Prices | CoinGecko | Binance Public API | High |
| Market Indices (VIX, 10Y) | FRED API | Yahoo Finance | Very High |
| Economic News | Alpha Vantage News | Finnhub | Medium-High |
| Options Flow | Unusual Whales (Free) | OptionStrat (Delayed) | Medium |
| Sector Performance | FMP | Finnhub | High |

**Key Recommendation**: Use FRED API for indices/economic data (most reliable, government-backed), Alpha Vantage for stocks (official NASDAQ vendor), and CoinGecko for crypto (most comprehensive free tier).

---

## Table of Contents

1. [Stock Prices](#1-stock-prices)
2. [Cryptocurrency Prices](#2-cryptocurrency-prices)
3. [Market Indices](#3-market-indices-vix-dxy-10y-yield)
4. [Economic News and Sentiment](#4-economic-news-and-sentiment)
5. [Options Flow Data](#5-options-flow-data)
6. [Sector Performance](#6-sector-performance)
7. [Web Scraping Considerations](#7-web-scraping-considerations)
8. [Implementation Examples](#8-implementation-examples)
9. [Rate Limit Summary](#9-rate-limit-summary)
10. [Recommendations](#10-final-recommendations)

---

## 1. Stock Prices

### 1.1 Alpha Vantage (Recommended Primary)

**Website**: https://www.alphavantage.co/
**API Documentation**: https://www.alphavantage.co/documentation/

**Free Tier Details**:
- 25 API requests per day (new limit as of 2024)
- Previously 500/day - now significantly reduced
- Access to real-time and historical data
- Covers stocks, ETFs, forex, crypto

**Pros**:
- Official NASDAQ vendor (high data quality)
- Excellent documentation
- JSON and CSV formats
- 50+ technical indicators included

**Cons**:
- Reduced free tier (25 calls/day)
- No WebSocket streaming on free tier
- 15-minute delay on real-time quotes

**Coverage for PULSE**:
- SPY, QQQ, NVDA, AAPL, TSLA: Full support
- Historical data: 20+ years available

### 1.2 Yahoo Finance via yfinance (Backup)

**Library**: https://pypi.org/project/yfinance/
**Latest Version**: December 2025

**Free Tier Details**:
- No official rate limits (unofficial API)
- Typically 100 calls/hour safe
- 5 concurrent requests maximum

**Pros**:
- Completely free
- Easy Python integration
- Returns pandas DataFrames
- Real-time quotes available

**Cons**:
- Unofficial/unsupported by Yahoo
- Frequent blocking (429 errors)
- May break when Yahoo changes site
- Personal use only per ToS

**Legal Status**:
- Intended for personal/educational use only
- Not officially endorsed by Yahoo
- Commercial use may violate ToS

### 1.3 Polygon.io (Limited Free Tier)

**Website**: https://polygon.io/
**Note**: Now rebranded as Massive.com

**Free Tier Details**:
- 5 API calls per minute
- 2-year historical data
- Delayed data only (15 min)

**Pros**:
- High-quality institutional data
- WebSocket support
- Options data included

**Cons**:
- Very limited free tier
- Real-time requires paid plan

### 1.4 Finnhub (Alternative)

**Website**: https://finnhub.io/
**API Documentation**: https://finnhub.io/docs/api

**Free Tier Details**:
- 60 API calls per minute
- Basic stock quotes
- Limited historical data

**Pros**:
- Generous rate limits
- Good documentation
- Real-time WebSocket available

**Cons**:
- Limited data depth on free tier
- US stocks primarily

---

## 2. Cryptocurrency Prices

### 2.1 CoinGecko (Recommended Primary)

**Website**: https://www.coingecko.com/en/api
**Documentation**: https://docs.coingecko.com/

**Free Tier (Demo API)**:
- 30 calls per minute
- 10,000 calls per month
- No API key required for public endpoints

**Coverage**:
- 18,000+ cryptocurrencies
- 1,000+ exchanges
- 16M+ tokens across 200+ networks
- NFT data for 2,000+ collections

**Historical Data**:
- 10+ years available (from 2014)
- Granularity: 5-min (1 day), hourly (1-90 days), daily (90+ days)

**Pros**:
- Most comprehensive free crypto API
- Excellent documentation
- Multi-chain support
- No auth required for basic use

**Cons**:
- Rate limits can be restrictive for heavy use
- Some endpoints require paid tier

**PULSE Coverage**: BTC, ETH, SOL fully supported

### 2.2 Binance Public API (Alternative)

**Website**: https://binance-docs.github.io/apidocs/
**Type**: Exchange API

**Free Tier Details**:
- No strict rate limits on public endpoints
- Real-time WebSocket streaming
- Low latency

**Pros**:
- Professional-grade infrastructure
- Real-time data
- No authentication for market data

**Cons**:
- Binance-listed pairs only
- Exchange-specific prices (may differ from aggregates)

### 2.3 CoinCap (Alternative)

**Website**: https://docs.coincap.io/

**Free Tier Details**:
- 200 requests per minute
- Real-time WebSocket available
- No API key required

**Pros**:
- Simple, clean API
- Good for real-time updates
- Generous rate limits

**Cons**:
- Less comprehensive than CoinGecko
- Limited historical depth

---

## 3. Market Indices (VIX, DXY, 10Y Yield)

### 3.1 FRED API (Recommended Primary)

**Website**: https://fred.stlouisfed.org/docs/api/fred/
**Provider**: Federal Reserve Bank of St. Louis

**Free Tier Details**:
- 120 requests per minute
- 100,000 observations per request
- Completely free with API key
- 765,000+ time series available

**Key Series for PULSE**:
| Indicator | Series ID | Update Frequency |
|-----------|-----------|------------------|
| VIX Index | VIXCLS | Daily |
| 10-Year Treasury | DGS10 | Daily |
| 2-Year Treasury | DGS2 | Daily |
| 10Y-2Y Spread | T10Y2Y | Daily |
| Dollar Index (proxy) | DTWEXBGS | Weekly |
| Fed Funds Rate | FEDFUNDS | Monthly |

**Pros**:
- Government-backed, highly reliable
- Extensive historical data (some series back to 1960s)
- Excellent documentation
- JSON, XML, CSV formats
- Free Python library (fredapi)

**Cons**:
- Daily data only (no intraday)
- Some indices updated with 1-day lag
- DXY not directly available (use DTWEXBGS proxy)

**API Key**: Free at https://fred.stlouisfed.org/docs/api/api_key.html

### 3.2 Yahoo Finance (Backup for Real-Time)

**Tickers for Indices**:
| Index | Yahoo Ticker |
|-------|-------------|
| VIX | ^VIX |
| S&P 500 | ^GSPC |
| NASDAQ | ^IXIC |
| Dow Jones | ^DJI |
| 10Y Treasury | ^TNX |
| Dollar Index | DX-Y.NYB |

**Pros**:
- Near real-time quotes
- Intraday data available
- Easy via yfinance

**Cons**:
- Unofficial API (see yfinance limitations above)

---

## 4. Economic News and Sentiment

### 4.1 Alpha Vantage News API (Recommended)

**Endpoint**: /query?function=NEWS_SENTIMENT

**Free Tier Details**:
- Included in 25 daily calls
- AI-powered sentiment analysis
- Ticker-specific news

**Features**:
- Sentiment scores (-1 to +1)
- Relevance scores
- Source attribution
- Multiple tickers per request

**Pros**:
- Built-in sentiment analysis
- Official API
- Well-structured response

**Cons**:
- Counts against limited daily quota
- May not cover all news sources

### 4.2 Finnhub News (Alternative)

**Website**: https://finnhub.io/docs/api/news-sentiment

**Free Tier Details**:
- 60 calls/minute
- Company news
- Market news
- Sentiment data

**Pros**:
- Generous rate limits
- Real-time news
- Good coverage

**Cons**:
- Sentiment may be less accurate than paid alternatives

### 4.3 Financial Modeling Prep (FMP)

**Website**: https://site.financialmodelingprep.com/developer/docs

**Free Tier Details**:
- 250 API calls per day
- News with sentiment
- RSS feed available

**Pros**:
- Transparent pricing
- Good documentation
- Sentiment included

**Cons**:
- Limited calls on free tier

### 4.4 Marketaux

**Website**: https://www.marketaux.com/

**Free Tier**:
- 100 requests per day
- Global stock market news
- Sentiment analysis included

---

## 5. Options Flow Data

### 5.1 Unusual Whales (Free Tier)

**Website**: https://unusualwhales.com/live-options-flow/free

**Free Features**:
- Delayed options flow (15+ min)
- Basic unusual activity alerts
- Public API available

**API**: https://unusualwhales.com/public-api

**Pros**:
- Dedicated options data provider
- Good UI for manual checks
- Community insights

**Cons**:
- Delayed data on free tier
- Limited API access
- Full features require subscription

### 5.2 OptionStrat Flow

**Website**: https://optionstrat.com/flow

**Free Features**:
- 15-minute delayed data
- ~10% of total flow visible
- Unusual activity detection

**Pros**:
- Visual flow analysis
- Consolidates broken-up orders
- Educational content

**Cons**:
- Delayed data
- Limited visibility (10% of flow)

### 5.3 Barchart Options

**Website**: https://www.barchart.com/options/unusual-activity

**Free Features**:
- Unusual activity page
- Volume/OI ratios
- Basic options flow

**Limitations**:
- No API access
- Manual viewing only
- Delayed quotes

### 5.4 Reality Check: Options Flow APIs

**Important Note**: Unlike other data types, truly free options flow APIs are extremely limited. Most comprehensive options flow data requires paid subscriptions ($50-200/month). For PULSE, consider:

1. Using delayed data from free sources for educational purposes
2. Implementing a "premium" tier that uses paid data
3. Focusing on EOD (end-of-day) options data from FMP or Polygon free tiers

---

## 6. Sector Performance

### 6.1 Financial Modeling Prep (Recommended)

**Endpoint**: /api/v3/stock/sectors-performance

**Free Tier**:
- Included in 250 daily calls
- All 11 GICS sectors
- Historical sector data

**Coverage**:
- Communication Services
- Consumer Discretionary
- Consumer Staples
- Energy
- Financials
- Health Care
- Industrials
- Information Technology
- Materials
- Real Estate
- Utilities

### 6.2 Finnhub ETF Sector Exposure

**Endpoint**: /etf/sector

**Free Tier**:
- 60 calls/minute
- ETF sector breakdowns
- Holdings analysis

### 6.3 SPDR Sector ETFs (Manual/Scraping)

**Source**: https://www.ssga.com/us/en/intermediary/resources/sector-tracker

**ETF Symbols**:
| Sector | ETF |
|--------|-----|
| Technology | XLK |
| Financials | XLF |
| Healthcare | XLV |
| Consumer Discretionary | XLY |
| Consumer Staples | XLP |
| Energy | XLE |
| Materials | XLB |
| Industrials | XLI |
| Utilities | XLU |
| Real Estate | XLRE |
| Communication | XLC |

These can be tracked via any stock API (Alpha Vantage, yfinance).

---

## 7. Web Scraping Considerations

### 7.1 Legal Framework (2025)

**Key Legal Precedents**:
- **HiQ v. LinkedIn**: Scraping public data generally not a CFAA violation
- **Meta v. Bright Data (2024)**: Terms of Service violations can be enforced

**Best Practices**:
1. Always check robots.txt first
2. Respect Terms of Service
3. Implement rate limiting (1-2 requests/second max)
4. Use legitimate User-Agent strings
5. Avoid bypassing authentication
6. Do not scrape personal data (PII)
7. Cache aggressively to minimize requests

### 7.2 Recommended Approach for PULSE

**DO NOT SCRAPE**:
- Any data behind logins
- Personal user data
- Content explicitly prohibited in ToS
- Sites with aggressive anti-bot measures

**SAFE TO CONSIDER** (with caution):
- Public RSS feeds
- Government data sources
- Sites with explicit API alternatives (use API instead)

### 7.3 robots.txt and GDPR

Under GDPR (EU), ignoring robots.txt is now seen as a negative signal by regulators. For PULSE:
- Always respect robots.txt Disallow directives
- Prefer official APIs over scraping
- Document data sources for compliance

### 7.4 Recommended: Prefer APIs Over Scraping

For a production application like PULSE, scraping should be a last resort. Free APIs exist for all required data types. Scraping introduces:
- Legal risk
- Maintenance burden (sites change)
- Reliability issues
- Potential IP blocking

---

## 8. Implementation Examples

### 8.1 Alpha Vantage - Stock Prices (TypeScript)

```typescript
// /src/services/alphaVantage.ts

const ALPHA_VANTAGE_API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;
const BASE_URL = 'https://www.alphavantage.co/query';

interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: string;
}

interface AlphaVantageQuote {
  'Global Quote': {
    '01. symbol': string;
    '02. open': string;
    '03. high': string;
    '04. low': string;
    '05. price': string;
    '06. volume': string;
    '07. latest trading day': string;
    '08. previous close': string;
    '09. change': string;
    '10. change percent': string;
  };
}

export async function getStockQuote(symbol: string): Promise<StockQuote> {
  const url = `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Alpha Vantage API error: ${response.status}`);
  }

  const data: AlphaVantageQuote = await response.json();

  // Check for rate limit or error
  if (!data['Global Quote'] || Object.keys(data['Global Quote']).length === 0) {
    throw new Error('No data returned - may have hit rate limit');
  }

  const quote = data['Global Quote'];

  return {
    symbol: quote['01. symbol'],
    price: parseFloat(quote['05. price']),
    change: parseFloat(quote['09. change']),
    changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
    volume: parseInt(quote['06. volume']),
    timestamp: quote['07. latest trading day'],
  };
}

// Batch fetch with rate limiting
export async function getMultipleQuotes(symbols: string[]): Promise<StockQuote[]> {
  const quotes: StockQuote[] = [];

  for (const symbol of symbols) {
    try {
      const quote = await getStockQuote(symbol);
      quotes.push(quote);
      // Rate limit: wait 12 seconds between calls (5 calls/min on free tier)
      await new Promise(resolve => setTimeout(resolve, 12000));
    } catch (error) {
      console.error(`Failed to fetch ${symbol}:`, error);
    }
  }

  return quotes;
}

// Usage example:
// const quotes = await getMultipleQuotes(['SPY', 'QQQ', 'NVDA', 'AAPL', 'TSLA']);
```

### 8.2 CoinGecko - Cryptocurrency Prices (TypeScript)

```typescript
// /src/services/coinGecko.ts

const BASE_URL = 'https://api.coingecko.com/api/v3';

interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  lastUpdated: string;
}

interface CoinGeckoResponse {
  id: string;
  symbol: string;
  name: string;
  market_data: {
    current_price: { usd: number };
    price_change_percentage_24h: number;
    market_cap: { usd: number };
    total_volume: { usd: number };
  };
  last_updated: string;
}

// Map common symbols to CoinGecko IDs
const COIN_IDS: Record<string, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  SOL: 'solana',
  DOGE: 'dogecoin',
  ADA: 'cardano',
  XRP: 'ripple',
};

export async function getCryptoPrice(symbol: string): Promise<CryptoPrice> {
  const coinId = COIN_IDS[symbol.toUpperCase()] || symbol.toLowerCase();
  const url = `${BASE_URL}/coins/${coinId}?localization=false&tickers=false&community_data=false&developer_data=false`;

  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error('CoinGecko rate limit exceeded');
    }
    throw new Error(`CoinGecko API error: ${response.status}`);
  }

  const data: CoinGeckoResponse = await response.json();

  return {
    id: data.id,
    symbol: data.symbol.toUpperCase(),
    name: data.name,
    price: data.market_data.current_price.usd,
    change24h: data.market_data.price_change_percentage_24h,
    marketCap: data.market_data.market_cap.usd,
    volume24h: data.market_data.total_volume.usd,
    lastUpdated: data.last_updated,
  };
}

// Simpler endpoint for multiple prices
interface SimplePrice {
  usd: number;
  usd_24h_change: number;
}

export async function getMultipleCryptoPrices(
  symbols: string[]
): Promise<Record<string, CryptoPrice>> {
  const ids = symbols.map(s => COIN_IDS[s.toUpperCase()] || s.toLowerCase()).join(',');
  const url = `${BASE_URL}/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`CoinGecko API error: ${response.status}`);
  }

  const data: Record<string, SimplePrice> = await response.json();

  const result: Record<string, CryptoPrice> = {};

  for (const [id, price] of Object.entries(data)) {
    const symbol = Object.entries(COIN_IDS).find(([, v]) => v === id)?.[0] || id.toUpperCase();
    result[symbol] = {
      id,
      symbol,
      name: id,
      price: price.usd,
      change24h: price.usd_24h_change,
      marketCap: 0, // Not available in simple endpoint
      volume24h: 0,
      lastUpdated: new Date().toISOString(),
    };
  }

  return result;
}

// Usage example:
// const btc = await getCryptoPrice('BTC');
// const prices = await getMultipleCryptoPrices(['BTC', 'ETH', 'SOL']);
```

### 8.3 FRED API - Market Indices (TypeScript)

```typescript
// /src/services/fred.ts

const FRED_API_KEY = import.meta.env.VITE_FRED_API_KEY;
const BASE_URL = 'https://api.stlouisfed.org/fred';

interface FREDObservation {
  date: string;
  value: string;
}

interface FREDResponse {
  observations: FREDObservation[];
}

interface MarketIndex {
  seriesId: string;
  name: string;
  value: number;
  date: string;
  change?: number;
}

// Key series for PULSE
export const FRED_SERIES = {
  VIX: 'VIXCLS',
  TREASURY_10Y: 'DGS10',
  TREASURY_2Y: 'DGS2',
  YIELD_SPREAD: 'T10Y2Y',
  DOLLAR_INDEX: 'DTWEXBGS', // Trade-weighted dollar index
  FED_FUNDS: 'FEDFUNDS',
  UNEMPLOYMENT: 'UNRATE',
  CPI: 'CPIAUCSL',
  GDP: 'GDP',
};

export async function getFREDSeries(
  seriesId: string,
  limit: number = 2
): Promise<MarketIndex> {
  const url = `${BASE_URL}/series/observations?series_id=${seriesId}&api_key=${FRED_API_KEY}&file_type=json&sort_order=desc&limit=${limit}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`FRED API error: ${response.status}`);
  }

  const data: FREDResponse = await response.json();

  if (!data.observations || data.observations.length === 0) {
    throw new Error(`No data for series ${seriesId}`);
  }

  const latest = data.observations[0];
  const previous = data.observations[1];

  const currentValue = parseFloat(latest.value);
  const previousValue = previous ? parseFloat(previous.value) : undefined;

  return {
    seriesId,
    name: getSeriesName(seriesId),
    value: currentValue,
    date: latest.date,
    change: previousValue ? currentValue - previousValue : undefined,
  };
}

function getSeriesName(seriesId: string): string {
  const names: Record<string, string> = {
    VIXCLS: 'VIX Volatility Index',
    DGS10: '10-Year Treasury Yield',
    DGS2: '2-Year Treasury Yield',
    T10Y2Y: '10Y-2Y Yield Spread',
    DTWEXBGS: 'Trade-Weighted Dollar Index',
    FEDFUNDS: 'Federal Funds Rate',
    UNRATE: 'Unemployment Rate',
    CPIAUCSL: 'Consumer Price Index',
    GDP: 'Gross Domestic Product',
  };
  return names[seriesId] || seriesId;
}

// Get multiple indices efficiently
export async function getMarketIndices(): Promise<MarketIndex[]> {
  const seriesToFetch = [
    FRED_SERIES.VIX,
    FRED_SERIES.TREASURY_10Y,
    FRED_SERIES.TREASURY_2Y,
    FRED_SERIES.YIELD_SPREAD,
    FRED_SERIES.DOLLAR_INDEX,
  ];

  const results: MarketIndex[] = [];

  for (const series of seriesToFetch) {
    try {
      const index = await getFREDSeries(series);
      results.push(index);
      // FRED allows 120 req/min, but be conservative
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`Failed to fetch ${series}:`, error);
    }
  }

  return results;
}

// Get historical data for charts
export async function getFREDHistory(
  seriesId: string,
  startDate: string,
  endDate?: string
): Promise<{ date: string; value: number }[]> {
  const end = endDate || new Date().toISOString().split('T')[0];
  const url = `${BASE_URL}/series/observations?series_id=${seriesId}&api_key=${FRED_API_KEY}&file_type=json&observation_start=${startDate}&observation_end=${end}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`FRED API error: ${response.status}`);
  }

  const data: FREDResponse = await response.json();

  return data.observations
    .filter(obs => obs.value !== '.')
    .map(obs => ({
      date: obs.date,
      value: parseFloat(obs.value),
    }));
}

// Usage examples:
// const vix = await getFREDSeries(FRED_SERIES.VIX);
// const indices = await getMarketIndices();
// const vixHistory = await getFREDHistory('VIXCLS', '2024-01-01');
```

### 8.4 Unified Data Service (TypeScript)

```typescript
// /src/services/marketData.ts
// Unified service combining all data sources

import { getStockQuote, getMultipleQuotes } from './alphaVantage';
import { getCryptoPrice, getMultipleCryptoPrices } from './coinGecko';
import { getFREDSeries, getMarketIndices, FRED_SERIES } from './fred';

export interface PULSEMarketData {
  stocks: {
    symbol: string;
    price: number;
    change: number;
    changePercent: number;
  }[];
  crypto: {
    symbol: string;
    price: number;
    change24h: number;
  }[];
  indices: {
    name: string;
    value: number;
    change?: number;
  }[];
  lastUpdated: string;
}

// Cache to minimize API calls
let cachedData: PULSEMarketData | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getPULSEMarketData(): Promise<PULSEMarketData> {
  const now = Date.now();

  // Return cached data if fresh
  if (cachedData && (now - cacheTimestamp) < CACHE_DURATION) {
    return cachedData;
  }

  try {
    // Fetch all data in parallel where possible
    const [cryptoPrices, indices] = await Promise.all([
      getMultipleCryptoPrices(['BTC', 'ETH', 'SOL']),
      getMarketIndices(),
    ]);

    // Stock quotes need rate limiting, so fetch serially
    // Consider using cached stock data or reducing frequency
    const stockSymbols = ['SPY', 'QQQ'];
    const stocks = [];

    for (const symbol of stockSymbols) {
      try {
        const quote = await getStockQuote(symbol);
        stocks.push({
          symbol: quote.symbol,
          price: quote.price,
          change: quote.change,
          changePercent: quote.changePercent,
        });
        await new Promise(r => setTimeout(r, 12000)); // Rate limit
      } catch (e) {
        console.error(`Failed to fetch ${symbol}`, e);
      }
    }

    cachedData = {
      stocks,
      crypto: Object.values(cryptoPrices).map(c => ({
        symbol: c.symbol,
        price: c.price,
        change24h: c.change24h,
      })),
      indices: indices.map(i => ({
        name: i.name,
        value: i.value,
        change: i.change,
      })),
      lastUpdated: new Date().toISOString(),
    };

    cacheTimestamp = now;
    return cachedData;

  } catch (error) {
    console.error('Failed to fetch market data:', error);
    throw error;
  }
}

// Environment variables needed:
// VITE_ALPHA_VANTAGE_API_KEY=your_key_here
// VITE_FRED_API_KEY=your_key_here
```

---

## 9. Rate Limit Summary

### 9.1 Complete Rate Limit Reference

| API | Free Tier Limit | Daily Limit | Notes |
|-----|----------------|-------------|-------|
| **Alpha Vantage** | 5/min | 25/day | Reduced in 2024 |
| **CoinGecko** | 30/min | 10,000/month | No auth for basic |
| **FRED** | 120/min | Unlimited | Best free tier |
| **Finnhub** | 60/min | ~1000 | Good for news |
| **FMP** | 5/min | 250/day | Sector data |
| **Yahoo (yfinance)** | ~100/hour | Varies | Unofficial, may block |
| **Polygon.io** | 5/min | Unlimited | Very limited data |
| **Binance** | 1200/min | Unlimited | Public endpoints |

### 9.2 Recommended API Call Strategy

```
Morning Update (6 AM EST):
- FRED indices: 5 calls
- CoinGecko crypto: 3 calls
- Alpha Vantage stocks: 5 calls (spread over 1 minute)
- Total: 13 calls

Hourly Updates (Market Hours):
- CoinGecko crypto: 3 calls
- FRED selected series: 2 calls
- Total: 5 calls/hour

End of Day (4 PM EST):
- Alpha Vantage all watchlist: 10 calls
- FMP sector performance: 1 call
- Total: 11 calls
```

---

## 10. Final Recommendations

### 10.1 Primary Stack for PULSE

1. **Stock Prices**: Alpha Vantage (free tier with caching)
   - Fallback: Yahoo Finance via yfinance (Python) or manual refresh

2. **Crypto Prices**: CoinGecko
   - Backup: Binance public API for real-time

3. **Market Indices (VIX, 10Y, DXY)**: FRED API
   - Most reliable, government-backed
   - Get API key: https://fred.stlouisfed.org/docs/api/api_key.html

4. **News & Sentiment**: Alpha Vantage News API
   - Backup: Finnhub (60 calls/min)

5. **Sector Performance**: FMP
   - Alternative: Track sector ETFs (XLK, XLF, etc.) via stock API

6. **Options Flow**: Unusual Whales free page
   - Note: True real-time flow requires paid service

### 10.2 Implementation Priority

```
Phase 1 - Core Data (Week 1):
[x] Set up FRED API for VIX, 10Y, DXY
[x] Implement CoinGecko for BTC, ETH, SOL
[x] Basic Alpha Vantage for SPY, QQQ

Phase 2 - Extended Data (Week 2):
[ ] Add sector performance via FMP
[ ] Implement news feed with sentiment
[ ] Cache layer with 5-minute refresh

Phase 3 - Advanced (Week 3):
[ ] Options flow display (delayed data)
[ ] Historical data for charts
[ ] Real-time WebSocket for crypto
```

### 10.3 Environment Variables Required

```env
# .env.local
VITE_ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key
VITE_FRED_API_KEY=your_fred_key
VITE_FMP_API_KEY=your_fmp_key
VITE_FINNHUB_API_KEY=your_finnhub_key
```

### 10.4 Cost Analysis (If Upgrading)

If free tiers become insufficient:

| Service | Plan | Cost | Value |
|---------|------|------|-------|
| Alpha Vantage Premium | Premium | $49.99/mo | 800 calls/day |
| CoinGecko Analyst | Pro | $129/mo | Higher limits |
| Polygon.io Starter | Starter | $29/mo | Real-time US equities |
| Unusual Whales | Standard | $50/mo | Real-time options flow |

**Total for "pro" data stack**: ~$250-300/month

---

## Sources

### Stock Market APIs
- [Alpha Vantage](https://www.alphavantage.co/)
- [yfinance Library](https://pypi.org/project/yfinance/)
- [Polygon.io / Massive](https://polygon.io/)
- [Finnhub](https://finnhub.io/)
- [Best Financial APIs for 2025 - Medium](https://medium.com/coinmonks/the-7-best-financial-apis-for-investors-and-developers-in-2025-in-depth-analysis-and-comparison-adbc22024f68)
- [Best Free Finance APIs - Note API Connector](https://noteapiconnector.com/best-free-finance-apis)

### Cryptocurrency APIs
- [CoinGecko API](https://www.coingecko.com/en/api)
- [CoinGecko API Documentation](https://docs.coingecko.com/)
- [CoinCap API](https://docs.coincap.io/)
- [Best Cryptocurrency APIs 2025 - CoinGecko](https://www.coingecko.com/learn/best-cryptocurrency-apis)

### Economic Data APIs
- [FRED API Documentation](https://fred.stlouisfed.org/docs/api/fred/)
- [VIX Index on FRED](https://fred.stlouisfed.org/series/VIXCLS)
- [10-Year Treasury on FRED](https://fred.stlouisfed.org/series/DGS10)
- [fredapi Python Library](https://pypi.org/project/fredapi/)

### News and Sentiment APIs
- [Alpha Vantage News API](https://www.alphavantage.co/)
- [Finnhub News Sentiment](https://finnhub.io/docs/api/news-sentiment)
- [Financial Modeling Prep](https://site.financialmodelingprep.com/developer/docs)
- [Marketaux](https://www.marketaux.com/)

### Options Flow
- [Unusual Whales Free Flow](https://unusualwhales.com/live-options-flow/free)
- [OptionStrat Flow](https://optionstrat.com/flow)
- [Barchart Options](https://www.barchart.com/options/unusual-activity)

### Sector Performance
- [FMP Sector Performance API](https://site.financialmodelingprep.com/developer/docs/stock-market-sector-performance-free-api)
- [Finnhub ETF Sector Exposure](https://finnhub.io/docs/api/etfs-sector-exposure)
- [State Street Sector Tracker](https://www.ssga.com/us/en/intermediary/resources/sector-tracker)

### Legal and Compliance
- [Is Web Scraping Legal in 2025 - Browserless](https://www.browserless.io/blog/is-web-scraping-legal)
- [Web Scraping Legal Guide - PromptCloud](https://www.promptcloud.com/blog/is-web-scraping-legal/)
- [yfinance Legal Considerations](https://algotrading101.com/learn/yfinance-guide/)

---

*Report generated by Financial Data Research Agent*
*Last updated: 2025-12-24*
