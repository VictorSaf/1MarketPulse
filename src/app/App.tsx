import { useState, lazy, Suspense } from 'react';
import { Menu, Bell, Settings, Brain, Heart, Cloud, Zap, Target } from 'lucide-react';

// Eager imports - Overview tab components (critical for first paint)
import { DailyScoreCard } from './components/DailyScoreCard';
import { QuickPulse } from './components/QuickPulse';
import { MorningBrief } from './components/MorningBrief';
import { MarketCard } from './components/MarketCard';
import { NewsFeed } from './components/NewsFeed';
import { EngagementStats } from './components/EngagementStats';
import { EconomicCalendar } from './components/EconomicCalendar';
import { LastUpdateIndicator } from './components/LastUpdateIndicator';

// UI Components (small, always needed)
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Toaster } from './components/ui/sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';

// Error handling and loading states
import { ErrorBoundary } from './components/ErrorBoundary';
import { TabLoadingFallback } from './components/LoadingFallback';

// Lazy loaded components - Tab-specific (loaded on demand)
const MarketHeartbeat = lazy(() => import('./components/MarketHeartbeat').then(m => ({ default: m.MarketHeartbeat })));
const MarketWeather = lazy(() => import('./components/MarketWeather').then(m => ({ default: m.MarketWeather })));
const MarketDNA = lazy(() => import('./components/MarketDNA').then(m => ({ default: m.MarketDNA })));
const SignalStories = lazy(() => import('./components/SignalStories').then(m => ({ default: m.SignalStories })));
const PatternArchaeology = lazy(() => import('./components/PatternArchaeology').then(m => ({ default: m.PatternArchaeology })));

// Lazy loaded - Advanced tab components
const MarketMoodRing = lazy(() => import('./components/MarketMoodRing').then(m => ({ default: m.MarketMoodRing })));
const MarketOrchestra = lazy(() => import('./components/MarketOrchestra').then(m => ({ default: m.MarketOrchestra })));
const DominoEffectTracker = lazy(() => import('./components/DominoEffectTracker').then(m => ({ default: m.DominoEffectTracker })));
const FlowTracker = lazy(() => import('./components/FlowTracker').then(m => ({ default: m.FlowTracker })));
const TradingTarot = lazy(() => import('./components/TradingTarot').then(m => ({ default: m.TradingTarot })));
const MarketLayers = lazy(() => import('./components/MarketLayers').then(m => ({ default: m.MarketLayers })));

// Lazy loaded - Learning tab components
const KnowledgeTree = lazy(() => import('./components/KnowledgeTree').then(m => ({ default: m.KnowledgeTree })));
const VocabularyBuilder = lazy(() => import('./components/VocabularyBuilder').then(m => ({ default: m.VocabularyBuilder })));
const DailyChallenges = lazy(() => import('./components/DailyChallenges').then(m => ({ default: m.DailyChallenges })));
const AchievementStories = lazy(() => import('./components/AchievementStories').then(m => ({ default: m.AchievementStories })));

// Lazy loaded - Overview secondary components (lower priority)
const MarketPersonas = lazy(() => import('./components/MarketPersonas').then(m => ({ default: m.MarketPersonas })));
const TimeCrystals = lazy(() => import('./components/TimeCrystals').then(m => ({ default: m.TimeCrystals })));
const RiskCompass = lazy(() => import('./components/RiskCompass').then(m => ({ default: m.RiskCompass })));
const PositionBuilder = lazy(() => import('./components/PositionBuilder').then(m => ({ default: m.PositionBuilder })));
const MarketMatrix = lazy(() => import('./components/MarketMatrix').then(m => ({ default: m.MarketMatrix })));
const ComparisonEngine = lazy(() => import('./components/ComparisonEngine').then(m => ({ default: m.ComparisonEngine })));
const SocialTribes = lazy(() => import('./components/SocialTribes').then(m => ({ default: m.SocialTribes })));

// Mock Data
const quickPulseData = [
  { name: 'S&P 500', value: '4,783.45', change: 1.24, symbol: 'SPX' },
  { name: 'NASDAQ', value: '15,095.14', change: 2.18, symbol: 'IXIC' },
  { name: 'Bitcoin', value: '$43,256', change: -0.87, symbol: 'BTC-USD' },
  { name: 'Fear & Greed', value: '62', change: 5.2, symbol: 'Greed' }
];

