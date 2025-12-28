/**
 * Dashboard Page (Main Application)
 *
 * Main dashboard with all the market intelligence features.
 * This is the original App.tsx content extracted into a page component.
 */

import { useState, lazy, Suspense } from 'react';

import { Menu, Bell, Settings, Brain, Heart, Cloud, Zap, Target, LogOut, User, X, AlertCircle, Trophy, Lightbulb, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useCryptoPrice } from '@/hooks/useCryptoPrice';
import { useFearGreed } from '@/hooks/useFearGreed';
import { useStockQuote } from '@/hooks/useStockQuote';

import { useAuthStore, selectIsAdmin } from '../../services/auth';

// Eager imports - Overview tab components (critical for first paint)
import { BackendStatusBanner } from '../components/BackendStatusBanner';
import { DailyScoreCard } from '../components/DailyScoreCard';
import { EconomicCalendar } from '../components/EconomicCalendar';
import { EngagementStats } from '../components/EngagementStats';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { LastUpdateIndicator } from '../components/LastUpdateIndicator';
import { MarketCard } from '../components/MarketCard';
import { MorningBrief } from '../components/MorningBrief';
import { QuickPulse } from '../components/QuickPulse';
import { NewsFeed } from '../components/NewsFeed';

// Real data hooks

// UI Components (small, always needed)
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

// Error handling and loading states
import { TabLoadingFallback } from '../components/LoadingFallback';

// Lazy loaded components - Tab-specific (loaded on demand)
const MarketHeartbeat = lazy(() => import('../components/MarketHeartbeat').then(m => ({ default: m.MarketHeartbeat })));
const MarketWeather = lazy(() => import('../components/MarketWeather').then(m => ({ default: m.MarketWeather })));
const MarketDNA = lazy(() => import('../components/MarketDNA').then(m => ({ default: m.MarketDNA })));
const SignalStories = lazy(() => import('../components/SignalStories').then(m => ({ default: m.SignalStories })));
const PatternArchaeology = lazy(() => import('../components/PatternArchaeology').then(m => ({ default: m.PatternArchaeology })));

// Lazy loaded - Advanced tab components
const MarketMoodRing = lazy(() => import('../components/MarketMoodRing').then(m => ({ default: m.MarketMoodRing })));
const MarketOrchestra = lazy(() => import('../components/MarketOrchestra').then(m => ({ default: m.MarketOrchestra })));
const DominoEffectTracker = lazy(() => import('../components/DominoEffectTracker').then(m => ({ default: m.DominoEffectTracker })));
const FlowTracker = lazy(() => import('../components/FlowTracker').then(m => ({ default: m.FlowTracker })));
const TradingTarot = lazy(() => import('../components/TradingTarot').then(m => ({ default: m.TradingTarot })));
const MarketLayers = lazy(() => import('../components/MarketLayers').then(m => ({ default: m.MarketLayers })));

// Lazy loaded - Learning tab components
const KnowledgeTree = lazy(() => import('../components/KnowledgeTree').then(m => ({ default: m.KnowledgeTree })));
const VocabularyBuilder = lazy(() => import('../components/VocabularyBuilder').then(m => ({ default: m.VocabularyBuilder })));
const DailyChallenges = lazy(() => import('../components/DailyChallenges').then(m => ({ default: m.DailyChallenges })));
const AchievementStories = lazy(() => import('../components/AchievementStories').then(m => ({ default: m.AchievementStories })));

// Lazy loaded - Overview secondary components (lower priority)
const MarketPersonas = lazy(() => import('../components/MarketPersonas').then(m => ({ default: m.MarketPersonas })));
const TimeCrystals = lazy(() => import('../components/TimeCrystals').then(m => ({ default: m.TimeCrystals })));
const RiskCompass = lazy(() => import('../components/RiskCompass').then(m => ({ default: m.RiskCompass })));
const PositionBuilder = lazy(() => import('../components/PositionBuilder').then(m => ({ default: m.PositionBuilder })));
const MarketMatrix = lazy(() => import('../components/MarketMatrix').then(m => ({ default: m.MarketMatrix })));
const ComparisonEngine = lazy(() => import('../components/ComparisonEngine').then(m => ({ default: m.ComparisonEngine })));
const SocialTribes = lazy(() => import('../components/SocialTribes').then(m => ({ default: m.SocialTribes })));

// Notification type definition
interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'alert' | 'achievement' | 'insight' | 'reminder';
}

