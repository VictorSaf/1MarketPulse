# Feature: Convert Mock Data Components to Real Data

## Description

Convert 4 components from hardcoded mock data to real-time market data using existing React hooks. This implementation will integrate ComparisonEngine, MarketMatrix, MarketPersonas, and MarketMoodRing with live data sources (Finnhub, CoinGecko, CNN Fear & Greed) while maintaining the exact same UI/UX experience.

## Files to Change

### Modified Files

#### 1. `/src/app/components/ComparisonEngine.tsx`

**Current State:**
- Lines 14-72: Hardcoded `stockDatabase` array with NVDA ($481.50), AMD ($142.30), INTC ($44.80)
- Lines 77-82: `selectedStocks` state defaulting to ['NVDA', 'AMD', 'INTC']
- Lines 84-86: `compareData` maps from static database

**Changes Required:**
- Remove hardcoded `stockDatabase` constant
- Add `useStockQuote()` hook for each selected stock
- Transform real quote data to match `StockData` interface
- Add loading states while quotes fetch
- Add error handling for failed quote requests
- Maintain all existing UI/UX (table, rankings, summaries)

**New Imports:**
```typescript
import { useStockQuote } from '@/hooks';
import type { StockQuote } from '@/types';
```

**Data Transformation:**
```typescript
// Transform StockQuote → StockData
// Real data: price, changePercent from useStockQuote
// Calculated: ytd, oneYear (mock for now - Phase 2)
// Mock preserved: pe, peg, ps, rsi, vs50dma, moat, aiRevenue, marketShare
```

---

#### 2. `/src/app/components/MarketMatrix.tsx`

**Current State:**
- Lines 26-33: Hardcoded `assets` array with 6 assets (SPX +0.6%, NDX +0.9%, DXY -0.3%, GC +0.8%, BTC +3.2%, VIX -8.0%)
- Lines 35-42: Hardcoded `correlations` array with static correlation values

**Changes Required:**
- Use `useStockQuote(symbol)` for SPX, NDX, DXY, GC, VIX
- Use `useCryptoPrice('BTC')` for Bitcoin
- Replace hardcoded `change` values with real `changePercent` from hooks
- Preserve static correlation data (future enhancement: calculate real correlations)
- Add loading skeleton while data loads
- Handle errors gracefully with fallback UI

**New Imports:**
```typescript
import { useStockQuote, useCryptoPrice } from '@/hooks';
```

**Symbol Mapping:**
```typescript
// Stock symbols for Finnhub:
SPX → '^SPX' or 'SPY' (S&P 500)
NDX → '^NDX' or 'QQQ' (NASDAQ)
DXY → 'DXY' (Dollar Index)
GC → 'GC=F' (Gold futures)
VIX → '^VIX' (Volatility Index)

// Crypto for CoinGecko:
BTC → 'bitcoin'
```

---

#### 3. `/src/app/components/MarketPersonas.tsx`

**Current State:**
- Line 185: Hardcoded "72% Bullish" community sentiment
- Lines 17-76: `personas` array with hardcoded activity/direction data

**Changes Required:**
- Use `useFearGreed()` hook to get Fear & Greed Index score
- Transform F&G score to bullish percentage: `bullishPercent = score` (0-100 scale maps directly)
- Replace line 185: `72%` → `{data?.score ?? 72}%` (with fallback)
- Update `buyingPower` calculation: `const buyingPower = data?.score ?? 72;`
- Optionally: Derive RETAIL persona's bullish percentage from F&G score
- Add loading state for sentiment data
- Preserve all persona details and activity feed (mock data acceptable for initial release)

**New Imports:**
```typescript
import { useFearGreed } from '@/hooks';
```

**Data Mapping:**
```typescript
// CNN Fear & Greed Index → Community Sentiment
F&G Score 0-25 (Extreme Fear) → 20-30% Bullish
F&G Score 25-45 (Fear) → 30-45% Bullish
F&G Score 45-55 (Neutral) → 45-55% Bullish
F&G Score 55-75 (Greed) → 55-75% Bullish
F&G Score 75-100 (Extreme Greed) → 75-90% Bullish
```

---

#### 4. `/src/app/components/MarketMoodRing.tsx`