const marketData = [
  {
    id: 'us-equities',
    name: 'US Equities',
    value: '$4,783',
    change: 1.24,
    sentiment: 'positive' as const,
    volume: '$142.5B',
    imageUrl: 'https://images.unsplash.com/photo-1651341050677-24dba59ce0fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdG9jayUyMG1hcmtldCUyMHRyYWRpbmd8ZW58MXx8fHwxNzY2MDY0MjkxfDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 'crypto',
    name: 'Cryptocurrency',
    value: '$43,256',
    change: -0.87,
    sentiment: 'negative' as const,
    volume: '$28.3B',
    imageUrl: 'https://images.unsplash.com/photo-1659010878130-ae8b703bd3ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcnlwdG9jdXJyZW5jeSUyMGJpdGNvaW58ZW58MXx8fHwxNzY2MTQ3Njk5fDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 'global',
    name: 'Global Markets',
    value: '7,542',
    change: 0.56,
    sentiment: 'neutral' as const,
    volume: '$89.1B',
    imageUrl: 'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnbG9iYWwlMjBlY29ub215fGVufDF8fHx8MTc2NjE2MTUyM3ww&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 'commodities',
    name: 'Commodities',
    value: '$2,053',
    change: 1.87,
    sentiment: 'positive' as const,
    volume: '$12.7B',
    imageUrl: 'https://images.unsplash.com/photo-1608222351212-18fe0ec7b13b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGFuYWx5dGljc3xlbnwxfHx8fDE3NjYxMDI2Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080'
  }
];

const newsData = [
  {
    id: '1',
    title: 'Fed Signals Potential Rate Cut in Q2 2025 Amid Inflation Cooldown',
    source: 'Reuters',
    timeAgo: '15m ago',
    sentiment: 'bullish' as const,
    category: 'Economics'
  },
  {
    id: '2',
    title: 'Tech Giants Rally on Strong Q4 Earnings Reports',
    source: 'Bloomberg',
    timeAgo: '1h ago',
    sentiment: 'bullish' as const,
    category: 'Technology'
  },
  {
    id: '3',
    title: 'Oil Prices Drop 3% on Oversupply Concerns',
    source: 'CNBC',
    timeAgo: '2h ago',
    sentiment: 'bearish' as const,
    category: 'Commodities'
  },
  {
    id: '4',
    title: 'Bitcoin ETF Sees Record Inflows Despite Price Volatility',
    source: 'CoinDesk',
    timeAgo: '3h ago',
    sentiment: 'neutral' as const,
    category: 'Crypto'
  },
  {
    id: '5',
    title: 'European Markets Mixed Ahead of ECB Decision',
    source: 'Financial Times',
    timeAgo: '4h ago',
    sentiment: 'neutral' as const,
    category: 'Global Markets'
  }
];

const calendarEvents = [
  {
    id: '1',
    time: '14:30',
    event: 'US Non-Farm Payrolls',
    impact: 'high' as const,
    country: 'USD',
    previous: '216K',
    forecast: '180K'
  },
  {
    id: '2',
    time: '15:00',
    event: 'ISM Manufacturing PMI',
    impact: 'high' as const,
    country: 'USD',
    previous: '47.4',
    forecast: '48.0'
  },
  {
    id: '3',
    time: '16:00',
    event: 'Fed Chair Powell Speech',
    impact: 'high' as const,
    country: 'USD',
    previous: '-',
    forecast: '-'
  },
  {
    id: '4',
    time: '10:00',
    event: 'German Factory Orders',
    impact: 'medium' as const,
    country: 'EUR',
    previous: '-3.7%',
    forecast: '0.5%'
  },
  {
    id: '5',
    time: '11:30',
    event: 'UK Services PMI',
    impact: 'medium' as const,
    country: 'GBP',
    previous: '53.4',
    forecast: '53.8'
  }
];