export function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const isAdmin = useAuthStore(selectIsAdmin);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Fetch real market data for market overview cards
  const { data: spyData, loading: spyLoading } = useStockQuote({ symbol: 'SPY' });
  const { data: btcData, loading: btcLoading } = useCryptoPrice({ symbol: 'BTC' });
  const { data: ewjData, loading: ewjLoading } = useStockQuote({ symbol: 'EWJ' }); // Japan ETF for global
  const { data: gldData, loading: gldLoading } = useStockQuote({ symbol: 'GLD' }); // Gold ETF for commodities
  const { data: fearGreedData } = useFearGreed();

  // Build market data from real API data
  const marketData = [
    {
      id: 'us-equities',
      name: 'US Equities',
      value: spyData ? `$${spyData.price.toFixed(2)}` : 'Loading...',
      change: spyData?.changePercent ?? 0,
      sentiment: (spyData?.changePercent ?? 0) > 0.5 ? 'positive' as const : (spyData?.changePercent ?? 0) < -0.5 ? 'negative' as const : 'neutral' as const,
      volume: spyData?.volume ? `$${(spyData.volume / 1000000000).toFixed(1)}B` : '-',
      imageUrl: 'https://images.unsplash.com/photo-1651341050677-24dba59ce0fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdG9jayUyMG1hcmtldCUyMHRyYWRpbmd8ZW58MXx8fHwxNzY2MDY0MjkxfDA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 'crypto',
      name: 'Cryptocurrency',
      value: btcData ? `$${btcData.price.toLocaleString()}` : 'Loading...',
      change: btcData?.changePercent24h ?? 0,
      sentiment: (btcData?.changePercent24h ?? 0) > 0.5 ? 'positive' as const : (btcData?.changePercent24h ?? 0) < -0.5 ? 'negative' as const : 'neutral' as const,
      volume: btcData?.volume24h ? `$${(btcData.volume24h / 1000000000).toFixed(1)}B` : '-',
      imageUrl: 'https://images.unsplash.com/photo-1659010878130-ae8b703bd3ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcnlwdG9jdXJyZW5jeSUyMGJpdGNvaW58ZW58MXx8fHwxNzY2MTQ3Njk5fDA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 'global',
      name: 'Global Markets',
      value: ewjData ? `$${ewjData.price.toFixed(2)}` : 'Loading...',
      change: ewjData?.changePercent ?? 0,
      sentiment: (ewjData?.changePercent ?? 0) > 0.5 ? 'positive' as const : (ewjData?.changePercent ?? 0) < -0.5 ? 'negative' as const : 'neutral' as const,
      volume: ewjData?.volume ? `$${(ewjData.volume / 1000000).toFixed(1)}M` : '-',
      imageUrl: 'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnbG9iYWwlMjBlY29ub215fGVufDF8fHx8MTc2NjE2MTUyM3ww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 'commodities',
      name: 'Commodities',
      value: gldData ? `$${gldData.price.toFixed(2)}` : 'Loading...',
      change: gldData?.changePercent ?? 0,
      sentiment: (gldData?.changePercent ?? 0) > 0.5 ? 'positive' as const : (gldData?.changePercent ?? 0) < -0.5 ? 'negative' as const : 'neutral' as const,
      volume: gldData?.volume ? `$${(gldData.volume / 1000000).toFixed(1)}M` : '-',
      imageUrl: 'https://images.unsplash.com/photo-1608222351212-18fe0ec7b13b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGFuYWx5dGljc3xlbnwxfHx8fDE3NjYxMDI2Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080'
    }
  ];

  // Calculate daily score from real data (rounded to whole numbers)
  const dailyScore = Math.round(fearGreedData?.score ?? 50);
  const dailyChange = Math.round((spyData?.changePercent ?? 0) * 10) / 10; // 1 decimal
  const dailyMood = dailyScore >= 55 ? 'bullish' : dailyScore <= 45 ? 'bearish' : 'neutral';
  const dailySummary = spyData && fearGreedData
    ? `Markets ${spyData.changePercent >= 0 ? 'showing gains' : 'experiencing losses'} with SPY ${spyData.changePercent >= 0 ? 'up' : 'down'} ${Math.abs(spyData.changePercent).toFixed(2)}%. Sentiment is ${fearGreedData.rating || fearGreedData.label || (fearGreedData.score >= 55 ? 'greedy' : fearGreedData.score <= 45 ? 'fearful' : 'neutral')} with Fear & Greed at ${Math.round(fearGreedData.score)}. ${btcData ? `Bitcoin ${btcData.changePercent24h >= 0 ? 'rising' : 'falling'} ${Math.abs(btcData.changePercent24h).toFixed(2)}%.` : ''}`
    : 'Loading market data...';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleDismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
    setShowNotifications(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-gray-900/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                aria-label="Open menu"
                className="lg:hidden text-white hover:bg-white/10"
                size="icon"
                variant="ghost"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    1MarketPulse
                  </h1>
                  <p className="text-xs text-gray-400 hidden sm:block">Your Smart Market Companion</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge className="hidden sm:flex bg-purple-500/20 text-purple-300 border-purple-400/30">
                {isAdmin ? 'Admin' : 'Active Learner'}
              </Badge>
              {/* Notifications */}
              <div className="relative">
                <Button
                  aria-expanded={showNotifications}
                  aria-label="View notifications"
                  className="text-white hover:bg-white/10 relative"
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setShowUserMenu(false);
                  }}
                >
                  <Bell className="w-5 h-5" />
                  {notifications.length > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </Button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 rounded-lg bg-gray-800 border border-white/10 shadow-xl overflow-hidden">
                    <div className="p-4 border-b border-white/10 flex items-center justify-between">
                      <h3 className="text-white font-semibold">Notifications</h3>
                      {notifications.length > 0 && (
                        <Button
                          className="text-xs text-gray-400 hover:text-white"
                          size="sm"
                          variant="ghost"
                          onClick={handleClearAllNotifications}
                        >
                          Clear All
                        </Button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-gray-400">
                          <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No notifications</p>
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors group"
                          >
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-lg ${
                                notification.type === 'alert' ? 'bg-red-500/20 text-red-400' :
                                notification.type === 'achievement' ? 'bg-yellow-500/20 text-yellow-400' :
                                notification.type === 'insight' ? 'bg-blue-500/20 text-blue-400' :
                                'bg-purple-500/20 text-purple-400'
                              }`}>
                                {notification.type === 'alert' && <AlertCircle className="w-4 h-4" />}
                                {notification.type === 'achievement' && <Trophy className="w-4 h-4" />}
                                {notification.type === 'insight' && <Lightbulb className="w-4 h-4" />}
                                {notification.type === 'reminder' && <Clock className="w-4 h-4" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white">{notification.title}</p>
                                <p className="text-xs text-gray-400 truncate">{notification.message}</p>
                                <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                              </div>
                              <Button
                                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white p-1"
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDismissNotification(notification.id)}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="relative">
                <Button
                  aria-label="User menu"
                  className="text-white hover:bg-white/10"
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    setShowUserMenu(!showUserMenu);
                    setShowNotifications(false);
                  }}
                >
                  <User className="w-5 h-5" />
                </Button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 rounded-lg bg-gray-800 border border-white/10 shadow-xl overflow-hidden">
                    <div className="p-4 border-b border-white/10">
                      <p className="text-sm text-gray-400">Signed in as</p>
                      <p className="text-white font-medium truncate">{user?.email}</p>
                    </div>
                    <div className="p-2">
                      {isAdmin && (
                        <>
                          <button
                            className="w-full flex items-center gap-3 px-4 py-2 text-left text-white hover:bg-white/10 rounded-lg transition-colors"
                            onClick={() => {
                              navigate('/admin');
                              setShowUserMenu(false);
                            }}
                          >
                            <Settings className="w-4 h-4" />
                            Admin Dashboard
                          </button>
                          <button
                            className="w-full flex items-center gap-3 px-4 py-2 text-left text-white hover:bg-white/10 rounded-lg transition-colors"
                            onClick={() => {
                              navigate('/admin/settings');
                              setShowUserMenu(false);
                            }}
                          >
                            <Settings className="w-4 h-4" />
                            System Settings
                          </button>
                        </>
                      )}
                      <button
                        className="w-full flex items-center gap-3 px-4 py-2 text-left text-red-400 hover:bg-white/10 rounded-lg transition-colors"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="lg:hidden bg-gray-800/95 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <nav className="grid grid-cols-2 gap-2">
              {[
                { id: 'overview', label: 'Overview', icon: Brain },
                { id: 'heartbeat', label: 'Heartbeat', icon: Heart },
                { id: 'weather', label: 'Weather', icon: Cloud },
                { id: 'advanced', label: 'Advanced', icon: Zap },
                { id: 'learning', label: 'Learning', icon: Target },
                { id: 'stories', label: 'Stories', icon: null, emoji: '📖' },
                { id: 'patterns', label: 'Patterns', icon: null, emoji: '🏺' },
                { id: 'dna', label: 'DNA', icon: null, emoji: '🧬' },
              ].map((item) => (
                <button
                  key={item.id}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-gray-900/50 text-gray-300 hover:bg-white/10'
                  }`}
                  onClick={() => {
                    setActiveTab(item.id);
                    setShowMobileMenu(false);
                  }}
                >
                  {item.icon ? (
                    <item.icon className="w-4 h-4" />
                  ) : (
                    <span>{item.emoji}</span>
                  )}
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Backend Health Check */}
        <BackendStatusBanner />

        {/* Engagement Stats - Session-based, no mock data */}
        <div className="mb-8">
          <EngagementStats />
        </div>

        {/* Last Update Indicator */}
        <div className="mb-6">
          <LastUpdateIndicator />
        </div>

        {/* Main Navigation Tabs */}
        <Tabs className="mb-8" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-8 lg:w-auto lg:inline-grid bg-gray-800/50 border border-white/10 gap-1">
            <TabsTrigger className="data-[state=active]:bg-blue-500/20" value="overview">
              <Brain className="w-4 h-4 mr-2" />
              <span className="hidden md:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger className="data-[state=active]:bg-red-500/20" value="heartbeat">
              <Heart className="w-4 h-4 mr-2" />
              <span className="hidden md:inline">Heartbeat</span>
            </TabsTrigger>
            <TabsTrigger className="data-[state=active]:bg-yellow-500/20" value="weather">
              <Cloud className="w-4 h-4 mr-2" />
              <span className="hidden md:inline">Weather</span>
            </TabsTrigger>
            <TabsTrigger className="data-[state=active]:bg-purple-500/20" value="dna">
              🧬 <span className="hidden md:inline ml-2">DNA</span>
            </TabsTrigger>
            <TabsTrigger className="data-[state=active]:bg-blue-500/20" value="stories">
              📖 <span className="hidden md:inline ml-2">Stories</span>
            </TabsTrigger>
            <TabsTrigger className="data-[state=active]:bg-orange-500/20" value="patterns">
              🏺 <span className="hidden md:inline ml-2">Patterns</span>
            </TabsTrigger>
            <TabsTrigger className="data-[state=active]:bg-green-500/20" value="advanced">
              <Zap className="w-4 h-4 mr-2" />
              <span className="hidden md:inline">Advanced</span>
            </TabsTrigger>
            <TabsTrigger className="data-[state=active]:bg-indigo-500/20" value="learning">
              <Target className="w-4 h-4 mr-2" />
              <span className="hidden md:inline">Learning</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab - Eager loaded critical components */}
          <TabsContent className="space-y-8 mt-6" value="overview">
            {/* Daily Score - Uses real market data */}
            <DailyScoreCard
              change={dailyChange}
              mood={dailyMood}
              score={dailyScore}
              summary={dailySummary}
            />

            {/* Quick Pulse - Uses real market data (no props needed, fetches internally) */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-4">Quick Pulse</h2>
              <QuickPulse />
            </div>

            {/* Morning Brief - AI-powered insights */}
            <MorningBrief persona="Active Learner" />

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
              <NewsFeed />
              <EconomicCalendar />
            </div>
          </TabsContent>

          {/* Heartbeat Tab - Lazy loaded */}
          <TabsContent className="mt-6" value="heartbeat">
            <ErrorBoundary>
              <Suspense fallback={<TabLoadingFallback />}>
                <MarketHeartbeat bpm={72} />
              </Suspense>
            </ErrorBoundary>
          </TabsContent>

          {/* Weather Tab - Lazy loaded */}
          <TabsContent className="mt-6" value="weather">
            <ErrorBoundary>
              <Suspense fallback={<TabLoadingFallback />}>
                <MarketWeather />
              </Suspense>
            </ErrorBoundary>
          </TabsContent>

          {/* DNA Tab - Lazy loaded */}
          <TabsContent className="mt-6" value="dna">
            <ErrorBoundary>
              <Suspense fallback={<TabLoadingFallback />}>
                <MarketDNA />
              </Suspense>
            </ErrorBoundary>
          </TabsContent>

          {/* Stories Tab - Lazy loaded */}
          <TabsContent className="mt-6" value="stories">
            <ErrorBoundary>
              <Suspense fallback={<TabLoadingFallback />}>
                <SignalStories />
              </Suspense>
            </ErrorBoundary>
          </TabsContent>

          {/* Patterns Tab - Lazy loaded */}
          <TabsContent className="mt-6" value="patterns">
            <ErrorBoundary>
              <Suspense fallback={<TabLoadingFallback />}>
                <PatternArchaeology />
              </Suspense>
            </ErrorBoundary>
          </TabsContent>

          {/* Advanced Tab - Lazy loaded */}
          <TabsContent className="space-y-8 mt-6" value="advanced">
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
          <TabsContent className="space-y-8 mt-6" value="learning">
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
            <p>© 2025 1MarketPulse - Your AI-Powered Market Intelligence Platform</p>
            <p className="mt-2 text-xs">Data updated every 15 minutes • AI Analysis powered by Llama 3.1</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
