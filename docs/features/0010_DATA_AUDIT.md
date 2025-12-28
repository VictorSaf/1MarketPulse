# Dashboard Data Audit Report

**Feature ID**: 0010-AUDIT
**Date**: 2025-12-28
**Purpose**: Classification of all Dashboard components as Real Data, Mock/Demo Data, or Session Data

---

## Executive Summary

| Category | Count | Percentage |
|----------|-------|------------|
| **Real Data** | 7 | 26% |
| **Mock/Demo Data** | 16 | 59% |
| **Session Data** | 2 | 7% |
| **Calculator/Tool** | 2 | 7% |
| **Total Components** | 27 | 100% |

---

## Classification Details

### REAL DATA (Live API Integration)

These components fetch real market data from external APIs:

| Component | Data Source | Hook/API Used |
|-----------|-------------|---------------|
| **Dashboard.tsx** (Market Cards) | Finnhub, CoinGecko | `useStockQuote`, `useCryptoPrice`, `useFearGreed` |
| **QuickPulse.tsx** | Finnhub, Fear & Greed | `useStockQuote('SPY')`, `useFearGreed()` |
| **MorningBrief.tsx** | Finnhub + Ollama AI | `useStockQuote`, `useFearGreed`, AI analysis |
| **NewsFeed.tsx** | News API | `useMarketNews()` |
| **EconomicCalendar.tsx** | Real API | Calendar events API |
| **MarketHeartbeat.tsx** | Fear & Greed Index | `useFearGreed()` - BPM calculated from F&G score |
| **MarketWeather.tsx** | Fear & Greed Index | `useFearGreed()` - Weather derived from market sentiment |

**Note**: Dashboard fetches SPY, BTC, EWJ, GLD real prices for the Market Overview cards.

---

### MOCK/DEMO DATA (Hardcoded Static Data)

These components display hardcoded data for demonstration purposes:

| Component | Data Type | Recommendation |
|-----------|-----------|----------------|
| **MarketPersonas.tsx** | Hardcoded personas, activity feed, community stats (12,847 traders, etc.) | Add "Demo" badge |
| **TimeCrystals.tsx** | Hardcoded time slots, weekly/monthly energy patterns | Add "Demo" badge |
| **RiskCompass.tsx** | Hardcoded compass inputs, risk meter | Add "Demo" badge |
| **DailyChallenges.tsx** | Hardcoded challenges | Already has "Demo" badge |
| **KnowledgeTree.tsx** | Hardcoded skill tree (static XP: 1847, static node statuses) | Add "Demo" badge |
| **VocabularyBuilder.tsx** | Hardcoded vocabulary terms (6 terms) | Add "Demo" badge |
| **SocialTribes.tsx** | Hardcoded tribes (4), members (2847-4521), activity feed | Add "Demo" badge |
| **AchievementStories.tsx** | Hardcoded achievements (5 achievements) | Add "Demo" badge |
| **MarketMatrix.tsx** | Hardcoded assets (6) and correlations (6 pairs) | Add "Demo" badge |
| **ComparisonEngine.tsx** | Hardcoded stock database (NVDA, AMD, INTC only) | Add "Demo" badge |
| **MarketDNA.tsx** | Hardcoded DNA components, genetic matches | Add "Demo" badge |
| **SignalStories.tsx** | Hardcoded signal stories | Add "Demo" badge |
| **PatternArchaeology.tsx** | Hardcoded historical patterns | Add "Demo" badge |
| **MarketMoodRing.tsx** | Hardcoded mood data | Add "Demo" badge |
| **MarketOrchestra.tsx** | Hardcoded orchestra data | Add "Demo" badge |
| **DominoEffectTracker.tsx** | Hardcoded domino effects | Add "Demo" badge |

---

### SESSION DATA (Ephemeral, resets on refresh)

| Component | Behavior |
|-----------|----------|
| **EngagementStats.tsx** | Starts at 0, tracks session engagement (already marked "Session Data") |
| **FlowTracker.tsx** | Session-based flow tracking |

---

### CALCULATOR/TOOLS (User Input Based)