export default function App() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <Toaster />

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-gray-900/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-white hover:bg-white/10"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    1MarketHood PULSE
                  </h1>
                  <p className="text-xs text-gray-400 hidden sm:block">Your Smart Market Companion</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge className="hidden sm:flex bg-purple-500/20 text-purple-300 border-purple-400/30">
                Active Learner
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10 relative"
                onClick={() => setShowNotifications(!showNotifications)}
                aria-label="View notifications"
                aria-expanded={showNotifications}
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
                aria-label="Open settings"
              >
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Engagement Stats */}
        <div className="mb-8">
          <EngagementStats
            streak={7}
            level={12}
            xp={1847}
            xpToNextLevel={2500}
            achievements={24}
          />
        </div>

        {/* Last Update Indicator */}
        <div className="mb-6">
          <LastUpdateIndicator />
        </div>

        {/* Main Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-8 lg:w-auto lg:inline-grid bg-gray-800/50 border border-white/10 gap-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-500/20">
              <Brain className="w-4 h-4 mr-2" />
              <span className="hidden md:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="heartbeat" className="data-[state=active]:bg-red-500/20">
              <Heart className="w-4 h-4 mr-2" />
              <span className="hidden md:inline">Heartbeat</span>
            </TabsTrigger>
            <TabsTrigger value="weather" className="data-[state=active]:bg-yellow-500/20">
              <Cloud className="w-4 h-4 mr-2" />
              <span className="hidden md:inline">Weather</span>
            </TabsTrigger>
            <TabsTrigger value="dna" className="data-[state=active]:bg-purple-500/20">
              🧬 <span className="hidden md:inline ml-2">DNA</span>
            </TabsTrigger>
            <TabsTrigger value="stories" className="data-[state=active]:bg-blue-500/20">
              📖 <span className="hidden md:inline ml-2">Stories</span>
            </TabsTrigger>
            <TabsTrigger value="patterns" className="data-[state=active]:bg-orange-500/20">
              🏺 <span className="hidden md:inline ml-2">Patterns</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="data-[state=active]:bg-green-500/20">
              <Zap className="w-4 h-4 mr-2" />
              <span className="hidden md:inline">Advanced</span>
            </TabsTrigger>
            <TabsTrigger value="learning" className="data-[state=active]:bg-indigo-500/20">
              <Target className="w-4 h-4 mr-2" />
              <span className="hidden md:inline">Learning</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab - Eager loaded critical components */}
          <TabsContent value="overview" className="space-y-8 mt-6">
            {/* Daily Score - Critical first paint */}
            <DailyScoreCard
              score={73}
              change={4.2}
              mood="bullish"
              summary="Markets showing strong bullish momentum. Tech sector leading gains with positive earnings surprises. Fed signals supportive monetary policy. Overall sentiment remains optimistic heading into the weekend."
            />

            {/* Quick Pulse - Critical first paint */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-4">Quick Pulse</h2>
              <QuickPulse metrics={quickPulseData} />
            </div>

            {/* Morning Brief - Critical first paint */}
            <MorningBrief
              persona="Active Learner"
              highlights={[
                'Fed Chair Powell hinted at rate cuts in Q2, boosting market sentiment',
                'Tech earnings beat expectations with Apple and Microsoft reporting strong growth',
                'Bitcoin ETF inflows hit $1.2B this week despite price consolidation',
                'EU inflation data came in lower than expected, supporting ECB policy shift'
              ]}
              aiSummary="Good morning! Today's markets are poised for continued strength. The Fed's dovish tone has energized investors, while tech earnings are exceeding expectations. Your watchlist shows 3 potential entry points based on your trading preferences. Remember to check the economic calendar - NFP data at 14:30 could create volatility."
            />

            {/* Lazy loaded secondary components */}
            <ErrorBoundary>
              <Suspense fallback={<TabLoadingFallback />}>
                <MarketPersonas />
              </Suspense>
            </ErrorBoundary>

            <ErrorBoundary>
              <Suspense fallback={<TabLoadingFallback />}>
                <DailyChallenges />
              </Suspense>
            </ErrorBoundary>

            <ErrorBoundary>
              <Suspense fallback={<TabLoadingFallback />}>
                <TimeCrystals />
              </Suspense>
            </ErrorBoundary>

            <ErrorBoundary>
              <Suspense fallback={<TabLoadingFallback />}>
                <RiskCompass />
              </Suspense>
            </ErrorBoundary>

            <ErrorBoundary>
              <Suspense fallback={<TabLoadingFallback />}>
                <PositionBuilder />
              </Suspense>
            </ErrorBoundary>

            <ErrorBoundary>
              <Suspense fallback={<TabLoadingFallback />}>
                <KnowledgeTree />
              </Suspense>
            </ErrorBoundary>

            <ErrorBoundary>
              <Suspense fallback={<TabLoadingFallback />}>
                <VocabularyBuilder />
              </Suspense>
            </ErrorBoundary>

            <ErrorBoundary>
              <Suspense fallback={<TabLoadingFallback />}>
                <MarketMatrix />
              </Suspense>
            </ErrorBoundary>

            <ErrorBoundary>
              <Suspense fallback={<TabLoadingFallback />}>
                <ComparisonEngine />
              </Suspense>
            </ErrorBoundary>

            <ErrorBoundary>
              <Suspense fallback={<TabLoadingFallback />}>
                <SocialTribes />
              </Suspense>
            </ErrorBoundary>

            <ErrorBoundary>
              <Suspense fallback={<TabLoadingFallback />}>
                <AchievementStories />
              </Suspense>
            </ErrorBoundary>

            {/* Market Overview - Eager loaded */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-4">Market Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {marketData.map((market) => (
                  <MarketCard key={market.id} {...market} />
                ))}
              </div>
            </div>

            {/* News Feed & Calendar - Eager loaded */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <NewsFeed news={newsData} />
              <EconomicCalendar events={calendarEvents} />
            </div>
          </TabsContent>

          {/* Heartbeat Tab - Lazy loaded */}
          <TabsContent value="heartbeat" className="mt-6">
            <ErrorBoundary>
              <Suspense fallback={<TabLoadingFallback />}>
                <MarketHeartbeat bpm={72} />
              </Suspense>
            </ErrorBoundary>
          </TabsContent>

          {/* Weather Tab - Lazy loaded */}
          <TabsContent value="weather" className="mt-6">
            <ErrorBoundary>
              <Suspense fallback={<TabLoadingFallback />}>
                <MarketWeather />
              </Suspense>
            </ErrorBoundary>
          </TabsContent>

          {/* DNA Tab - Lazy loaded */}
          <TabsContent value="dna" className="mt-6">
            <ErrorBoundary>
              <Suspense fallback={<TabLoadingFallback />}>
                <MarketDNA />
              </Suspense>
            </ErrorBoundary>
          </TabsContent>

          {/* Stories Tab - Lazy loaded */}
          <TabsContent value="stories" className="mt-6">
            <ErrorBoundary>
              <Suspense fallback={<TabLoadingFallback />}>
                <SignalStories />
              </Suspense>
            </ErrorBoundary>
          </TabsContent>

          {/* Patterns Tab - Lazy loaded */}
          <TabsContent value="patterns" className="mt-6">
            <ErrorBoundary>
              <Suspense fallback={<TabLoadingFallback />}>
                <PatternArchaeology />
              </Suspense>
            </ErrorBoundary>
          </TabsContent>

          {/* Advanced Tab - Lazy loaded */}
          <TabsContent value="advanced" className="space-y-8 mt-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                <Zap className="w-6 h-6 text-green-400" />
                Advanced Market Intelligence
              </h2>
              <p className="text-gray-400 mb-6">Deep market analysis and professional-grade tools</p>
            </div>

            <ErrorBoundary>
              <Suspense fallback={<TabLoadingFallback />}>
                <MarketMoodRing />
              </Suspense>
            </ErrorBoundary>

            <ErrorBoundary>
              <Suspense fallback={<TabLoadingFallback />}>
                <MarketOrchestra />
              </Suspense>
            </ErrorBoundary>

            <ErrorBoundary>
              <Suspense fallback={<TabLoadingFallback />}>
                <DominoEffectTracker />
              </Suspense>
            </ErrorBoundary>

            <ErrorBoundary>
              <Suspense fallback={<TabLoadingFallback />}>
                <FlowTracker />
              </Suspense>
            </ErrorBoundary>

            <ErrorBoundary>
              <Suspense fallback={<TabLoadingFallback />}>
                <TradingTarot />
              </Suspense>
            </ErrorBoundary>

            <ErrorBoundary>
              <Suspense fallback={<TabLoadingFallback />}>
                <MarketLayers />
              </Suspense>
            </ErrorBoundary>
          </TabsContent>

          {/* Learning Tab - Lazy loaded */}
          <TabsContent value="learning" className="space-y-8 mt-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                <Target className="w-6 h-6 text-indigo-400" />
                Learning Center
              </h2>
              <p className="text-gray-400 mb-6">Master the markets with our comprehensive education system</p>
            </div>

            <ErrorBoundary>
              <Suspense fallback={<TabLoadingFallback />}>
                <KnowledgeTree />
              </Suspense>
            </ErrorBoundary>

            <ErrorBoundary>
              <Suspense fallback={<TabLoadingFallback />}>
                <VocabularyBuilder />
              </Suspense>
            </ErrorBoundary>

            <ErrorBoundary>
              <Suspense fallback={<TabLoadingFallback />}>
                <DailyChallenges />
              </Suspense>
            </ErrorBoundary>

            <ErrorBoundary>
              <Suspense fallback={<TabLoadingFallback />}>
                <AchievementStories />
              </Suspense>
            </ErrorBoundary>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-400">
            <p>© 2025 1MarketHood PULSE - Your AI-Powered Market Intelligence Platform</p>
            <p className="mt-2 text-xs">Data updated every 15 minutes • AI Analysis powered by Llama 3.1</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