**Current State:**
- Lines 5-13: Hardcoded `mood` object with static emoji ('😌'), name ('Calm'), and metrics
- Lines 14-20: Static VIX (14.2), Volume ('Normal'), Trend ('Slight uptrend'), Sentiment ('Neutral-Bullish')

**Changes Required:**
- Use `useFearGreed()` hook to get real sentiment score
- Derive mood from F&G score instead of hardcoded values
- Map F&G score ranges to moods (Anxious, Uncertain, Calm, Confident, Euphoric)
- Use real VIX value (will add `useStockQuote('^VIX')` in Phase 2)
- For now: Use F&G score to derive all mood states
- Add loading state while fetching data

**New Imports:**
```typescript
import { useFearGreed } from '@/hooks';
```

**Mood Mapping:**
```typescript
// F&G Score → Mood State
0-25 (Extreme Fear) → { emoji: '😰', name: 'Anxious', sentiment: 'Extreme Fear' }
25-45 (Fear) → { emoji: '🤔', name: 'Uncertain', sentiment: 'Fear' }
45-55 (Neutral) → { emoji: '😌', name: 'Calm', sentiment: 'Neutral' }
55-75 (Greed) → { emoji: '😊', name: 'Confident', sentiment: 'Greed' }
75-100 (Extreme Greed) → { emoji: '🤩', name: 'Euphoric', sentiment: 'Extreme Greed' }
```

**VIX Integration (Phase 2):**
```typescript
// Will use useStockQuote('^VIX') to get real VIX value
// For now: Display F&G score as primary metric
```

---

## Implementation Details

### Phase 1: ComparisonEngine.tsx (Stocks Only)

**Step 1: Add Hooks for Selected Stocks**

Replace the hardcoded `stockDatabase` with dynamic hooks:

```typescript
// Current: const stockDatabase: StockData[] = [...]
// New:
const nvdaQuote = useStockQuote({ symbol: 'NVDA' });
const amdQuote = useStockQuote({ symbol: 'AMD' });
const intcQuote = useStockQuote({ symbol: 'INTC' });

// Create a mapping of quotes
const stockQuotes = {
  'NVDA': nvdaQuote,
  'AMD': amdQuote,
  'INTC': intcQuote
};
```

**Step 2: Transform Data Function**

Create helper to transform `StockQuote` → `StockData`:

```typescript
const transformToStockData = (
  symbol: string,
  quote: StockQuote | null,
  mockExtras: Partial<StockData>
): StockData | null => {
  if (!quote) return null;
  
  return {
    symbol,
    name: mockExtras.name || symbol,
    price: quote.price,
    change: quote.changePercent,
    // Performance metrics - calculate from real data if available
    ytd: mockExtras.ytd || 0,
    oneYear: mockExtras.oneYear || 0,
    threeYear: mockExtras.threeYear || 0,
    // Valuation - preserve mock data (no free API for fundamentals)
    pe: mockExtras.pe || 0,
    peg: mockExtras.peg || 0,
    ps: mockExtras.ps || 0,
    // Technical - calculate from quote data
    trend: quote.changePercent > 2 ? 'strong' : quote.changePercent > 0 ? 'moderate' : 'weak',
    rsi: mockExtras.rsi || 50,
    vs50dma: mockExtras.vs50dma || 0,
    // AI metrics - preserve mock data
    moat: mockExtras.moat || 50,
    aiRevenue: mockExtras.aiRevenue || 'N/A',
    marketShare: mockExtras.marketShare || 0
  };
};
```

**Step 3: Build Compare Data**

```typescript
const compareData = selectedStocks
  .map(symbol => {
    const quote = stockQuotes[symbol];
    const mockData = STOCK_MOCK_DATA[symbol] || {}; // Preserve PE, PEG, etc.
    return transformToStockData(symbol, quote.data, mockData);
  })
  .filter(Boolean) as StockData[];
```

**Step 4: Add Loading & Error States**

```typescript
const isLoading = selectedStocks.some(s => stockQuotes[s]?.loading);
const hasError = selectedStocks.some(s => stockQuotes[s]?.error);

if (isLoading) {
  return <ComparisonSkeleton stocks={selectedStocks} />;
}

if (hasError) {
  return <ErrorBanner message="Failed to load stock data" onRetry={refetchAll} />;
}
```