These are interactive tools that don't need real data:

| Component | Purpose |
|-----------|---------|
| **PositionBuilder.tsx** | Position sizing calculator - uses user inputs, saves to paper portfolio |
| **TradingTarot.tsx** | Educational trading cards |

---

## Hardcoded Values Found

### MarketPersonas.tsx
```typescript
// Hardcoded community stats
<div className="text-2xl font-bold text-blue-400 mb-1">12,847</div>  // Traders Online
<div className="text-2xl font-bold text-green-400 mb-1">72%</div>    // Community Bullish
```

### KnowledgeTree.tsx
```typescript
const currentXP = 1847;  // Hardcoded XP
const skillTree: SkillNode[] = [...]  // Static skill statuses
```

### SocialTribes.tsx
```typescript
const tribes: Tribe[] = [
  { name: 'NVDA Hunters', members: 2847, ... },
  { name: 'Crypto Warriors', members: 4521, ... },
  // etc.
];
```

### ComparisonEngine.tsx
```typescript
const stockDatabase: StockData[] = [
  { symbol: 'NVDA', price: 481.5, ... },  // Hardcoded price
  { symbol: 'AMD', price: 142.3, ... },
  { symbol: 'INTC', price: 44.8, ... },
];
```

---

## Recommendations

### Priority 1: Add "Demo" Badges to Mock Components

Add a visible "Demo" badge to all mock data components so users understand the data is for demonstration purposes.

**Badge Component Example:**
```tsx
<Badge className="bg-amber-500/20 text-amber-400 border-amber-400/30">
  Demo Data
</Badge>
```

**Components to Update:**
1. MarketPersonas.tsx
2. TimeCrystals.tsx
3. RiskCompass.tsx
4. KnowledgeTree.tsx
5. VocabularyBuilder.tsx
6. SocialTribes.tsx
7. AchievementStories.tsx
8. MarketMatrix.tsx
9. ComparisonEngine.tsx
10. MarketDNA.tsx
11. SignalStories.tsx
12. PatternArchaeology.tsx
13. MarketMoodRing.tsx
14. MarketOrchestra.tsx
15. DominoEffectTracker.tsx

### Priority 2: Future Real Data Integration

For production, consider integrating real data for:
- **ComparisonEngine** - Fetch real stock prices from Finnhub
- **MarketMatrix** - Calculate real correlations from price history
- **SocialTribes** - Connect to actual user database
- **KnowledgeTree** - Connect to user progress system

### Priority 3: Clear Data Source Indicators

Each component should display its data source:
- "Live Data" badge for real API data
- "Demo Data" badge for hardcoded data
- "AI Analysis" badge for AI-generated content

---

## Verification

Run these checks to verify data sources:

1. **Real Data Test**: Disable Finnhub API key → Market cards should show "Loading..." or error
2. **Mock Data Test**: Mock data components should always display the same values
3. **Session Data Test**: Refresh page → EngagementStats should reset to 0

---

## Files Reference

### Real Data Components
- `src/app/pages/Dashboard.tsx:89-93` - Market data hooks
- `src/app/components/QuickPulse.tsx` - SPY and Fear&Greed
- `src/app/components/MorningBrief.tsx` - Market + AI
- `src/app/components/NewsFeed.tsx` - News API
- `src/app/components/MarketHeartbeat.tsx:62` - `useFearGreed()`
- `src/app/components/MarketWeather.tsx:6` - `useFearGreed()`

### Mock Data Components (need Demo badges)
- `src/app/components/MarketPersonas.tsx`
- `src/app/components/TimeCrystals.tsx`
- `src/app/components/RiskCompass.tsx`
- `src/app/components/KnowledgeTree.tsx`
- `src/app/components/VocabularyBuilder.tsx`
- `src/app/components/SocialTribes.tsx`
- `src/app/components/AchievementStories.tsx`
- `src/app/components/MarketMatrix.tsx`
- `src/app/components/ComparisonEngine.tsx`
- `src/app/components/MarketDNA.tsx`

---

**Audit Complete**: 2025-12-28