---

### Phase 2: MarketMatrix.tsx (Multi-Asset)

**Step 1: Add Hooks for All Assets**

```typescript
const spxQuote = useStockQuote({ symbol: 'SPY' }); // S&P 500 ETF
const ndxQuote = useStockQuote({ symbol: 'QQQ' }); // NASDAQ ETF
const dxyQuote = useStockQuote({ symbol: 'DXY' }); // Dollar Index
const goldQuote = useStockQuote({ symbol: 'GLD' }); // Gold ETF
const vixQuote = useStockQuote({ symbol: '^VIX' }); // Volatility
const btcPrice = useCryptoPrice({ symbol: 'bitcoin' }); // Bitcoin
```

**Step 2: Transform to Asset Interface**

```typescript
const buildAsset = (
  id: string,
  name: string,
  symbol: string,
  quote: StockQuote | null,
  cryptoPrice?: CryptoPrice | null
): Asset => {
  const change = cryptoPrice 
    ? cryptoPrice.changePercent24h 
    : quote?.changePercent || 0;
  
  return { id, name, symbol, change };
};

const assets: Asset[] = [
  buildAsset('spx', 'S&P 500', 'SPX', spxQuote.data),
  buildAsset('ndx', 'NASDAQ', 'NDX', ndxQuote.data),
  buildAsset('dxy', 'Dollar', 'DXY', dxyQuote.data),
  buildAsset('gold', 'Gold', 'GC', goldQuote.data),
  buildAsset('btc', 'Bitcoin', 'BTC', null, btcPrice.data),
  buildAsset('vix', 'VIX', 'VIX', vixQuote.data)
];
```

**Step 3: Preserve Correlation Data**

Keep the hardcoded `correlations` array unchanged (calculating real correlations requires historical data - future enhancement):

```typescript
// Keep static correlations for now
const correlations: Correlation[] = [
  { asset1: 'SPX', asset2: 'NDX', value: 0.92, strength: 'strong', type: 'positive' },
  // ... rest unchanged
];
```

**Step 4: Add Loading State**

```typescript
const isLoading = [spxQuote, ndxQuote, dxyQuote, goldQuote, vixQuote].some(q => q.loading) || btcPrice.loading;

if (isLoading) {
  return <MatrixLoadingSkeleton />;
}
```

---

### Phase 3: MarketPersonas.tsx (Sentiment-Driven)

**Step 1: Add Fear & Greed Hook**

```typescript
const { data: fearGreedData, loading: fgLoading, error: fgError } = useFearGreed();
```

**Step 2: Calculate Bullish Percentage**

```typescript
// Map F&G score (0-100) to realistic bullish percentage
const calculateBullishPercent = (score: number): number => {
  // Extreme Fear (0-25) → 20-30% bullish
  if (score < 25) return 20 + (score / 25) * 10;
  // Fear (25-45) → 30-45% bullish
  if (score < 45) return 30 + ((score - 25) / 20) * 15;
  // Neutral (45-55) → 45-55% bullish
  if (score < 55) return score;
  // Greed (55-75) → 55-75% bullish
  if (score < 75) return score;
  // Extreme Greed (75-100) → 75-90% bullish
  return 75 + ((score - 75) / 25) * 15;
};

const bullishPercent = fearGreedData 
  ? calculateBullishPercent(fearGreedData.score) 
  : 72; // Fallback

const buyingPower = Math.round(bullishPercent);
```

**Step 3: Update Community Stats Section**

Replace line 185 and update Power Balance section:

```typescript
// Line 185: Update Bullish stat
<div className="text-2xl font-bold text-green-400 mb-1">
  {fgLoading ? '...' : `${buyingPower}%`}
</div>

// Power Balance section
<div className="text-sm text-gray-400">
  Buyers {buyingPower}% | Sellers {100 - buyingPower}%
</div>
```

**Step 4: Optionally Update RETAIL Persona**

```typescript
// Update RETAIL persona details dynamically
const retailPersona = {
  ...personas[4], // RETAIL is index 4
  details: [
    `1MarketPulse community sentiment: ${buyingPower}% Bullish`,
    'Most watched: NVDA, TSLA, BTC',
    'Most traded: NVDA calls, SPY puts (hedging?)'
  ]
};
```

---

### Phase 4: MarketMoodRing.tsx (Fear & Greed Driven)

**Step 1: Add Fear & Greed Hook**

```typescript
const { data: fearGreedData, loading, error } = useFearGreed();
```

**Step 2: Create Mood Mapping Function**

```typescript
interface MoodState {
  emoji: string;
  name: string;
  description: string;
  metrics: {
    vix: number;
    volume: string;
    trend: string;
    sentiment: string;
  };
  recommendation: string;
}

const getMoodFromScore = (score: number): MoodState => {
  if (score < 25) {
    return {
      emoji: '😰',
      name: 'Anxious',
      description: 'Market is fearful and volatile',
      metrics: {
        vix: 30 + (25 - score) * 0.8, // Higher VIX when more fear
        volume: 'High',
        trend: 'Downtrend',
        sentiment: 'Extreme Fear'
      },
      recommendation: 'Wait for stability before entering positions'
    };
  } else if (score < 45) {
    return {
      emoji: '🤔',
      name: 'Uncertain',
      description: 'Market is cautious',
      metrics: {
        vix: 20 + (45 - score) * 0.5,
        volume: 'Above Average',
        trend: 'Mixed',
        sentiment: 'Fear'
      },
      recommendation: 'Good for defensive positions'
    };
  } else if (score < 55) {
    return {
      emoji: '😌',
      name: 'Calm',
      description: 'Market is breathing easily',
      metrics: {
        vix: 14 + Math.abs(50 - score) * 0.4,
        volume: 'Normal',
        trend: 'Slight uptrend',
        sentiment: 'Neutral'
      },
      recommendation: 'Good for new positions'
    };
  } else if (score < 75) {
    return {
      emoji: '😊',
      name: 'Confident',
      description: 'Market is optimistic',
      metrics: {
        vix: 12 + (75 - score) * 0.3,
        volume: 'Normal',
        trend: 'Uptrend',
        sentiment: 'Greed'
      },
      recommendation: 'Consider taking profits on winners'
    };
  } else {
    return {
      emoji: '🤩',
      name: 'Euphoric',
      description: 'Market is extremely bullish',
      metrics: {
        vix: 10 + (100 - score) * 0.2,
        volume: 'High',
        trend: 'Strong uptrend',
        sentiment: 'Extreme Greed'
      },
      recommendation: 'Be cautious - may be overbought'
    };
  }
};

const mood = fearGreedData 
  ? getMoodFromScore(fearGreedData.score) 
  : getMoodFromScore(50); // Neutral fallback
```

**Step 3: Replace Hardcoded Mood Object**

```typescript
// Remove lines 5-13 (hardcoded mood)
// Use dynamic mood from getMoodFromScore()
// Display VIX as calculated, not from real VIX (Phase 2 enhancement)
```

**Step 4: Add Loading State**

```typescript
if (loading) {
  return <MoodRingSkeleton />;
}
```

---

## Algorithm Details

### Fear & Greed to Bullish Percentage Conversion

The CNN Fear & Greed Index (0-100) represents market sentiment. We convert this to a "bullish percentage" using a non-linear mapping that reflects realistic trader behavior:

```
Input: Fear & Greed Score (0-100)
Output: Bullish Percentage (20-90%)

Mapping:
- Extreme Fear (0-25): Even in panic, 20-30% remain bullish (contrarians)
- Fear (25-45): 30-45% bullish (cautious buyers emerge)
- Neutral (45-55): 45-55% bullish (1:1 mapping)
- Greed (55-75): 55-75% bullish (1:1 mapping, most are bullish)
- Extreme Greed (75-100): 75-90% bullish (caps at 90% - some always cautious)

Formula:
if score < 25: bullish = 20 + (score / 25) * 10
else if score < 45: bullish = 30 + ((score - 25) / 20) * 15
else if score < 75: bullish = score
else: bullish = 75 + ((score - 75) / 25) * 15
```

### VIX to BPM (Already Implemented in MarketHeartbeat)

For reference, the existing MarketHeartbeat component uses:

```
Input: VIX (Volatility Index, typically 10-40, can spike to 80+)
Output: BPM (Beats Per Minute, 40-130+)

Formula: BPM = 40 + (VIX * 2)

Mapping:
- VIX 10 → 60 BPM (Calm)
- VIX 15 → 70 BPM (Normal)
- VIX 20 → 80 BPM (Alert)
- VIX 30 → 100 BPM (Excited)
- VIX 40 → 120 BPM (Panic)
```

### Fear & Greed to Mood Emoji

```
Input: F&G Score (0-100)
Output: { emoji, name, description, recommendation }

Ranges:
0-24: 😰 Anxious - Extreme fear, high VIX, wait for stability
25-44: 🤔 Uncertain - Fear, mixed trend, defensive positions
45-54: 😌 Calm - Neutral, normal volume, good for new positions
55-74: 😊 Confident - Greed, uptrend, consider profit-taking
75-100: 🤩 Euphoric - Extreme greed, strong uptrend, caution (overbought)
```

---

## Testing

### Manual Testing Checklist

**ComparisonEngine.tsx:**
- [ ] Load component - verify 3 stock quotes fetch (NVDA, AMD, INTC)
- [ ] Check prices are real-time (refresh every 15s)
- [ ] Verify change percentages are accurate (green for +, red for -)
- [ ] Confirm loading skeleton shows while fetching
- [ ] Test error state (disconnect network, should show error UI)
- [ ] Verify performance metrics (YTD, 1Y, 3Y) display
- [ ] Check valuation ratios (PE, PEG, PS) still show
- [ ] Confirm technical indicators (RSI, DMA) present
- [ ] Test ranking badges (🥇🥈🥉) assign correctly based on YTD
- [ ] Verify summary section updates with real data

**MarketMatrix.tsx:**
- [ ] Load component - verify 6 assets fetch (SPY, QQQ, DXY, GLD, VIX, BTC)
- [ ] Check all asset changes are real (positive/negative percentages)
- [ ] Verify BTC fetches from CoinGecko (crypto hook)
- [ ] Confirm network view displays all 6 nodes
- [ ] Test table view shows correlation data
- [ ] Verify loading state appears initially
- [ ] Test clicking assets highlights correlations
- [ ] Confirm correlation lines draw correctly
- [ ] Check legend displays correlation strengths
- [ ] Verify "Breaking" correlation alerts show

**MarketPersonas.tsx:**
- [ ] Load component - verify Fear & Greed fetches
- [ ] Check bullish percentage displays (should be ~20-90%)
- [ ] Verify Power Balance bar reflects bullish %
- [ ] Confirm community stats show calculated bullish %
- [ ] Test loading state for sentiment data
- [ ] Verify fallback to 72% if F&G fails
- [ ] Check all 5 personas display correctly
- [ ] Test clicking persona shows details
- [ ] Verify activity feed displays
- [ ] Confirm real-time activity section renders

**MarketMoodRing.tsx:**
- [ ] Load component - verify Fear & Greed fetches
- [ ] Check mood emoji matches F&G score range
- [ ] Verify mood name is correct (Anxious/Uncertain/Calm/Confident/Euphoric)
- [ ] Confirm description updates based on mood
- [ ] Test VIX metric displays calculated value
- [ ] Verify recommendation text changes per mood
- [ ] Check loading skeleton shows initially
- [ ] Test all 5 mood badges display
- [ ] Confirm sentiment metric matches F&G rating
- [ ] Verify volume/trend metrics update

### Data Accuracy Tests

**Real-Time Updates:**
- [ ] Prices update every 15s (stocks)
- [ ] Crypto prices update every 10s (BTC)
- [ ] Fear & Greed updates every 1hr
- [ ] Verify timestamps show correct last update time

**Error Recovery:**
- [ ] Network disconnect → fallback to cached data
- [ ] API rate limit → show stale data with indicator
- [ ] Invalid symbol → display error message
- [ ] Backend down → attempt fallback to direct API

**Cache Validation:**
- [ ] First load fetches from API
- [ ] Second load (within TTL) uses cache
- [ ] After TTL expires, refetches from API
- [ ] Cache key uniqueness per symbol/asset

### Performance Tests

- [ ] Component renders in <100ms (with cached data)
- [ ] All 4 components load simultaneously without blocking
- [ ] No memory leaks (check DevTools after 5min)
- [ ] No excessive re-renders (React DevTools Profiler)
- [ ] Polling doesn't hammer APIs (verify call frequency in Network tab)

---

## Future Enhancements (Out of Scope)

**ComparisonEngine:**
- Calculate real YTD/1Y/3Y from historical data
- Fetch real PE/PEG/PS ratios (requires paid API or web scraping)
- Calculate real RSI from price history
- Compute real 50-day moving average
- Fetch AI revenue from earnings transcripts

**MarketMatrix:**
- Calculate real-time correlations from historical data (requires time-series analysis)
- Add more asset classes (commodities, bonds, forex)
- Show breaking correlations based on deviation from historical norm
- Implement correlation strength alerts

**MarketPersonas:**
- Fetch real institutional flow data (requires Bloomberg/Refinitiv)
- Track real hedge fund positions (13F filings)
- Monitor real retail sentiment from trading platforms
- Add whale alert notifications (large block trades)

**MarketMoodRing:**
- Use real VIX instead of calculated VIX
- Add volume data from market APIs
- Calculate real trend from price action
- Historical mood evolution timeline

---

## Dependencies

**Existing Hooks (Already Implemented):**
- `useStockQuote` from `/src/hooks/useStockQuote.ts`
- `useCryptoPrice` from `/src/hooks/useCryptoPrice.ts`
- `useFearGreed` from `/src/hooks/useFearGreed.ts`

**Existing Types (Already Defined):**
- `StockQuote` from `/src/types/market.types.ts`
- `CryptoPrice` from `/src/types/crypto.types.ts`
- `FearGreedIndex` from `/src/services/sentiment/sentimentService.ts`

**Existing Services (Already Implemented):**
- `stockService` from `/src/services/market/stockService.ts`
- `cryptoService` from `/src/services/crypto/cryptoService.ts`
- `sentimentService` from `/src/services/sentiment/sentimentService.ts`

**No New Dependencies Required** - This is a pure integration task using existing infrastructure.

---

## Rollout Strategy

### Phase 1: ComparisonEngine (1 component)
- Lowest risk - single data source (stocks only)
- Validate hook integration pattern
- Test loading/error states
- Est. Time: 2-3 hours

### Phase 2: MarketMatrix (multi-source)
- Medium complexity - stocks + crypto
- Validate multi-hook coordination
- Test simultaneous API calls
- Est. Time: 2-3 hours

### Phase 3: MarketPersonas (sentiment)
- Low complexity - single hook, simple mapping
- Validate Fear & Greed integration
- Test percentage calculations
- Est. Time: 1-2 hours

### Phase 4: MarketMoodRing (derived states)
- Medium complexity - mood state machine
- Validate score-to-mood mapping
- Test all 5 mood states
- Est. Time: 1-2 hours

**Total Estimated Time:** 6-10 hours for all 4 components

---

## Success Criteria

- [ ] All 4 components display real-time data (no mock data visible)
- [ ] Loading states show gracefully during initial fetch
- [ ] Error states handle API failures without crashing
- [ ] Data refreshes at correct intervals (15s stocks, 10s crypto, 1hr F&G)
- [ ] UI/UX remains identical to mock versions (no visual changes)
- [ ] No console errors or warnings in production
- [ ] Performance remains <100ms render time
- [ ] Cache reduces API calls by 80%+
- [ ] Components work offline (show cached data)

---

## Notes

- **Preserve Mock Data Where Necessary**: Some metrics (PE ratios, AI revenue, market share) require paid APIs or complex calculations. Keep these as mock data with clear comments for future enhancement.
  
- **Graceful Degradation**: Always provide fallback values so components render even if APIs fail. Use cached data when available.

- **Consistent Patterns**: Follow the same hook integration pattern across all 4 components for maintainability.

- **No UI Changes**: This is a pure data integration task. The UI should look and behave identically, just with real data instead of hardcoded values.

- **Backend Integration**: All components will automatically benefit from the Phase 3.2 backend API server (port 3001) which handles API key security, caching, and rate limiting.

